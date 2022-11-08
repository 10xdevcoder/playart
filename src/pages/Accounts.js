import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar/Navbar";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import styles from "./styles/Explore.module.scss";
import { useAccount, useSigner, useProvider } from "wagmi";
import { ArtNFTAddress, ArtNFTABI } from "../components/Addons/Extras";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import Emptybar from "../components/Emptybar/Emptybar";
import Box from "@mui/material/Box";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./styles/Account.scss";
import CanvasDraw from "../dependencies";
import Moralis from "moralis-v1";
export const Accounts = () => {
  const [value, setValue] = useState("1");

  const { address } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { account_address } = useParams();
  const [addressNfts, setAddressNFTs] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [DataQuery, setDataQuery] = useState([]);
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

    artTestDataquery.equalTo("ArtCreator", account_address);
    setProgress(50);
    const dataQuery = await artTestDataquery.find();
    setDataQuery(dataQuery);

    setProgress(100);
  };

  useEffect(() => {
    if (account_address.length === 42) {
      FecthNfts();
    }
  }, [address, account_address]);
  useEffect(() => {
    FecthNfts();
  }, []);

  const FecthNfts = async () => {
    // console.log("started");
    const ArtNFTContract = new ethers.Contract(
      ArtNFTAddress,
      ArtNFTABI,
      provider
    );
    // console.log(ArtNFTContract);
    const createtoken = await ArtNFTContract.addressNFT(account_address);
    setAddressNFTs(createtoken);
    // console.log(createtoken.length);
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <>
        <Box justifyContent={"center"} sx={{ width: "100%", marginTop: "3em" }}>
          <Tabs
            style={{ paddingLeft: "5em", paddingRight: "5em" }}
            defaultActiveKey="nftvalue"
            transition={true}
            id="noanim-tab-example"
            className="mb-3"
            fill
            justify
          >
            <Tab tabClassName="tab" eventKey="nftvalue" title="Art Minted">
              {" "}
              {addressNfts ? (
                <>
                  {addressNfts.length > 0 ? (
                    <>
                      <div style={{ margin: "3em 10%" }}>
                        {account_address.length === 42 ? (
                          <div>
                            <div>
                              <Row
                                xs={1}
                                sm={1}
                                md={2}
                                lg={3}
                                xl={3}
                                xxl={3}
                                className="g-4"
                              >
                                {addressNfts.map((nfts, index) => {
                                  // console.log(addressNfts);
                                  fetch(nfts.tokenurl)
                                    .then((response) => response.json())
                                    .then((data) => {
                                      setDescription(data.description);
                                      setName(data.name);
                                      setImage(data.image);
                                      // console.log(data);
                                    });
                                  return (
                                    <div
                                      onClick={() => {
                                        //  console.log("clicked");
                                        navigate(`/playart/${nfts.tokenid}`);
                                      }}
                                      className={styles.exploreCard}
                                      key={index}
                                    >
                                      <Col style={{ cursor: "pointer" }}>
                                        <Card>
                                          <Card.Img variant="top" src={image} />
                                          <Card.Body>
                                            <Card.Title>{name}</Card.Title>
                                            <Card.Text>{description}</Card.Text>
                                          </Card.Body>
                                        </Card>
                                      </Col>
                                    </div>
                                  );
                                })}

                                {/*  {Array.from({ length: 20 }).map((_, idx) => (
                  
                ))}*/}
                              </Row>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Emptybar
                          firstText={"No art minted"}
                          secondText={"Are you a creator ?"}
                          link={true}
                          buttonText={"Mint Art"}
                          linkurl={`${window.location.origin}/`}
                        />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div>
                  <h1>Loading ...</h1>
                </div>
              )}
            </Tab>
            <Tab tabClassName="tab" eventKey="artdraft" title="Art Draft">
              <div
                style={{
                  marginTop: "3em",
                  marginBottom: "10em",
                  marginLeft: "7em",
                }}
              >
                {DataQuery.length > 0 ? (
                  <>
                    {DataQuery.map((data, index) => {
                      return (
                        <div
                          onClick={() => {
                            navigate(`/draw/${data?.id}`);
                          }}
                          key={index}
                          className="test"
                          style={{
                            width: "fit-content",
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
                  </>
                ) : (
                  <div>
                    <Emptybar
                      firstText={"No art created"}
                      secondText={"Create art while connected"}
                      link={true}
                      buttonText={"Create art"}
                      linkurl={`${window.location.origin}/draw`}
                    />
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </Box>
      </>
    </div>
  );
};
