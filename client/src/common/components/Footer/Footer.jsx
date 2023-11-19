import "./styles.sass";
import Logo from "@/common/images/bs2ab.png";
import {Link, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome, faVolumeHigh, faVolumeMute} from "@fortawesome/free-solid-svg-icons";
import {MusicContext} from "@/common/contexts/MusicContext.jsx";
import {useContext} from "react";

export const Footer = () => {
    const location = useLocation();

    const {musicEnabled, setMusicEnabled} = useContext(MusicContext);

    const isLegalPage = location.pathname === "/imprint" || location.pathname === "/privacy" || location.pathname === "/end";
    const isIngame = location.pathname === "/game" || location.pathname === "/end" || location.pathname === "/create";

    return (
        <footer>
            <div className={"footer-left" + ((isIngame || location.pathname === "/join")
                && location.pathname !== "/end" ? " ingame" : "")}>
                <a title="BS2AB" href="https://www.bs2ab.de/" target="_blank" rel="noreferrer" className="glassy footer-info">
                    <img src={Logo} alt="Logo"/>
                    <h2>Erstellt in Zusammenarbeit mit BS2AB</h2>
                </a>

                {isLegalPage && <Link className="glassy footer-home" to="/">
                        <FontAwesomeIcon icon={faHome}/>
                    </Link>}

                {isIngame && <div className="glassy footer-home"  onClick={() => setMusicEnabled(!musicEnabled)}>
                    <FontAwesomeIcon icon={musicEnabled ? faVolumeHigh : faVolumeMute}/>
                </div>}
            </div>

            <div className={"glassy footer-legal" + ((isIngame || location.pathname === "/join")
                && location.pathname !== "/end" ? " ingame" : "")}>
                <Link to={"/privacy"}>Datenschutz</Link>
                <Link to={"/imprint"}>Impressum</Link>
            </div>
        </footer>
    )
}