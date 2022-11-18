import { SiDiscord, /* SiTwitter,*/ SiGithub } from "react-icons/si";

import styles from "./Footer.module.scss";

export default function Footer({ activeSocial = true }) {
  return (
    <footer
      className={[styles.Footer, !activeSocial && styles.inactiveSocial].join(
        " "
      )}
    >
      <span
        style={{ fontSize: "20px", color: "black", fontWeight: "500" }}
        className={styles.Copyright}
      >
        &copy; PLAY ART {new Date().getFullYear()}
      </span>
      <div
        style={{ fontSize: "17px", color: "black", fontWeight: "300" }}
        className={styles.tAndC}
      >
        <span>Built by PRAISE</span>
      </div>
      <div className={styles.socials}>
        <a
          target={"_blank"}
          rel="noreferrer"
          href="https://github.com/praise-eze"
        >
          <SiGithub size={25} fill="rgb(8, 8, 154)" />
        </a>
      </div>
    </footer>
  );
}
