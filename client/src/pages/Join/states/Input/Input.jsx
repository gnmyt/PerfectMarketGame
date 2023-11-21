import Button from "@/common/components/Button";
import {faPaperPlane, faWarning} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {socket} from "@/common/utils/socket.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const Input = ({setState, capital, setCost, setWin}) => {

    const [price, setPrice] = useState(1000);
    const [amount, setAmount] = useState(10);

    const [error, setError] = useState("");

    const submit = () => {
        if ((1000 * amount + 4000) > capital) {
            setError("Zu wenig Kapital");
            return;
        }

        socket.emit("SUBMIT", {price, amount}, (data) => {
            if (data) {
                setState("waiting");
            } else {
                setError("Inkorrekte Eingabe");
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

    useEffect(() => {
        setCost(1000 * amount + 4000);
        setWin((price * amount) - (1000 * amount + 4000));
    }, [price, amount]);

    return (
        <>
            {error && <div className="error">
                <FontAwesomeIcon icon={faWarning} />
                <p>{error}</p>
            </div>}
            <div className="input-area">
                <h3>Preis</h3>
                <input type="number" placeholder="Preis" className="glassy" min={0} max={10000}
                       onChange={(e) => e.target.value <= 10000 && setPrice(e.target.value)} value={price}/>
            </div>
            <div className="input-area">
                <h3>Absatzmenge</h3>
                <input type="number" placeholder="Menge" className="glassy" min={1} max={20}
                       onChange={(e) => e.target.value <= 20 && setAmount(e.target.value)} value={amount}/>
            </div>
            <Button text="Abgeben" onClick={submit} icon={faPaperPlane} />
        </>
    )
}