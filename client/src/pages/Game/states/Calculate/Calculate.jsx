import "./styles.sass";
import {GroupContext} from "@/common/contexts/GroupContext.jsx";
import {useContext, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import InterfaceSound from "@/common/sounds/interface.mp3";
import Sound from "react-sound";
import {MusicContext} from "@/common/contexts/MusicContext.jsx";
import BeginSound from "@/common/sounds/begin.mp3";

const localeOptions = {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "never"
}

export const Calculate = ({setState}) => {
    const {round, getGroupById, updateCapital, endRound} = useContext(GroupContext);

    const [animatedGroups, setAnimatedGroups] = useState([]);

    const {musicEnabled} = useContext(MusicContext);

    const [nachfrage, setNachfrage] = useState(0);

    const animateNext = () => {
        const current = round.shift();
        if (!current) return;

        let sold = current.amount < nachfrage ? current.amount : nachfrage;
        setNachfrage(nachfrage => nachfrage - sold);

        let profit = sold * current.price - (current.amount * 1000 + 4000);

        setAnimatedGroups(old => [...old, {...current, profit, name: getGroupById(current.id).name}]);

        updateCapital(current.id, getGroupById(current.id).capital + profit);
    }

    useEffect(() => {
        if (round.length === 0) {
            endRound();
            setTimeout(() => setState("waiting"), 8000);
            return;
        }

        const timeout = setTimeout(() => {
            animateNext();
        }, 3000);

        return () => clearTimeout(timeout);
    }, [animatedGroups]);

    useEffect(() => {
        let avg = 0;
        round.forEach(r => avg += r.price);
        avg /= round.length;

        setNachfrage(avg < 1800 ? 50 : avg > 2200 ? 30 : 40);
        setAnimatedGroups([]);
    }, []);

    return (
        <div className="calculate-state">

            <div className="calculate-container">
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
                                <p>Gewinn/Verlust</p>
                                {r.profit > 0 && <h2 className="round-green">+ {r.profit?.toLocaleString("de-DE", localeOptions)} €</h2>}
                                {r.profit < 0 && <h2 className="round-red">- {r.profit?.toLocaleString("de-DE", localeOptions)} €</h2>}
                                {r.profit === 0 && <h2>0 €</h2>}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="glassy customer" style={{marginTop: (6.2 * animatedGroups.length) + "rem"}}>
                <FontAwesomeIcon icon={faShoppingCart} />
                <div className="customer-item">
                    <p>Nachfrage</p>
                    <h2 className="round-green">{nachfrage}</h2>
                </div>
            </div>

        </div>
    );
}