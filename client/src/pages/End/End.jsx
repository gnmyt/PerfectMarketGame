import "./styles.sass";
import {useContext, useEffect, useState} from "react";
import {socket} from "@/common/utils/socket.js";
import {GroupContext} from "@/common/contexts/GroupContext.jsx";
import Sound from "react-sound";
import ThemeSound from "@/common/sounds/end.mp3";
import {MusicContext} from "@/common/contexts/MusicContext.jsx";
import {Navigate} from "react-router";
import Button from "@/common/components/Button";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {SettingsContext} from "@/common/contexts/SettingsProvider.jsx";

const localeOptions = {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "never"
}

export const End = () => {

    const {groups, allGroups, roundHistory} = useContext(GroupContext);
    const {musicEnabled} = useContext(MusicContext);
    const {startCapital, costPerRound, costPerCake} = useContext(SettingsContext);

    const [roundShown, setRoundShown] = useState(roundHistory.length + 1);

    useEffect(() => {
        socket.disconnect();
        socket.connect();
    }, []);

    const nextRound = () => {
        if (roundShown === roundHistory.length + 1) return;
        setRoundShown(round => round + 1);
    }

    const prevRound = () => {
        if (roundShown === 1) return;
        setRoundShown(round => round - 1);
    }

    if (groups.length === 0 && allGroups.length === 0)
        return <Navigate to="/"/>;

    return (
        <div className="end-page">
            <Sound url={ThemeSound} playStatus={Sound.status.PLAYING} volume={musicEnabled ? 50 : 0} loop={true}/>

            <div className="end-content">
                <div className="end-header">
                    <h1>{roundShown === roundHistory.length + 1 ? "Endergebnis" : "Runde " + roundShown}</h1>

                    <div className="end-actions">
                        {roundShown !== 1 && <Button icon={faArrowLeft} onClick={prevRound}/>}
                        {roundShown !== roundHistory.length+1 && <Button icon={faArrowRight} onClick={nextRound} />}
                    </div>
                </div>

                {roundShown !== roundHistory.length + 1 && roundHistory[roundShown - 1].sort((a, b) => b.capital - a.capital).map(r => (
                    <div key={r.id} className="glassy group">
                        <div className="group-item">
                            <p>Unternehmen</p>
                            <h2>{r.name}</h2>
                        </div>

                        <div className="group-item">
                            <p>Absatzpreis</p>
                            <h2>{r.price?.toLocaleString("de-DE", localeOptions)} €</h2>
                        </div>

                        <div className="group-item">
                            <p>Menge</p>
                            <h2>{r.amount} Kisten</h2>
                        </div>

                        <div className="group-item">
                            <p>Verkauft</p>
                            <h2>{r.sold} Kisten</h2>
                        </div>

                        <div className="group-item">
                            <p>Kapital
                                {r.profit > 0 && <span
                                    className="group-green"> + {r.profit?.toLocaleString("de-DE", localeOptions)} €</span>}
                                {r.profit < 0 && <span
                                    className="group-red"> - {r.profit?.toLocaleString("de-DE", localeOptions)} €</span>}
                                {r.profit === 0 && <span> (Unverändert)</span>}
                            </p>
                            <h2>{r.newCapital?.toLocaleString("de-DE", localeOptions)} €</h2>
                        </div>
                    </div>
                ))}


                {roundShown === roundHistory.length + 1 && [...groups, ...allGroups].sort((a, b) => b.capital - a.capital).map(group => (
                    <div key={group.id} className="glassy group">
                        <div className="group-item">
                            <p>Unternehmen</p>
                            <h2>{group.name}</h2>
                        </div>

                        <div className="group-item">
                            <p>Startkapital</p>
                            <h2>25.000 €</h2>
                        </div>

                        <div className="group-item">
                            <p>Gewinn/Verlust</p>
                            {group.capital - startCapital > 0 &&
                                <h2 className="group-green">+ {(group.capital - startCapital)?.toLocaleString("de-DE", localeOptions)} €</h2>}
                            {group.capital - startCapital < 0 &&
                                <h2 className="group-red">- {(group.capital - startCapital)?.toLocaleString("de-DE", localeOptions)} €</h2>}
                            {group.capital - startCapital === 0 && <h2>0 €</h2>}
                        </div>

                        <div className="group-item">
                            <p>Firmenwert</p>
                            <h2>{group.capital < (costPerCake + costPerRound) ? "Pleite" : group.capital?.toLocaleString("de-DE", localeOptions) + " €"}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}