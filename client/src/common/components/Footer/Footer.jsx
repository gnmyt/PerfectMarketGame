import "./styles.sass";
import Logo from "@/common/images/bs2ab.png";
import {Link, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome} from "@fortawesome/free-solid-svg-icons";

export const Footer = () => {
    const location = useLocation();

    const isLegalPage = location.pathname === "/imprint" || location.pathname === "/privacy" || location.pathname === "/end";

    return (
        <footer>
            <div className="footer-left">
                <a className="glassy footer-info" href="https://www.bs2ab.de/" target="_blank" rel="noreferrer">
                    <img src={Logo} alt="Logo"/>
                    <h2>Erstellt in Zusammenarbeit mit BS2AB</h2>
                </a>

                {isLegalPage && <Link className="glassy footer-home" to="/">
                        <FontAwesomeIcon icon={faHome}/>
                    </Link>}
            </div>

            <div className="glassy footer-legal">
                <Link to={"/privacy"}>Datenschutz</Link>
                <Link to={"/imprint"}>Impressum</Link>
            </div>
        </footer>
    )
}