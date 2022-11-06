import React, { useEffect, useState } from "react";
import Moralis from "moralis-v1";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { Dna } from "react-loader-spinner";
import LoadingBar from "react-top-loading-bar";
import { useLocation } from "react-router-dom";

const InitializeArtPage = () => {
  const navigate = useNavigate();
  const [localDraft, setLocalDraft] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const { address, isConnected, isDisconnected } = useAccount();

  useEffect(() => {
    const loadMoralis = async () => {
      await Moralis.start({
        appId: process.env.REACT_APP_APPLICATION_ID,
        serverUrl: process.env.REACT_APP_SERVER_URL,
      });
    };
    loadMoralis();
    if (isCreating === false) {
      CreateArt();
    }
  }, []);

  const CreateArt = () => {
    setIsCreating(true);
    const ArtTestData = Moralis.Object.extend("ArtTestData");
    const artTestData = new ArtTestData();
    artTestData.set("ShowNavbar", false);
    artTestData.set("ShowColorPalette", false);
    artTestData.set("BrushColor", "#000000");
    artTestData.set("BrushRadius", 10);
    artTestData.set("LazyRadius", 1);
    artTestData.set("SavedData", "");
    artTestData.set("ArtName", "");
    artTestData.set("ArtSeed", Math.round(Math.random() * 1000000000));
    if (isConnected) {
      artTestData.set("ArtCreator", address);
      artTestData.set("AllowPublicEdit", false);
      artTestData.set("AllowPublicMint", false);
    } else if (isDisconnected) {
      artTestData.set("ArtCreator", "");
      artTestData.set("AllowPublicEdit", true);
      artTestData.set("AllowPublicMint", true);
    }
    artTestData.save().then(
      (artData) => {
        console.log("New object created with objectId: " + artData.id);
        console.log("New object created with route : " + `/art/${artData.id}`);
        setProgress(100);
        navigate(`/draw/${artData.id}`);
      },
      (error) => {
        console.log(
          "Failed to create new object, with error code: " + error.message
        );
      }
    );
  };
  const location = useLocation();
  useEffect(() => {
    for (var i = 0; i < 70; i++) {
      setProgress(i);
    }
  }, [location]);

  return (
    <>
      <LoadingBar
        color="#F76D6E"
        height="5px"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignitems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignitems: "center",
            justifyContent: "center",

            gap: "3em",
          }}
        >
          <h1 style={{ marginTop: "0.38em" }}>Creating Canvas </h1>
          <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      </div>
    </>
  );
};

export default InitializeArtPage;
