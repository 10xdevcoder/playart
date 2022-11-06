import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

function Navbar() {
  const { address, isConnected } = useAccount();

  return (
    <>
      <nav className={styles.Navbar}>
        <h3
          style={{ cursor: "pointer" }}
          onClick={() => {
            window.location = "/";
          }}
        >
          PLAY ART
        </h3>
        <div className={styles.Links}>
          {/*} <Link to={"/explore"}>Explore</Link> */}
          <Link to={"/draw"}>Create</Link>
          {isConnected ? (
            <Link to={`/account/${address}`}>Account</Link>
          ) : (
            <Link to={`/account`}>Account</Link>
          )}
          <ConnectButton
            showBalance={false}
            chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>
      </nav>
    </>
  );
}

export default Navbar;
