import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHourglassHalf} from "@fortawesome/free-solid-svg-icons";
import {GroupContext} from "@/common/contexts/GroupContext.jsx";
import {useContext, useEffect, useState} from "react";
import {socket} from "@/common/utils/socket.js";
import {Navigate} from "react-router";

export const Waiting = ({setState}) => {

    const {groups, handleRound} = useContext(GroupContext);

    if (groups.length === 1) return <Navigate to="/end"/>;

    const [readyGroups, setReadyGroups] = useState([]);

    useEffect(() => {
        socket.on("RECEIVED", (submission) => {
            handleRound(submission);
            setReadyGroups(groups => [...groups, submission.id]);
        });

        socket.emit("SUBMISSION_READY");

        return () => {
            socket.off("RECEIVED");
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

        if (names.length === 1) return <span>{names[0]}</span>;

        let last = names.pop();

        return <><span>{names.join(", ")}</span> und <span>{last}</span></>;
    }

    return (
        <div className="waiting-state">
            <div className="waiting-area">
                <FontAwesomeIcon icon={faHourglassHalf} bounce/>
                <h2>Warten auf {getFriendlyNames()}</h2>
            </div>
            <div className="glassy info-area">
                <h2>Die Nachfrage</h2>
                <p>Die Nachfrage berechnet sich aus dem <b>Durchschnittspreis.</b></p>

                <p>Bei weniger als <span>1800€</span> liegt die Nachfrage bei <span>50</span>.</p>

                <p>Ist er über <span>1800€</span> liegt die Nachfrage bei <span>40</span>.</p>

                <p>Bei mehr als <span>2200€</span> liegt die Nachfrage bei <span>30</span>.</p>
            </div>
        </div>
    );
}