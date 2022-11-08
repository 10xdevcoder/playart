import React, { useEffect, useState } from "react";
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

export const Accounts = () => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { account_address } = useParams();
  const [addressNfts, setAddressNFTs] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();
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
                    buttonText={"Create art"}
                    linkurl={`${window.location.origin}/`}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <div>
            <h1></h1>
          </div>
        )}
      </>
    </div>
  );
};
