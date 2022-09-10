import styles from "./footer.module.scss";
import email from "../../assets/icons/email.svg";

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
        <h5>Contato:</h5>
      <a href="mailto: alexandre.cerutti@live.com">
        <img src={email} alt="ícone do email" />
      </a>
      </div>
     
    </footer>
  );
}
