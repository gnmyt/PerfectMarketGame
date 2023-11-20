import "./styles.sass";
import {useContext, useEffect, useState} from "react";
import {socket} from "@/common/utils/socket.js";
import {QRCodeSVG} from "qrcode.react";
import Button from "@/common/components/Button";
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import {GroupContext} from "@/common/contexts/GroupContext.jsx";
import {useNavigate} from "react-router";
import Sound from "react-sound";
import ThemeSound from "@/common/sounds/end.mp3";
import {MusicContext} from "@/common/contexts/MusicContext.jsx";

export const DOMAIN = "pmg.gnmyt.dev";
export const BASE_URL = `https://${DOMAIN}/join/`;

export const Create = () => {
    const [code, setCode] = useState("LOADING");

    const navigate = useNavigate();

    const {musicEnabled} = useContext(MusicContext);
    const {groups, resetGame} = useContext(GroupContext);

    const getRoomCode = () => {
        socket.emit("CREATE_ROOM", undefined, (data) => {
            setCode(code => code !== "LOADING" ? code : data.code);
        });
    }

    useEffect(() => {
        const timeout = setTimeout(() => getRoomCode(), 1000);

        resetGame();

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="create-page">
            <Sound url={ThemeSound} playStatus={Sound.status.PLAYING} volume={musicEnabled ? 50 : 0} loop={true}/>
            <div className="info-area">
                <h2>Geht auf <span>{DOMAIN}</span> und gibt den Code <span>{code}</span> ein.</h2>
                {groups.length > 1 && <Button text={`Mit ${groups.length} Gruppen starten`} icon={faPlay}
                                              onClick={() => navigate("/game")}/>}
            </div>
            <div className="qr-area">
                <QRCodeSVG value={BASE_URL + code}/>
            </div>
        </div>
    )
}