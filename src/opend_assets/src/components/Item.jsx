import React from "react";
import logo from "../../assets/logo.png";
import {Actor, HttpAgent} from "@dfinity/agent";
import {idlFactory} from "../../../declarations/nft";
import {idlFactory as tokenIdlFactory} from "../../../declarations/token";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import {opend}from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item(props) {
  
  const [name, setName] = React.useState()
  const [owner, setOwner] = React.useState()
  const [image, setImage] = React.useState()
  const [priceInput, setPriceInput] = React.useState()
  const [button, setButton] = React.useState()
  const [loaderHidden, setLoaderHidden] = React.useState(true)
  const [blur, setBlur] = React.useState();
  const [sellStatus, setSellStatus] = React.useState()
  const [priceLabel, setPriceLabel] = React.useState()
  const [isProcessed, setIsProcessed] = React.useState(false);

  let price;
  

  const id = Principal.fromText(props.id);

  const localHost = "http://localhost:8080/";
  const agent =  new HttpAgent({host : localHost});

  //When deploying live, remove the following line:
  agent.fetchRootKey();

  let NFTActor;
  async function loadNFT() {
    NFTActor = await  Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    })
    let name = await NFTActor.getName();
    let owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(new Blob([imageContent.buffer], {type: "image/png"}))
    

    setName(name);
    setOwner(owner.toText());
    setImage(image);
    if(props.role === "collection")
    {const nftIsListed = await opend.isListed(id);

    if(nftIsListed){
      setSellStatus("Listed")
      setOwner("OpenD");
      setBlur({filter: "blur(4px)"});
    }
    else{
      setButton(<Button id={props.id} handleClick={handleClick} text="Sell"/>)
    }}else if(props.role === "discover"){
      const originalOwner = await opend.getOriginalOwner(id);
      if(originalOwner.toText() != CURRENT_USER_ID.toText()){
        setButton(<Button id={props.id} handleClick={handleBuy} text="Buy"/>)
      }
      let price = await opend.getListedNFTPrice(id);
      setPriceLabel(<PriceLabel sellPrice={price.toString()} />);
} 
  }
  async function handleBuy(){
    setLoaderHidden(false)
    console.log("Buy was triggered")
    const TokenActor = await  Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: Principal.fromText("wmio3-kqaaa-aaaaa-aaasq-cai"),
    })
    const owner = await opend.getOriginalOwner(id);
    const price = await opend.getListedNFTPrice(id);
    let result = await TokenActor.transfer(owner, price)
    if(result === "Success"){
      await opend.purchaseNFT(id, owner, CURRENT_USER_ID);
    };
    setLoaderHidden(true)
    setIsProcessed(true);

  }

  React.useEffect(() => {
    loadNFT();
  },[])

   function handleClick(id){
    setPriceInput((prevValue) => (<input
      placeholder="Price in DANG"
      type="number"
      className="price-input"
      value={price}
      onChange={(e) => {price=e.target.value}}
    />));
    setButton(<Button id={id} handleClick={SellItem} text="Confirm"/>)
      
  }
  async function SellItem(id){
    setBlur({filter: "blur(4px)"})
    setLoaderHidden(false)
      console.log("Listing...")
      const listingResult = await opend.listItem(Principal.fromText(id), Number(price));
      console.log("listing: " + listingResult)
      if(listingResult === "Success") {
        console.log("Getting OpenD Cannister ID...")
        let openDID = await getOpenDID();
        console.log("Transfering ownership...")
        let transferResult = await NFTActor.TransferOwnership(openDID)
        console.log(transferResult)
      }
      setLoaderHidden(true);
      setButton();
      setPriceInput();
      setOwner("OpenD")
  }

  async function getOpenDID(){
    return await opend.getCanisterId();
  }

  return (
    <div style={{display: isProcessed? "none" : "in-line"}} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          style={blur}
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="lds-ellipsis" hidden={loaderHidden}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <div className="disCardContent-root">
        {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner:{owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}
export default Item;
