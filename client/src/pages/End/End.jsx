import "./styles.sass";
import {useContext, useEffect} from "react";
import {socket} from "@/common/utils/socket.js";
import {GroupContext} from "@/common/contexts/GroupContext.jsx";
import Sound from "react-sound";
import ThemeSound from "@/common/sounds/end.mp3";
import {MusicContext} from "@/common/contexts/MusicContext.jsx";

const localeOptions = {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "never"
}

export const End = () => {

    const {groups, allGroups} = useContext(GroupContext);
    const {musicEnabled} = useContext(MusicContext);

    useEffect(() => {
        socket.disconnect();
    }, []);

    return (
        <div className="end-page">
            <Sound url={ThemeSound} playStatus={Sound.status.PLAYING} volume={musicEnabled ? 50 : 0} loop={false}/>
            {[...groups, ...allGroups].map(group => (
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
                        {group.capital - 25000 > 0 &&
                            <h2 className="group-green">+ {(group.capital - 25000)?.toLocaleString("de-DE", localeOptions)} €</h2>}
                        {group.capital - 25000 < 0 &&
                            <h2 className="group-red">- {(group.capital - 25000)?.toLocaleString("de-DE", localeOptions)} €</h2>}
                        {group.capital - 25000 === 0 && <h2>0 €</h2>}
                    </div>

                    <div className="group-item">
                        <p>Firmenwert</p>
                        <h2>{group.capital < 5000 ? "Pleite" : group.capital?.toLocaleString("de-DE", localeOptions) + " €"}</h2>
                    </div>
                </div>
            ))}
        </div>
    );
}