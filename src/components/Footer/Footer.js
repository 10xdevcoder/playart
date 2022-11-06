import { SiDiscord, /* SiTwitter,*/ SiGithub } from "react-icons/si";

import styles from "./Footer.module.scss";

export default function Footer({ activeSocial = true }) {
  return (
    <footer
      className={[styles.Footer, !activeSocial && styles.inactiveSocial].join(
        " "
      )}
    >
      <span className={styles.Copyright}>
        &copy; PLAY ART {new Date().getFullYear()}
      </span>
      <div className={styles.tAndC}>
        <span>Terms</span>
        <span>Built by Crispy</span>
      </div>
      <div className={styles.socials}>
        <a target={"_blank"} rel="noreferrer" href="https://github.com/xcrispy">
          <SiGithub size={25} fill="rgb(8, 8, 154)" />
        </a>
        <a
          target={"_blank"}
          rel="noreferrer"
          href="https://discord.gg/S9nGUhEH"
        >
          <SiDiscord size={25} fill="rgb(8, 8, 154)" />
        </a>
      </div>
    </footer>
  );
}
