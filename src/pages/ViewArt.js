import React, { useEffect, useRef, useState } from "react";
import CanvasDraw from "../dependencies/index";
import styles from "./styles/ViewArt.module.scss";
import { PrettoSliderRear } from "../components/Addons/Slider";
import { PlayerSlider } from "../components/Addons/PlayerSlider";
import { BrushPreviewCircleWithIcon } from "../components/Addons/BrushPreviewCircle";
import { SpaceColony, Undo } from "@icon-park/react";
import Moralis from "moralis-v1";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { testdataLines, testDataUrl } from "../dependencies/testData";
import { RoundButtonInputArt } from "../components/RoundButton/RoundButtonTools";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import {
  ArtNFTABI,
  ArtNFTAddress,
  blobToFile,
  convertMsToTime,
  shortenText,
} from "../components/Addons/Extras";
import { useAccount } from "wagmi";
import MintModal from "../components/Modals/MintModal";
import InputArtField, {
  TextareaArtField,
} from "../components/Addons/InputArtField";
import { UilPen } from "@iconscout/react-unicons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNetwork, useSigner } from "wagmi";
import {
  base64toFile,
  dataURIToBlob,
  dataURLtoFile,
} from "../components/Addons/Base64toImageConverter";
import { NFTStorage } from "nft.storage";
import LoadingBar from "react-top-loading-bar";
import { Dna } from "react-loader-spinner";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";

export const ViewArt = () => {
  const { art_id } = useParams();
  const { address, isConnected } = useAccount();
  const [savedData, setSavedData] = useState();
  const [timeFrameValue, setTimeFrameValue] = useState(1);
  const [artdata, setArtData] = useState();
  const [artName, setArtName] = useState("");
  const [artDescription, setArtDescription] = useState("");
  const [artDateUpdated, setArtDateUpdated] = useState("");
  const [artSeed, setArtSeed] = useState(0);
  const [artCreator, setArtCreator] = useState("");
  const [publicMint, setPublicMint] = useState();
  const [maxTime, setMaxTime] = useState(1);
  const [loadimmediately, setLoadImmediately] = useState(true);
  const [isMintingArt, setIsMintingArt] = useState(false);
  const [artUrlData, setArtUrlData] = useState("");
  const { data: signer } = useSigner();
  const [error, setError] = useState(false);

  const [updates, setUpdates] = useState("");

  const [progress, setProgress] = useState(0);
  const [showMintModal, setShowMintModal] = useState(false);
  const [showArtPic, setShowArtPic] = useState(false);
  const { chain } = useNetwork();

  const loadableCanvas = useRef("");

  /************** NFT STORAGE CLIENT ******************* */
  const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;
  const NFTStorageClient = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  const Web3StorageClient = new Web3Storage({
    token: process.env.REACT_APP_WEB3_STORAGE_KEY,
  });

  useEffect(() => {
    const loadMoralis = async () => {
      await Moralis.start({
        appId: process.env.REACT_APP_APPLICATION_ID,
        serverUrl: process.env.REACT_APP_SERVER_URL,
        masterKey: process.env.REACT_APP_MASTER_KEY,
      });
    };
    loadMoralis();
    QueryData();
  }, []);
  useEffect(() => {}, []);

  const QueryData = async () => {
    const ArtTestData = Moralis.Object.extend("ArtTestData");
    // console.log("checking ...");
    const artTestDataquery = new Moralis.Query(ArtTestData);
    setProgress(20);
    artTestDataquery.get(art_id?.toString()).then(
      async (Dataquery) => {
        setSavedData(Dataquery?.attributes.SavedData);

        setArtName(Dataquery?.attributes.ArtName);
        setArtDateUpdated(Dataquery?.updatedAt);
        setArtSeed(Dataquery?.attributes.ArtSeed);
        setProgress(50);
        setArtCreator(Dataquery?.attributes.ArtCreator);
        setPublicMint(Dataquery?.attributes.AllowPublicMint);
        setArtUrlData(Dataquery?.attributes.ArtUrlData);

        setArtData(Dataquery);

        // console.log(artdata);
        // console.log(art_id);
        setProgress(100);
        setTimeout(function () {
          setLoadImmediately(false);
        }, 1500);
        /*
        fetch(`${Dataquery.attributes.postIPFSdata}`)
          .then((response) => response.json())
          .then((data) => setIPFSData(data));

        setData(Dataquery);
        */
      },
      (error) => {
        console.log(error);
        setError(true);
      }
    );
  };

  const mintArt = () => {
    if (!error) {
      if (isConnected && artName.length > 0 && artDescription.length > 0) {
        setIsMintingArt(true);
        saveToIpfs();
        console.log("minting...");
      } else {
        console.log("connect your wallet");
        setShowMintModal(false);
      }
    }
  };
  window.addEventListener("load", (event) => {
    setProgress(100);
  });

  const saveToIpfs = async () => {
    if (!error) {
      if (!isConnected) return;
      console.log("got here ok");
      setUpdates("Uploading to ipfs");
      const artStructure = {
        image: artUrlData,
        name: artName,
        description: artDescription,
        properties: {
          type: "art",
          authors: [
            {
              address: address,
            },
          ],
          details: {
            live_draw_art: savedData,
            raw_art_base64: artUrlData,
          },
        },
      };

      const artSaveData = new Blob([JSON.stringify(artStructure)]);
      const cid = await NFTStorageClient.storeBlob(artSaveData);
      setUpdates("Uploaded to ipfs");
      const ipfsdata = `https://nftstorage.link/ipfs/${cid}`;
      // console.log(ipfsdata);
      Mint(ipfsdata);
    }
  };

  const Mint = async (tokenUri) => {
    const ArtNFTContract = new ethers.Contract(
      ArtNFTAddress,
      ArtNFTABI,
      signer
    );
    try {
      const createtoken = await ArtNFTContract.createToken(tokenUri);
      setUpdates("Creating mint transaction");
      await createtoken.wait();
      setIsMintingArt(false);
      setUpdates("Minting successfull");
      return;
    } catch (e) {
      setUpdates("Error : " + e.message.slice(0, 26));
      setIsMintingArt(false);
      return;
    }
  };

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setShowArtPic(!showArtPic);
    }
  });

  return (
    <>
      <LoadingBar
        color="#F76D6E"
        height="5px"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />

      <div>
        <Navbar />
      </div>
      <br />

      <div className={styles.ViewArtStyles}>
        <div>
          <CanvasDraw
            style={{ borderRadius: "20px" }}
            disabled
            brushRadius={0}
            lazyRadius={0}
            immediateLoading={loadimmediately}
            hideGrid
            hideInterface
            canvasWidth={625}
            canvasHeight={642}
            ref={(canvasDraw) => (loadableCanvas.current = canvasDraw)}
            saveData={savedData}
            onLoadStart={() => {
              //  console.log("load started");
            }}
            onLoadEnd={() => {
              //  console.log("loaded ended");
            }}
            liveDrawTimeEject={(e) => {
              setTimeFrameValue(Number(((e * 5.06) / 1000).toFixed(0)));
              console.log(e);
            }}
            DrawingTime={(e) => {
              setMaxTime(Number((e / 1000).toFixed(0)));
              console.log(e);
            }}
          />
        </div>
        <br />
        <PlayerSlider>
          <BrushPreviewCircleWithIcon
            height="47px"
            width="70px"
            color="#7DCAEA"
            onClick={() => {
              loadableCanvas.current.loadSaveData(savedData);
            }}
          >
            <Undo theme="outline" size="25" fill="#000000" />
          </BrushPreviewCircleWithIcon>
          <PrettoSliderRear
            aria-readonly="true"
            valueLabelDisplay="auto"
            aria-label="pretto slider"
            sx={{ width: "100%", maxWidth: "400px", minWidth: "240px" }}
            style={{ color: "#7DCAEA" }}
            value={timeFrameValue}
            max={maxTime}
            min={1} /*
          onChange={(e) => {
            setTimeFrameValue(e.target.value);
          }}
          */
          />
          <span style={{ paddingRight: "1em" }}>{timeFrameValue}</span>
        </PlayerSlider>
      </div>
      {!error && (
        <div>
          <div className={styles.CreatorAndMint}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                lineHeight: "5em",
              }}
            >
              <h1
                style={{
                  fontSize: "50px",
                  fontWeight: "700",
                  padding: "0em",
                  margin: "0em",
                }}
              >
                {artName?.length > 0 ? artName : "Untitled"}
              </h1>
              <h1
                style={{
                  fontSize: "27px",
                  fontWeight: "300",
                  padding: "0em",
                  margin: "0em",
                }}
              >
                {artdata
                  ? convertMsToTime(
                      Math.abs(
                        new Date() -
                          new Date(
                            artDateUpdated.toString()?.replace(/-/g, "/")
                          )
                      )
                    ) + " ago"
                  : null}
              </h1>
              <div
                style={{
                  border: "2px solid black",
                  borderRadius: "40px",
                  backgroundColor: "#c0c8e340",
                }}
                className={styles.Fix}
              >
                <Jazzicon
                  seed={
                    artCreator.length > 40
                      ? jsNumberForAddress(artCreator)
                      : artSeed
                  }
                  diameter={50}
                  className={styles.Jazzicon}
                />

                <div className={styles.artistTag}>
                  <span className={styles.textOwner}>Created by </span>
                  <span className={styles.textOwnerAddress}>
                    {artCreator.length > 0
                      ? shortenText(`${artCreator}`)
                      : "Anon"}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <RoundButtonInputArt
                padding="1em 1.5em"
                width="230px"
                height="60px"
                borderRadius="38px"
                cursor="pointer"
                onClick={() => {
                  setShowMintModal(true);
                  setIsMintingArt(false);
                  setUpdates("");
                }}
              >
                <span
                  style={{
                    fontSize: "25px",
                    fontWeight: "600",
                  }}
                >
                  Mint this art
                </span>
              </RoundButtonInputArt>
            </div>
          </div>
          {showArtPic && (
            <div style={{ marginBottom: "7em" }}>
              <img alt="_test" src={artUrlData} />
            </div>
          )}
          <MintModal
            // size="md"
            widthclassname="modal-40w"
            show={showMintModal}
            onHide={() => setShowMintModal(false)}
          >
            <div style={{ margin: "1em 1em" }}>
              {isConnected ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  {publicMint || artCreator === address ? (
                    <>
                      <h3>Mint Art</h3>
                      <div
                        style={{
                          marginTop: "1em",
                          marginBottom: "0.5em",
                          width: "100%",
                        }}
                      >
                        <InputArtField
                          value={artName}
                          width="100%"
                          onChange={(e) => {
                            setArtName(e.target.value);
                          }}
                          placeholder="Untitled Art"
                          icon={<UilPen size="24" color="#00000" />}
                        />
                      </div>

                      <div
                        style={{
                          marginTop: "1em",
                          width: "100%",
                          marginBottom: "0.5em",
                        }}
                      >
                        <TextareaArtField
                          value={artDescription}
                          width="100%"
                          minHeight="100px"
                          maxHeight="400px"
                          onChange={(e) => {
                            setArtDescription(e.target.value);
                          }}
                          placeholder="Undescribed Art"
                          icon={<UilPen size="24" color="#00000" />}
                        />
                      </div>
                      <div
                        style={{
                          width: "100%",
                          marginTop: "1em",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <RoundButtonInputArt
                          padding="0.9em 1.1em"
                          width="50%"
                          height="50px"
                          borderRadius="38px"
                          cursor="pointer"
                          disabled={isMintingArt}
                          onClick={mintArt}
                        >
                          <span
                            style={{
                              fontSize: "25px",
                              fontWeight: "400",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {isMintingArt ? (
                              <span>
                                <Dna
                                  visible={true}
                                  height="60"
                                  width="50"
                                  ariaLabel="dna-loading"
                                  wrapperClass="dna-wrapper"
                                />
                                &nbsp; Mint
                              </span>
                            ) : (
                              "Mint"
                            )}
                          </span>
                        </RoundButtonInputArt>
                      </div>
                      <br />
                      <span style={{ color: "green", fontSize: "15px" }}>
                        {updates}
                      </span>
                    </>
                  ) : (
                    <div>
                      <div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "1em",
                          }}
                        >
                          <h3 style={{ fontWeight: "700" }}>
                            You do not have permission to mint this art{" "}
                          </h3>
                          <span style={{ fontWeight: "600", fontSize: "20px" }}>
                            request permission from art creator
                          </span>
                        </div>
                        <div>
                          <RoundButtonInputArt
                            padding="0.9em 1.1em"
                            width="100%"
                            height="50px"
                            borderRadius="38px"
                            cursor="pointer"
                            onClick={() => {
                              setShowMintModal(false);
                            }}
                          >
                            <span
                              style={{
                                fontSize: "25px",
                                fontWeight: "400",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              OK
                            </span>
                          </RoundButtonInputArt>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ marginBottom: "1.3em" }}>
                    <h3 style={{ fontWeight: "400" }}>
                      {!isConnected && "Your wallet is not connected"}
                      {chain?.id !== 80001 && isConnected && (
                        <div> Chain not supported</div>
                      )}
                    </h3>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      marginTop: "1em",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <ConnectButton.Custom>
                      {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                      }) => {
                        // Note: If your app doesn't use authentication, you
                        // can remove all 'authenticationStatus' checks
                        const ready =
                          mounted && authenticationStatus !== "loading";
                        const connected =
                          ready &&
                          account &&
                          chain &&
                          (!authenticationStatus ||
                            authenticationStatus === "authenticated");

                        return (
                          <RoundButtonInputArt
                            width="100%"
                            height="50px"
                            borderRadius="38px"
                            cursor="pointer"
                            //  onClick={connectWallet}
                          >
                            {/*
                   
                        */}

                            <div
                              {...(!ready && {
                                "aria-hidden": true,
                                style: {
                                  opacity: 0,
                                  pointerEvents: "none",
                                  userSelect: "none",
                                },
                              })}
                            >
                              {(() => {
                                if (!connected) {
                                  return (
                                    <span
                                      style={{ width: "100%" }}
                                      onClick={() => {
                                        openConnectModal();
                                        setShowMintModal(false);
                                      }}
                                    >
                                      Connect Wallet
                                    </span>
                                  );
                                }

                                if (chain.unsupported) {
                                  return (
                                    <span
                                      style={{ width: "100%" }}
                                      onClick={() => {
                                        openChainModal();
                                        setShowMintModal(false);
                                      }}
                                    >
                                      Wrong network
                                    </span>
                                  );
                                }

                                return (
                                  <div style={{ display: "flex", gap: 12 }}>
                                    {/*  <button
                                  onClick={openChainModal}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  type="button"
                                >
                                  {chain.hasIcon && (
                                    <div
                                      style={{
                                        background: chain.iconBackground,
                                        width: 12,
                                        height: 12,
                                        borderRadius: 999,
                                        overflow: "hidden",
                                        marginRight: 4,
                                      }}
                                    >
                                      {chain.iconUrl && (
                                        <img
                                          alt={chain.name ?? "Chain icon"}
                                          src={chain.iconUrl}
                                          style={{ width: 12, height: 12 }}
                                        />
                                      )}
                                    </div>
                                  )}
                                  {chain.name}
                                      </button>*/}
                                    <span
                                      style={{
                                        fontSize: "25px",
                                        fontWeight: "400",
                                      }}
                                      onClick={openAccountModal}
                                    >
                                      {account.displayName}
                                      {account.displayBalance
                                        ? ` (${account.displayBalance})`
                                        : ""}
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>
                          </RoundButtonInputArt>
                        );
                      }}
                    </ConnectButton.Custom>
                  </div>
                </div>
              )}
            </div>
          </MintModal>
        </div>
      )}
    </>
  );
};
