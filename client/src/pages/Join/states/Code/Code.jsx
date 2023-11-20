import Button from "@/common/components/Button";
import {faRightToBracket, faWarning} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {socket} from "@/common/utils/socket.js";
import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useParams} from "react-router";

export const Code = ({setState}) => {

    const params = useParams();

    const [code, setCode] = useState(params.code || "");
    const [company, setCompany] = useState("");

    const [error, setError] = useState("");

    const joinRoom = () => {
        socket.emit("JOIN_ROOM", {code, name: company}, (data) => {
            if (data) {
                setState("waiting");
            } else {
                setError("Raum nicht gefunden");
            }
        });
    }

    useEffect(() => {
        if (!error) return;
        const timeout = setTimeout(() => {
            setError("");
        }, 5000);

        return () => clearTimeout(timeout);
    }, [error]);

    return (
        <>
            {error && <div className="error">
                <FontAwesomeIcon icon={faWarning} />
                <p>{error}</p>
            </div>}
            <div className="input-area">
                <h3>Raum-Code</h3>
                <input type="text" placeholder="Raum-Code" className="glassy"
                       onChange={(e) => setCode(e.target.value)} value={code}/>
            </div>
            <div className="input-area">
                <h3>Name des Unternehmens</h3>
                <input type="text" placeholder="Name des Unternehmens" className="glassy"
                       onChange={(e) => setCompany(e.target.value)} value={company}/>
            </div>
            <Button text="Beitreten" onClick={joinRoom} icon={faRightToBracket} />
        </>
    )
}