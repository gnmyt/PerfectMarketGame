import Button from "@/common/components/Button";
import {faPaperPlane, faWarning} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import {socket} from "@/common/utils/socket.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const Input = ({setState, capital, setCost, setWin, settings}) => {

    const [price, setPrice] = useState(1000);
    const [amount, setAmount] = useState(10);

    const [error, setError] = useState("");

    const submit = () => {
        if ((settings.costPerCake * amount + settings.costPerRound) > capital) {
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
        setCost(settings.costPerCake * amount + settings.costPerRound);
        setWin((price * amount) - (settings.costPerCake * amount + settings.costPerRound));
    }, [price, amount]);

    if (!settings || Object.keys(settings).length === 0) return null;

    return (
        <>
            {error && <div className="error">
                <FontAwesomeIcon icon={faWarning} />
                <p>{error}</p>
            </div>}
            <div className="input-area">
                <h3>Preis</h3>
                <input type="number" placeholder="Preis" className="glassy" min={0} max={settings.maxPrice}
                       onChange={(e) => e.target.value <= settings.maxPrice && setPrice(e.target.value)} value={price}/>
            </div>
            <div className="input-area">
                <h3>Absatzmenge</h3>
                <input type="number" placeholder="Menge" className="glassy" min={1} max={settings.maxProduction}
                       onChange={(e) => e.target.value <= settings.maxProduction && setAmount(e.target.value)} value={amount}/>
            </div>
            <Button text="Abgeben" onClick={submit} icon={faPaperPlane} />
        </>
    )
}