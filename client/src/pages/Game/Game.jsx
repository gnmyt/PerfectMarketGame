import {useContext, useEffect, useState} from "react";
import {GroupContext} from "@/common/contexts/GroupContext.jsx";
import {Navigate} from "react-router";
import "./styles.sass";
import Waiting from "@/pages/Game/states/Waiting";
import Calculate from "@/pages/Game/states/Calculate";
import Sound from "react-sound";
import HintSound from "@/common/sounds/hint.mp3";
import {MusicContext} from "@/common/contexts/MusicContext.jsx";

export const Game = () => {
    const {groups} = useContext(GroupContext);

    const [currentState, setCurrentState] = useState("hint");


    const {musicEnabled} = useContext(MusicContext);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrentState("waiting");
        }, 6000);

        return () => clearTimeout(timeout);
    }, []);

    if (groups.length === 0) return <Navigate to="/"/>;

    return (
        <div className="game-page">
            {currentState === "hint" && <>
                <Sound url={HintSound} playStatus={Sound.status.PLAYING} volume={musicEnabled ? 60 : 0} loop={false}/>
                <h2 className="hint">
                    <span>Ziel</span>: Erhalte durch den Verkauf von Kuchen
                    so viel Gewinn wie möglich.
                </h2>
            </>}
            {currentState === "waiting" && <Waiting setState={setCurrentState}/>}
            {currentState === "calculate" && <Calculate setState={setCurrentState}/>}
        </div>
    )
}