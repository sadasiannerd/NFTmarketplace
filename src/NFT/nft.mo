import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

actor class NFT (name : Text, owner: Principal, content: [Nat8]) {
    private let itemName = name;
    private var nftOwner = owner;
    private let imageBytes = content;

    public shared(msg) func whoami(): async Principal{
        return msg.caller;
    };

    public func getCanisterId(): async Principal { 
        return await whoami();
    };

    public query func getName(): async Text {
        return itemName;
    };

    public query func getOwner(): async Principal {
        return nftOwner;
    };
    
    public query func getAsset(): async [Nat8] {
        return imageBytes;
    };
    
    public shared(msg) func TransferOwnership(newOwner : Principal) : async Text {
        if (msg.caller == nftOwner){
            nftOwner := newOwner;
            return "Success";
        }else {
            return "Error: Not initiated by NFT owner.";
        }
    }
}

