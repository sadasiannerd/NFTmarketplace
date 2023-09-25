import type { Principal } from '@dfinity/principal';
export interface NFT {
  'TransferOwnership' : (arg_0: Principal) => Promise<string>,
  'getAsset' : () => Promise<Array<number>>,
  'getCanisterId' : () => Promise<Principal>,
  'getName' : () => Promise<string>,
  'getOwner' : () => Promise<Principal>,
  'whoami' : () => Promise<Principal>,
}
export interface _SERVICE extends NFT {}
