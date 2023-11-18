import {useContext, useEffect, useState} from "react";
import {GroupContext} from "@/common/contexts/GroupContext.jsx";
import {Navigate} from "react-router";
import "./styles.sass";
import Waiting from "@/pages/Game/states/Waiting";
import {socket} from "@/common/utils/socket.js";
import Calculate from "@/pages/Game/states/Calculate/index.js";

export const Game = () => {
    const {groups} = useContext(GroupContext);

    const [currentState, setCurrentState] = useState("hint");

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrentState("waiting");
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);

    if (groups.length === 0) return <Navigate to="/"/>;

    return (
        <div className="game-page">
            {currentState === "hint" && <h2 className="hint"><span>Ziel</span>: Erhalte durch den Verkauf von Kuchen
                so viel Gewinn wie möglich.</h2>}
            {currentState === "waiting" && <Waiting setState={setCurrentState}/>}
            {currentState === "calculate" && <Calculate setState={setCurrentState}/>}
        </div>
    )
}