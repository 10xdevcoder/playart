import React from "react";
import { loadExternalURL } from "../Addons/Extras";
import { RoundButtonInputArt } from "../RoundButton/RoundButtonTools";
import styles from "./Emptybar.module.scss";
const Emptybar = ({
  firstText,
  secondText,
  link = false,
  linkurl,
  buttonText,
}) => {
  return (
    <div
      style={{
        margin: "5em auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          border: "3px solid black",
          width: "70%",
          height: "fit-content",
          borderRadius: "30px",
          backgroundColor: "#c0c8e340",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "2em 2.5em",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            margin: "4em",
          }}
        >
          {firstText && (
            <h1 style={{ color: "black", fontSize: "60px", fontWeight: "100" }}>
              {firstText}
            </h1>
          )}
          {secondText && (
            <h1 style={{ color: "black", fontSize: "40px" }}>{secondText}</h1>
          )}
        </div>
        {link && (
          <div style={{ marginLeft: "auto" }}>
            <RoundButtonInputArt
              padding="1em 1.5em"
              width="230px"
              height="60px"
              borderRadius="38px"
              cursor="pointer"
              onClick={() => {
                loadExternalURL(linkurl, false);
              }}
            >
              <span
                style={{
                  fontSize: "25px",
                  fontWeight: "600",
                }}
              >
                {buttonText}
              </span>
            </RoundButtonInputArt>
          </div>
        )}
      </div>
    </div>
  );
};

export default Emptybar;
