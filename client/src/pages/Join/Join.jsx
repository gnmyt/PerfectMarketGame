import "./styles.sass";
import {useEffect, useState} from "react";
import Code from "@/pages/Join/states/Code";
import {socket} from "@/common/utils/socket.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHourglassHalf} from "@fortawesome/free-solid-svg-icons";
import Input from "@/pages/Join/states/Input/index.js";

export const Join = () => {
    const [state, setState] = useState("join");

    const handleEnd = () => {
        setState("end");
    }

    const onSubmissionReady = () => {
        setState("input");
    }

    useEffect(() => {
        socket.on("disconnect", handleEnd);
        socket.on("SUBMISSION_READY", onSubmissionReady);

        return () => {
            socket.off("disconnect", handleEnd);
            socket.off("SUBMISSION_READY", onSubmissionReady);
        }
    }, []);

    return (
        <div className="join-page">
            {state === "join" && <Code setState={setState}/>}
            {state === "waiting" && <FontAwesomeIcon icon={faHourglassHalf} bounce className="waiting-icon" /> }
            {state === "input" && <Input setState={setState}/>}
            {state === "end" && <div className="game-end">
                <h1>Ende</h1>
                <p>Das Spiel ist vorbei!</p>
            </div>}

        </div>
    );
}