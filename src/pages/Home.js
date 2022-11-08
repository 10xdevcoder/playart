import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import LoadingBar from "react-top-loading-bar";
import Moralis from "moralis-v1";
import "./styles/Home.scss";
import CanvasDraw from "../dependencies";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [DataQuery, setDataQuery] = useState([]);
  const [error, setError] = useState();
  const [progress, setProgress] = useState(0);
  const viewablecanvas = useRef();
  const navigate = useNavigate();

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

  const QueryData = async () => {
    const ArtTestData = Moralis.Object.extend("ArtTestData");
    const artTestDataquery = new Moralis.Query(ArtTestData);
    setProgress(20);
    const dataQuery = await artTestDataquery.find();
    setDataQuery(dataQuery);
    setProgress(80);

    setProgress(100);
  };

  return (
    <div>
      <LoadingBar
        color="#F76D6E"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div>
        <Navbar />
      </div>
      <div style={{ marginTop: "4em" }}>
        <h2>Recently created</h2>
      </div>
      <div>
        <>
          {DataQuery ? (
            <>
              <div
                className="scroll"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {DataQuery.map((data, index) => {
                  return (
                    <div
                      onClick={() => {
                        navigate(`/art/${data?.id}`);
                      }}
                      key={index}
                      className="test"
                      style={{
                        margin: "1em",
                        cursor: "pointer",
                      }}
                    >
                      <CanvasDraw
                        style={{
                          borderRadius: "10px",
                          border: "3px solid black",
                        }}
                        disabled
                        brushRadius={0}
                        lazyRadius={0}
                        immediateLoading={true}
                        hideGrid
                        hideInterface
                        ref={(canvasDraw) =>
                          (viewablecanvas.current = canvasDraw)
                        }
                        saveData={data?.attributes.SavedData}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
        </>
      </div>
    </div>
  );
};

export default Home;
