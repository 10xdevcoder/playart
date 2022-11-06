# Play Art

## Project details

Play Art is a decentralized ART and NFT creation platform, for creating artistic NFT that have a weirdly unique prop called live drawing.

[More on project code logic](https://www.w3resource.com/html5-canvas/html5-canvas-lines.php)

### Project info

project created by praise with mentoring from 0xProf (ozipraisegod@gmail.com, you can also create an issue to contact me (i montor all my repos))

- This project uses NFT.storage to store the metadata following the ERC1155 format.

```js
const artStructure = {
  image: {The artwork in blob form},
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

https://github.com/praise-eze/playart/blob/7a7c4b50a2eac529f9bd54873cef90c87bab141d/src/pages/ViewArt.js#L61
https://github.com/praise-eze/playart/blob/7a7c4b50a2eac529f9bd54873cef90c87bab141d/src/pages/ViewArt.js#L160

- This project is deployed on the polygon mumbai blockchain and takes advantage of the fast transaction time & low gas cost it has.

## Running the app

First, clone the repo with the following git command:

```
git clone https://github.com/praise-eze/playart.git
```

Second, open a terminal in the root directory of the project and run:

```
npm install
```

to install all the package dependencies for the project

Create a .env file in the root folder and populate it with the following variables:

```
REACT_APP_SERVER_URL =
REACT_APP_APPLICATION_ID =
REACT_APP_INFURA_ID =
REACT_APP_ALCHEMY_KEY =
REACT_APP_NFT_STORAGE_TOKEN =
REACT_APP_MORALIS_KEY =
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
