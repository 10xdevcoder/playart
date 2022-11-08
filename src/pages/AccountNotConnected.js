import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputArtField from "../components/Addons/InputArtField";
import Navbar from "../components/Navbar/Navbar";
import { UilPen } from "@iconscout/react-unicons";
import Emptybar from "../components/Emptybar/Emptybar";
import { RoundButtonInputArt } from "../components/RoundButton/RoundButtonTools";
import { useAccount } from "wagmi";

export const AccountNotConnected = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [_address, setAddress] = useState("");
  const search = (url) => {
    navigate(url);
  };
  useEffect(() => {
    if (isConnected) {
      search(`${address}`);
    }
  }, [isConnected, address]);

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div style={{ marginTop: "3em" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1em",
          }}
        >
          <div style={{ width: "50%" }}>
            <InputArtField
              value={_address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Search Address"
              icon={<UilPen size="24" color="#00000" />}
            />
          </div>
          <RoundButtonInputArt
            padding="1em 1.5em"
            width="230px"
            height="60px"
            borderRadius="38px"
            cursor="pointer"
            onClick={() => {
              if (_address.length == 42) {
                search(`${_address}`);
              } else {
                console.log("Address too short");
              }
            }}
          >
            <span
              style={{
                fontSize: "25px",
                fontWeight: "600",
              }}
            >
              Search
            </span>
          </RoundButtonInputArt>
        </div>
        <Emptybar
          firstText={"You are not connected"}
          secondText={"You can connect or search addresses"}
          link={false}
        />
      </div>
    </div>
  );
};
