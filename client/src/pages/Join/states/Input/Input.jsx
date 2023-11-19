import Button from "@/common/components/Button";
import {faPaperPlane, faWarning} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {socket} from "@/common/utils/socket.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const Input = ({setState}) => {

    const [price, setPrice] = useState(1000);
    const [amount, setAmount] = useState(10);

    const [error, setError] = useState("");

    const submit = () => {
        socket.emit("SUBMIT", {price, amount}, (data) => {
            if (data) {
                setState("waiting");
            } else {
                setError("Inkorrekte Eingabe");
            }
        });
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setError("");
        }, 30000);

        return () => clearTimeout(timeout);
    }, [error]);

    return (
        <>
            {error && <div className="error">
                <FontAwesomeIcon icon={faWarning} />
                <p>{error}</p>
            </div>}
            <div className="input-area">
                <h3>Preis</h3>
                <input type="number" placeholder="Preis" className="glassy"
                       onChange={(e) => setPrice(e.target.value)} value={price}/>
            </div>
            <div className="input-area">
                <h3>Absatzmenge</h3>
                <input type="number" placeholder="Menge" className="glassy"
                       onChange={(e) => setAmount(e.target.value)} value={amount}/>
            </div>
            <Button text="Abgeben" onClick={submit} icon={faPaperPlane} />
        </>
    )
}