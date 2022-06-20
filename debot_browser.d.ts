/* tslint:disable */
/* eslint-disable */
/**
*/
export function init_log(): void;
/**
* Starts Terminal DeBot Browser with main DeBot.
*
* Fetches DeBot by address from blockchain and runs it according to pipechain.
* @param {any} url
* @param {any} wallet
* @param {any} pubkey
* @param {any} phrase
* @param {any} manifest
* @returns {Promise<any | undefined>}
*/
export function run_debot_browser(url: any, wallet: any, pubkey: any, phrase: any, manifest: any): Promise<any | undefined>;
/**
* Creates new instance of DeBot Browser and insert it into Global Browser Table.
* Returns handle as reference for the Browser. This handle can be used later to
* run Browser or to destroy it.
*
* endpoint - string with blockchain network url.
* debot_addr - string with DeBot address.
* default_wallet - optional user default wallet address. Used by UserInfo interface.
* default_pubkey - optional user public key. Used by UserInfo interface.
* @param {string} endpoint
* @param {string} debot_addr
* @param {string | undefined} default_wallet
* @param {string | undefined} default_pubkey
* @returns {Promise<BigInt>}
*/
export function create_browser(endpoint: string, debot_addr: string, default_wallet?: string, default_pubkey?: string): Promise<BigInt>;
/**
* Destroys DeBot browser by its handle.
* handle - DeBot Browser id in Browser Table.
* @param {BigInt} handle
* @returns {Promise<void>}
*/
export function destroy_browser(handle: BigInt): Promise<void>;
/**
* Runs previously created DeBot Browser instance.
*
* handle - number used as reference to DeBot Browser instance created by `create_browser`.
* manifest - optional object with DeBot manifest.
* @param {BigInt} handle
* @param {any} manifest
* @returns {Promise<any>}
*/
export function run_browser(handle: BigInt, manifest: any): Promise<any>;
/**
* Allows to update user settings in DeBot Browser
* This settings are used by UserInfo interface.
* handle - DeBot Browser id created by `create_browser`.
* settings - UserSettings object.
* @param {BigInt} handle
* @param {any} settings
* @returns {Promise<void>}
*/
export function update_user_settings(handle: BigInt, settings: any): Promise<void>;
/**
* Generates new ed25519 signing keypair
* @returns {any}
*/
export function generate_keypair(): any;
/**
* Allows to sign string inside DeBot Browser
* @param {any} keys
* @param {Uint8Array} unsigned
* @returns {any}
*/
export function sign(keys: any, unsigned: Uint8Array): any;
/**
* @param {BigInt} handle
* @param {any} dapp_box
* @returns {Promise<number>}
*/
export function register_signing_box(handle: BigInt, dapp_box: any): Promise<number>;
/**
* @param {BigInt} handle
* @param {number} sbox_handle
* @returns {Promise<void>}
*/
export function close_signing_box(handle: BigInt, sbox_handle: number): Promise<void>;
/**
* @param {BigInt} handle
* @param {number} sbox_handle
* @returns {Promise<any>}
*/
export function signing_box_public_key(handle: BigInt, sbox_handle: number): Promise<any>;
/**
* @param {string} data
* @returns {string}
*/
export function sha256(data: string): string;
/**
* @param {any} params
* @returns {string}
*/
export function chacha20(params: any): string;
/**
* @param {any} params
* @returns {string}
*/
export function scrypt(params: any): string;
/**
* @param {number} length
* @returns {string}
*/
export function generate_random_bytes(length: number): string;
