import styles from "./footer.module.scss";
import email from "../../assets/icons/email.svg";
import githubIcon from "../../assets/icons/github.svg"

export function Footer() {
  return (
    <footer className={styles.footer}>
      <a className={styles.api_link}
        href="https://www.weatherapi.com/"
        title="Free Weather API"
        target="_blank"
        rel="noreferrer"
      >
        Powered by WeatherAPI.com
      </a>
      <div className={styles.contact_info}>
      <a href="mailto: alexandre.cerutti@live.com">
        <img src={email} alt="ícone do email" />
      </a>
      <a href="https://github.com/Alex-Lima84">
        <img src={githubIcon} alt="ícone do github" />
      </a>
      </div>
     
    </footer>
  );
}
