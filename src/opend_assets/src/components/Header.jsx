import React from "react";
import "../../../../dist/opend_assets/main.css"
import logo from "../../assets/logo.png";
import homeImage from "../../assets/home-img.png";
import {
  BrowserRouter, 
  Link,
  Switch,
  Route
} from "react-router-dom";
import Minter from "./Minter";
import Gallery from "./Gallery";
import {opend} from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";

function Header() {


  const [userOwnedGallery, setOwnedGallery] = React.useState();
  const [ListingGallery, setListingGallery] = React.useState();

  async function getNFTs(){
    console.log("Loading user's NFTs...")
    try{
    const userNFTIds = await opend.getOwnedNFTs(CURRENT_USER_ID);
    console.log(userNFTIds)
    console.log("NFTs Loaded successfully!")
    setOwnedGallery(<Gallery title="My NFTs" ids={userNFTIds} role="collection"/>)}catch(err){
    console.log(err)
    }

    const listedNFTIds = await opend.getListedNFTs();
    console.log(listedNFTIds);
    setListingGallery(<Gallery title="Discover" ids={listedNFTIds} role="discover"/>)
  }

  React.useEffect(() => {
    getNFTs();
  }, [])

  return (
    <BrowserRouter forceRefresh={true}>
      <div className="app-root-1">
      <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
        <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
          <div className="header-left-4"></div>
          <img className="header-logo-11" src={logo} />
          <div className="header-vertical-9"></div>
          <h5 className="Typography-root header-logo-text"><Link to="/">OpenD</Link></h5>
          <div className="header-empty-6"></div>
          <div className="header-space-8"></div>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/discover">
              Discover
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/minter">
              Minter
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to="/collections">
            My NFTs
            </Link>
          </button>
        </div>
      </header>
    </div>
    <Switch>
      <Route path="/discover">
      {ListingGallery}
      </Route>
      
      <Route path="/minter">
      <Minter />
      </Route>

      <Route path="/collections">
      {userOwnedGallery}
      </Route>
      
      <Route path="/">
      <img className="bottom-space" src={homeImage} />
      </Route>
    
    </Switch>
    
    
    
    </BrowserRouter>
    
  );
}

export default Header;
