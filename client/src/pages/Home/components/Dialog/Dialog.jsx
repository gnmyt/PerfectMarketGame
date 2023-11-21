import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useContext} from "react";
import {SettingsContext} from "@/common/contexts/SettingsProvider.jsx";

export const Dialog = ({onClose}) => {

    const {rounds, updateRounds} = useContext(SettingsContext);

    return (
        <>
            <div className="glassy dialog">
                <div className="dialog-header">
                    <div className="dialog-title">
                        <FontAwesomeIcon icon={faGear} />
                        <h2>Spieleinstellungen</h2>
                    </div>
                    <FontAwesomeIcon icon={faXmark} onClick={onClose} />
                </div>
                <div className="dialog-content">

                    <div className="dialog-item">
                        <h2>Runden</h2>
                        <input type="number" className="glassy input" value={rounds}
                               onChange={(e) => updateRounds(parseInt(e.target.value))} />
                    </div>
                    
                </div>
            </div>
            <div className="dialog-overlay" onClick={onClose} />
        </>
    )
}