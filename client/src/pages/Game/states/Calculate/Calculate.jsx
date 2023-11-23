import "./styles.sass";
import {GroupContext} from "@/common/contexts/GroupContext.jsx";
import {useContext, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faForward, faShoppingCart, faStop} from "@fortawesome/free-solid-svg-icons";
import InterfaceSound from "@/common/sounds/interface.mp3";
import Sound from "react-sound";
import {MusicContext} from "@/common/contexts/MusicContext.jsx";
import BeginSound from "@/common/sounds/begin.mp3";
import Button from "@/common/components/Button";
import {SettingsContext} from "@/common/contexts/SettingsProvider.jsx";
import {useNavigate} from "react-router";

const localeOptions = {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "never"
}

export const Calculate = ({setState, currentRound}) => {
    const {round, getGroupById, updateCapital, endRound, setRoundHistory} = useContext(GroupContext);

    const {rounds, demandTable, costPerCake, costPerRound} = useContext(SettingsContext);

    const navigate = useNavigate();

    const [animatedGroups, setAnimatedGroups] = useState([]);

    const {musicEnabled} = useContext(MusicContext);

    const [nachfrage, setNachfrage] = useState(0);
    const [showNewCapital, setShowNewCapital] = useState(false);

    const animateNext = () => {
        const current = round.shift();
        if (!current) return;
        let sold = current.amount < nachfrage ? current.amount : nachfrage;

        setNachfrage(nachfrage => nachfrage - sold);
        let profit = sold * current.price - (current.amount * costPerCake + costPerRound);

        let currentRound = {...current, profit, name: getGroupById(current.id).name, sold,
            newCapital: getGroupById(current.id).capital + profit};

        console.log(currentRound);

        setAnimatedGroups(old => [...old, currentRound]);

        updateCapital(current.id, currentRound.newCapital);
    }

    useEffect(() => {
        if (round.length === 0) {
            endRound();
            return;
        }

        const timeout = setTimeout(() => {
            animateNext();
        }, 3000);

        return () => clearTimeout(timeout);
    }, [animatedGroups]);

    useEffect(() => {
        if (animatedGroups.length === 0) return;

        setRoundHistory(history => [...history, animatedGroups]);

        const timeout = setTimeout(() => {
            setShowNewCapital(true);
        }, 3000);

        return () => clearTimeout(timeout);
    }, [round]);

    useEffect(() => {
        let avg = 0;
        let amount = 0;
        round.forEach(r => {
            avg += r.price * r.amount;
            amount += parseInt(r.amount);
        });

        avg /= amount;

        let nachfrage = 0;
        for (let key in demandTable) {
            if (avg >= parseInt(key)) nachfrage = demandTable[key];
        }

        setNachfrage(nachfrage);

        setAnimatedGroups([]);
    }, []);

    return (
        <div className="calculate-state">

            <div className="calculate-state-inner">
                <div className="calculate-container">
                    <div className="glassy current-round">
                        <h2>Runde {currentRound}</h2>
                    </div>
                    {animatedGroups.length === 0 && <>
                        <Sound url={BeginSound} playStatus={Sound.status.PLAYING} volume={musicEnabled ? 60 : 0} loop={false}/>
                        <h2 className="hint">Die Kuchen werden verkauft...</h2>
                    </>}
                    {animatedGroups.map((r, i) => {
                        return (
                            <div key={i} className="glassy round">
                                {animatedGroups.length - 1 === i && musicEnabled &&
                                    <Sound url={InterfaceSound} playStatus={Sound.status.PLAYING} volume={50} loop={false}/>}
                                <div className="round-item">
                                    <p>Unternehmen</p>
                                    <h2>{r.name}</h2>
                                </div>

                                <div className="round-item">
                                    <p>Absatzpreis</p>
                                    <h2>{r.price?.toLocaleString("de-DE", localeOptions)} €</h2>
                                </div>

                                <div className="round-item">
                                    <p>Menge</p>
                                    <h2>{r.amount} Kisten</h2>
                                </div>

                                <div className="round-item">
                                    <p>Verkauft</p>
                                    <h2>{r.sold} Kisten</h2>
                                </div>

                                {!showNewCapital && <div className="round-item">
                                    <p>Gewinn/Verlust</p>
                                    {r.profit > 0 && <h2 className="round-green">+ {r.profit?.toLocaleString("de-DE", localeOptions)} €</h2>}
                                    {r.profit < 0 && <h2 className="round-red">- {r.profit?.toLocaleString("de-DE", localeOptions)} €</h2>}
                                    {r.profit === 0 && <h2>0 €</h2>}
                                </div>}

                                {showNewCapital && <div className="round-item">
                                    <p>Kapital
                                        {r.profit > 0 && <span className="round-green"> + {r.profit?.toLocaleString("de-DE", localeOptions)} €</span>}
                                        {r.profit < 0 && <span className="round-red"> - {r.profit?.toLocaleString("de-DE", localeOptions)} €</span>}
                                        {r.profit === 0 && <span> (Unverändert)</span>}
                                    </p>
                                    <h2>{r.newCapital?.toLocaleString("de-DE", localeOptions)} €</h2>
                                </div>}
                            </div>
                        )
                    })}
                    <div className="button-area">
                        {showNewCapital && <Button text="Nächste Runde" onClick={() => setState("waiting")} icon={faForward}/>}
                        {showNewCapital && currentRound >= rounds && <Button text="Spiel beenden" onClick={() => navigate("/end")} icon={faStop}/>}
                    </div>
                </div>
                <div className="glassy customer" style={{marginTop: (6.2 * animatedGroups.length + 5.2) + "rem"}}>
                    <FontAwesomeIcon icon={faShoppingCart} />
                    <div className="customer-item">
                        <p>Nachfrage</p>
                        <h2 className="round-green">{nachfrage}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}