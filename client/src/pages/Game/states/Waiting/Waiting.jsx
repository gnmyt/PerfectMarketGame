import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHourglassHalf} from "@fortawesome/free-solid-svg-icons";
import {GroupContext} from "@/common/contexts/GroupContext.jsx";
import {useContext, useEffect, useState} from "react";
import {socket} from "@/common/utils/socket.js";
import {Navigate} from "react-router";
import Sound from "react-sound";
import BackgroundMusic from "@/common/sounds/background.mp3";
import {MusicContext} from "@/common/contexts/MusicContext.jsx";
import {SettingsContext} from "@/common/contexts/SettingsProvider.jsx";

export const Waiting = ({setState}) => {

    const {groups, handleRound} = useContext(GroupContext);

    if (groups.length <= 1) return <Navigate to="/end"/>;

    const [readyGroups, setReadyGroups] = useState([]);
    const [firstHint, setFirstHint] = useState(true);
    const {musicEnabled} = useContext(MusicContext);
    const {demandTable, costPerRound, costPerCake} = useContext(SettingsContext);

    useEffect(() => {
        socket.on("RECEIVED", (submission) => {
            handleRound(submission);
            setReadyGroups(groups => [...groups, submission.id]);
        });

        const interval = setInterval(() => {
            setFirstHint(current => !current);
        }, 15000);

        socket.emit("SUBMISSION_READY");

        return () => {
            socket.off("RECEIVED");
            clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        if (readyGroups.length === groups.length) {
            setState("calculate");
        }
    }, [readyGroups]);

    const getFriendlyNames = () => {
        let notReady = groups.filter(group => !readyGroups.includes(group.id));
        let names = notReady.map(group => group.name);

        if (names.length === 0) {
            setState("calculate");
            return;
        }

        if (names.length === 1) return <span>{names[0]}</span>;

        let last = names.pop();

        return <>{names.map((name, index) => {
            if (index === names.length - 1) return <span>{name}</span>;

            return <><span>{name}</span>, </>;
        })} und <span>{last}</span></>;
    }

    return (
        <div className="waiting-state">
            <Sound url={BackgroundMusic} playStatus={Sound.status.PLAYING}
                     volume={musicEnabled ? 50 : 0} loop={true}/>

            <div className="waiting-area">
                <FontAwesomeIcon icon={faHourglassHalf} bounce/>
                <h2>Warten auf {getFriendlyNames()}</h2>
            </div>
            <div className="glassy info-area">

                <div className="info-area-content">
                    {firstHint && <>
                        <h2>Deine Firma</h2>
                        <p>Wie auch im echten Leben fallen deiner Firma <b>Produktionskosten</b> an.</p>

                        <p>Hier fallen pro Runde Fixkosten von <span>{costPerRound}</span> an.</p>

                        <p>Jede Kuchenkiste kostet dich zusätzlich <span>{costPerCake}€</span> in der Produktion.</p>

                        <p>Verkaufe also niemals <span>zu günstig</span>, sonst machst du Verluste.</p>
                    </>}
                    {!firstHint && <>
                    <h2>Die Nachfrage</h2>
                    <p>Die Nachfrage berechnet sich aus dem <b>Durchschnittspreis.</b></p>

                        <p>Bei weniger als <span>{Object.keys(demandTable)[1]}€</span> liegt die Nachfrage
                            bei <span>{Object.values(demandTable)[0]}</span>.</p>

                    {Object.keys(demandTable).map((key, index) => {
                        if (index === 0) return;
                        return (
                            <p key={index}>Bei einem Durchschnittspreis ab <span>{key}€</span> liegt die Nachfrage
                                bei <span>{demandTable[key]}</span>.</p>
                        );
                    })}
                    </>}
                </div>

                <div className="progress-bar" />
            </div>
        </div>
    );
}