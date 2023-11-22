import "./styles.sass";
import {useEffect, useState} from "react";
import Code from "@/pages/Join/states/Code";
import {socket} from "@/common/utils/socket.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHourglassHalf} from "@fortawesome/free-solid-svg-icons";
import Input from "@/pages/Join/states/Input";

const localeOptions = {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "never"
}

export const Join = () => {
    const [state, setState] = useState("join");

    const [capital, setCapital] = useState(25000);
    const [maxWin, setMaxWin] = useState(0);
    const [cost, setCost] = useState(0);

    const handleEnd = () => {
        setState("end");
    }

    const onCapitalChange = (data) => {
        setCapital(data.capital);
    }

    const onSubmissionReady = () => {
        setState("input");
    }

    useEffect(() => {
        socket.on("disconnect", handleEnd);
        socket.on("SUBMISSION_READY", onSubmissionReady);
        socket.on("CAPITAL", onCapitalChange);

        return () => {
            socket.off("disconnect", handleEnd);
            socket.off("SUBMISSION_READY", onSubmissionReady);
            socket.off("CAPITAL", onCapitalChange);
        }
    }, []);

    return (
        <div className="join-page">
            {cost !== 0 && <div className="glassy capital">
                <h2>Firmenkapital: {capital.toLocaleString("de-DE", localeOptions)} €</h2>
                <h3>Produktionskosten: <span className="in-red">- {cost.toLocaleString("de-DE", localeOptions)} €</span></h3>
                {maxWin > 0 && <h3>Potenzieller Gewinn: <span className="in-green">+ {maxWin.toLocaleString("de-DE", localeOptions)} €</span></h3>}
                {maxWin < 0 && <h3>Potenzieller Gewinn: <span className="in-red">- {maxWin.toLocaleString("de-DE", localeOptions)} €</span></h3>}
                {maxWin === 0 && <h3>Potenzieller Gewinn: <span className="in-yellow">0 €</span></h3>}
            </div>}
            {state === "join" && <Code setState={setState}/>}
            {state === "waiting" && <FontAwesomeIcon icon={faHourglassHalf} bounce className="waiting-icon" style={{marginTop: "1rem"}} /> }
            {state === "input" && <Input setState={setState} capital={capital} setWin={setMaxWin} setCost={setCost}/>}
            {state === "end" && <div className="game-end">
                <h1>Ende</h1>
                <p>Das Spiel ist vorbei!</p>
            </div>}

        </div>
    );
}