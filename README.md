# Play Art

## Project details

Play Art is a decentralized ART and NFT creation platform, for creating artistic NFT that have a weirdly unique prop called live drawing.

[More on project code logic](https://www.w3resource.com/html5-canvas/html5-canvas-lines.php)            


### Project info

project created by 0xpr0f to contact me create an issue to contact me

- This project uses NFT.storge to store the metadata with storeBlob in the following format.

```js
const artStructure = {
  image: {The artwork base64 in string},
  name: {The artwork name as string},
  description: {The artwork description as string},
  properties: {
    type: "art",
    authors: [
      {
        address: {The artwork minter address},
      },
    ],
    details: {
      live_draw_art: {The live drawable coordinates for the artwork in JSON string},
      raw_art_base64:  {The raw base64 for the image},
    },
  },
};
```

https://github.com/10xdevcoder/playart/blob/bbecf182726a478aa7229ecce8c9e0ad3e26ca30/src/pages/ViewArt.js#L70
https://github.com/10xdevcoder/playart/blob/bbecf182726a478aa7229ecce8c9e0ad3e26ca30/src/pages/ViewArt.js#L169

- This project is deployed on the polygon mumbai blockchain and takes advantage of the fast transaction time & low gas cost it has.

https://mumbai.polygonscan.com/address/0x195E173068DC793a43E18c5Eb2844b3823D81055

- This project used Moralis to store all the art and drawing (draft) so users can come back to work on them.


## Running the app

First, clone the repo with the following git command:

```
git clone https://github.com/10xdevcoder/playart.git
```

Second, open a terminal in the root directory of the project and run:

```
npm install
```

to install all the package dependencies for the project  
if that fails run `npm install --force`

Create a .env file in the root folder and populate it with the following variables:

```
REACT_APP_SERVER_URL =
REACT_APP_APPLICATION_ID =
REACT_APP_INFURA_ID =
REACT_APP_ALCHEMY_KEY =
REACT_APP_NFT_STORAGE_TOKEN =
REACT_APP_MORALIS_KEY =
REACT_APP_MASTER_KEY =
```

for testing, if you cannot get the env, pls leave an issue on the repo and i can setup some test envs
Finally, run the development server:

```
npm start
```

or

```
yarn start
```

preferably use chrome or brave for testing
___
Mainly developed by [@0xprof](https://github.com/0xpr0f)    
Play Art winner of Best Overall Project on Polygon chain    
https://developers.moralis.com/google-hackathon/winners/#winners
