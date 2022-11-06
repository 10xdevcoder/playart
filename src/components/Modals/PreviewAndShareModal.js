import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./MintModal.css";
import CanvasDraw from "../../dependencies";
import Moralis from "moralis-v1";
import {
  RoundButtonInputArt,
  RoundButtonTools,
} from "../RoundButton/RoundButtonTools";
import { UilEye } from "@iconscout/react-unicons";
import {
  copyToClipboard,
  loadExternalURL,
  shortenText,
} from "../Addons/Extras";
import { LinkTwo } from "@icon-park/react";
import { UilMultiply } from "@iconscout/react-unicons";
import InputArtField from "../Addons/InputArtField";
import { UilExternalLinkAlt } from "@iconscout/react-unicons";

const PreviewAndShareModal = (props) => {
  const previewCanvas = useRef("");
  const [creator, setCreator] = useState("");
  const [copied, setCopied] = useState(false);
  const loadMoralis = async () => {
    await Moralis.start({
      appId: process.env.REACT_APP_APPLICATION_ID,
      serverUrl: process.env.REACT_APP_SERVER_URL,
    });
  };
  useEffect(() => {
    loadMoralis();
    LoadData();
  }, []);
  useEffect(() => {
    setTimeout(() => setCopied(false), 4200);
  }, [copied]);

  const LoadData = async () => {
    const ArtTestData = Moralis.Object.extend("ArtTestData");
    const artTestDataquery = new Moralis.Query(ArtTestData);

    artTestDataquery
      .get(props.object_id?.toString())
      .then(async (Dataquery) => {
        previewCanvas.current.loadSaveData(Dataquery?.attributes.SavedData);
        setCreator(Dataquery?.attributes.ArtCreator);
      });
  };
  // props?.stuffs(LoadData);
  return (
    <div>
      <>
        <Modal dialogClassName="modal-70w" {...props} centered size="lg">
          <div style={{ padding: "1.5em 3em" }}>
            <>
              <div
                style={{
                  marginLeft: "auto",
                  width: "fit-content",
                }}
              >
                <RoundButtonTools
                  onClick={() => {
                    props.onHide();
                  }}
                >
                  <UilMultiply size="30" color="#00000" />
                </RoundButtonTools>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "3em",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1em",
                    alignItems: "center",
                    width: "fit-content",
                  }}
                >
                  <div>
                    <CanvasDraw
                      style={{
                        borderRadius: "20px",
                        border: "4px solid black",
                        boxShadow: "0 10px 20px rgb(0 0 0 / 0.8)",
                      }}
                      disabled
                      brushRadius={0}
                      lazyRadius={0}
                      immediateLoading={true}
                      hideGrid
                      hideInterface
                      canvasWidth={500}
                      canvasHeight={510}
                      //  saveData={props.previewcanvasdata}
                      ref={(canvasDraw) => (previewCanvas.current = canvasDraw)}
                    />
                  </div>
                  <div>
                    <RoundButtonInputArt
                      padding="1em 1.5em"
                      width="230px"
                      height="60px"
                      borderRadius="38px"
                      cursor="pointer"
                      onClick={() => {
                        loadExternalURL(
                          `${window.location.origin}/art/${props.object_id}`
                        );
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.7em",
                        }}
                      >
                        <span>
                          <UilEye size="30" color="#00000" />
                        </span>
                        <span
                          style={{
                            fontSize: "23px",

                            fontWeight: "600",
                          }}
                        >
                          View art
                        </span>
                      </div>
                    </RoundButtonInputArt>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "100%",

                    // padding: "3em 6em 3em 5em",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",

                      width: "100%",
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: "700",
                        fontSize: "32px",
                        color: "black",
                        padding: "none",
                        margin: "none",
                      }}
                    >
                      Share your art work
                    </h3>
                    <span
                      style={{
                        color: "black",
                        padding: "none",
                        margin: "none",
                      }}
                    >
                      created by{" "}
                      <span
                        style={{
                          fontWeight: "500",
                          fontSize: "24px",
                          color: "black",
                          padding: "none",
                          margin: "none",
                        }}
                      >
                        {creator?.length > 41 ? shortenText(creator) : "Anon"}
                      </span>
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: "1.5em",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      width: "100%",
                      gap: "1em",
                    }}
                  >
                    <InputArtField
                      value={`${window.location.host}/art/${props.object_id}`}
                      icon={
                        <UilExternalLinkAlt
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            loadExternalURL(
                              `${window.location.origin}/art/${props.object_id}`
                            );
                          }}
                          size="24"
                          color="#00000"
                        />
                      }
                    />

                    <div>
                      <RoundButtonInputArt
                        padding="1em 1.5em"
                        width="250px"
                        height="60px"
                        borderRadius="38px"
                        cursor="pointer"
                        onClick={() => {
                          copyToClipboard(
                            `${window.location.origin}/art/${props.object_id}`
                          );
                          setCopied(true);
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "content",
                            gap: ".7em",
                          }}
                        >
                          <span>
                            <LinkTwo theme="outline" size="28" fill="#000000" />
                          </span>
                          <span
                            style={{
                              fontSize: "22px",
                              fontWeight: "600",
                            }}
                          >
                            {!copied ? "Copy share link" : "Copied"}
                          </span>
                        </div>
                      </RoundButtonInputArt>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </div>
        </Modal>
      </>
    </div>
  );
};

export default PreviewAndShareModal;
