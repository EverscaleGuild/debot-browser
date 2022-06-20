<h1 align="center">
  <code>Standalone cli DeBot Browser</code>
</h1>

<p align="center">
  Standalone DeBot Browser written in Rust and compiled as WebAssembly
  <br />
  <br />
    
</p>

# Cli DeBot Browser

## Purpose

Run any DeBot in your website using DeBot Browser as Service.

## Getting Started

To get started, install `debot-browser`:

```sh
npm i debot-browser
```

Run DeBot:

```typescript
import * as browser from "debot-browser";

let defaultWallet = null; // or string with TON address
let defaultPubkey = null; // or string with public key
let keypair = {}; // Important: for test purposees only! Keypair is used to sign messages if needed.

// AppSigningBox impl
let userSigningBox = {};
userSigningBox.get_public_key = async () => {
    return keypair.public
}

userSigningBox.sign = async (unsigned) => {
    const res = browser.sign(keypair, unsigned)
    return res.signature
}

// predeployed DeBot to net.ton.dev
let debotAddress = "0:d2966f32136723cd8c64cab54cb9517fdb9d762196138487ec4629ec2e7f4c2b"; 

let manifest = `{
    "version": 0,
    "debotAddress": "${debotAddress}",
    "initMethod": "invokeTest",
    "initArgs": {
      "arg1": "1500000000",
      "arg2": "68656c6c6f20776f726c6421",
      "arg3": true,
      "arg4": 3,
      "arg5": "0:e859a5858fc99c8f6044aa179af68140c2fb9b07b3f52b70bef51e0c799fd2df",
      "arg6": "${defaultPubkey}",
      "arg7": {
        "1": {
          "data": "10"
        },
        "2": {
          "data": "2020"
        }
      }
    },
    "abi": {
      "ABI version": 2,
      "header": [],
      "functions": [
        {
          "name": "OnInvokeCompleted",
          "inputs": [
            {
              "name": "status",
              "type": "uint8"
            },
            {
              "components": [
                {
                  "name": "data",
                  "type": "bytes"
                }
              ],
              "name": "ret1",
              "type": "map(uint32,tuple)"
            }
          ],
          "outputs": []
        }
      ],
      "data": [],
      "events": []
    },
    "quiet": true,
    "chain": [
      {
        "type": "Input",
        "interface": "a1d347099e29c1624c8890619daf207bde18e92df5220a54bcc6d858309ece84",
        "method": "get",
        "params": {
          "value": "1500000000"
        }
      },
      {
        "type": "Input",
        "interface": "8796536366ee21852db56dccb60bc564598b618c865fc50c8b1ab740bba128e3",
        "method": "input",
        "params": {
          "value": "68656c6c6f20776f726c6421"
        }
      },
      {
        "type": "Input",
        "interface": "16653eaf34c921467120f2685d425ff963db5cbb5aa676a62a2e33bfc3f6828a",
        "method": "get",
        "params": {
          "value": true
        }
      },
      {
        "type": "Input",
        "interface": "ac1a4d3ecea232e49783df4a23a81823cdca3205dc58cd20c4db259c25605b48",
        "method": "select",
        "params": {
          "index": 3
        }
      },
      {
        "type": "Input",
        "interface": "d7ed1bd8e6230871116f4522e58df0a93c5520c56f4ade23ef3d8919a984653b",
        "method": "get",
        "params": {
          "value": "0:e859a5858fc99c8f6044aa179af68140c2fb9b07b3f52b70bef51e0c799fd2df"
        }
      }
    ]
}`;

(async () => {
    const browserHandle = await browser.create_browser("net.ton.dev", debotAddress, defaultWallet, defaultPubkey);
    const manifestObj = JSON.parse(manifest);
    
    // OPTIONAL
    let sboxHandle = await browser.register_signing_box(browserHandle, userSigningBox)
    await browser.update_user_settings(browserHandle, { 
        wallet: defaultWallet,
        pubkey: defaultPubkey,
        signing_box: sboxHandle
    });

    const result = await browser.run_browser(browserHandle, manifestObj);

    await browser.close_signing_box(browserHandle, sboxHandle)

    await browser.destroy_browser(browserHandle);

});
```