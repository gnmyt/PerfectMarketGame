import "./styles.sass";
import GitHubImage from "@/common/images/GitHub.png"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear, faPlus, faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {useRef, useState} from "react";
import {useNavigate} from "react-router";
import Dialog from "@/pages/Home/components/Dialog";

export const DONATION_LINK = "https://ko-fi.com/gnmyt";
export const GITHUB_LINK = "https://github.com/gnmyt/PerfectMarketGame";

export const Home = () => {

    const roomSettingsRef = useRef(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const navigate = useNavigate();

    const openCreateRoom = (event) => {
        event.preventDefault();

        if (event.target === roomSettingsRef.current || roomSettingsRef.current.contains(event.target)) return;

        navigate("/create");
    }

    const openRoomSettings = () => setSettingsOpen(!settingsOpen);

    return (
        <div className="home-page">
            {settingsOpen && <Dialog onClose={openRoomSettings}/>}
            <div className="glassy info-area">
                <h2>Worum geht's?</h2>
                <div className="info-area-inner">
                    <p>
                        Dies ist ein Lernspiel über den vollkommenen Markt.<br/><br/>

                        Anhand eines Kuchenmarktes finden deine Schüler heraus, wie Angebot und Nachfrage funktionieren
                        und welche Auswirkungen diese auf den Markt haben.
                    </p>
                    <p className="donate">
                        <a href={DONATION_LINK} target="_blank" rel="noreferrer">Lass doch eine Spende da</a>,
                        wenn dir das Spiel gefällt!
                    </p>
                    <a className="glassy github-link" href={GITHUB_LINK} target="_blank" rel="noreferrer">
                        <img src={GitHubImage} alt="GitHub Logo"/>
                        <h2>Source-Code ansehen</h2>
                    </a>
                </div>
            </div>
            <div className="action-area">

                <Link className="glassy action-btn create-btn" onClick={openCreateRoom}>
                    <FontAwesomeIcon icon={faPlus}/>
                    <FontAwesomeIcon icon={faGear} className="glassy gear" onClick={openRoomSettings} ref={roomSettingsRef}/>
                    <h2>Raum erstellen</h2>
                </Link>

                <Link className="glassy action-btn" to="/join">
                    <FontAwesomeIcon icon={faRightToBracket}/>
                    <h2>Raum beitreten</h2>
                </Link>

            </div>
        </div>
    )
}