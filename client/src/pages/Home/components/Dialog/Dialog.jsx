import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear, faPlus, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useContext} from "react";
import {SettingsContext} from "@/common/contexts/SettingsProvider.jsx";
import Button from "@/common/components/Button";

export const Dialog = ({onClose, open}) => {

    const {rounds, updateRounds, demandTable, updateDemandTable} = useContext(SettingsContext);

    const deleteDemand = (key) => {
        let newDemandTable = {...demandTable};
        delete newDemandTable[key];
        updateDemandTable(newDemandTable);
    }

    const updateDemand = (key, e) => {
        let newDemandTable = {...demandTable};
        newDemandTable[key] = parseInt(e.target.value);
        updateDemandTable(newDemandTable);
    }

    const updateDemandKey = (key, e) => {
        let newDemandTable = {...demandTable};
        delete newDemandTable[key];
        newDemandTable[e.target.value] = parseInt(Object.values(demandTable)[Object.keys(demandTable).indexOf(key)]);
        updateDemandTable(newDemandTable);
    }

    const addDemand = () => {
        if (Object.keys(demandTable).length >= 5) return;
        let newDemandTable = {...demandTable};
        newDemandTable[parseInt(Object.keys(demandTable).pop()) + 500] = parseInt(Object.values(demandTable).pop()) - 10;
        updateDemandTable(newDemandTable);
    }

    return (
        <>
            <div className={"glassy dialog" + (open ? "" : " dialog-closed")}>
                <div className="dialog-header">
                    <div className="dialog-title">
                        <FontAwesomeIcon icon={faGear} />
                        <h2>Spieleinstellungen</h2>
                    </div>
                    <FontAwesomeIcon icon={faXmark} onClick={onClose} />
                </div>
                <div className="dialog-content">

                    <div className="dialog-sub">
                        <hr/>
                        <h2>Grundlegendes</h2>
                        <hr/>
                    </div>

                    <div className="dialog-item">
                        <h2>Runden</h2>
                        <input type="number" className="glassy input" value={rounds}
                               onChange={(e) => updateRounds(parseInt(e.target.value))} />
                    </div>

                    <div className="dialog-sub">
                        <hr/>
                        <h2>Nachfrage</h2>
                        <hr/>
                    </div>

                    {Object.keys(demandTable).map((key) => {
                        return (
                            <div className="dialog-item" key={key}>
                                <div className="dialog-left">
                                    <h2>Ab {key === "0" && "0 €"}</h2>
                                    {key !== "0" && <input type="number" className="glassy input" value={key}
                                             onChange={(e) => updateDemandKey(key, e)} />}
                                </div>
                                <div className="dialog-right">
                                    <input type="number" className="glassy input" value={demandTable[key]}
                                           onChange={(e) => updateDemand(key, e)} />
                                    {key !== "0" && <FontAwesomeIcon icon={faTrash} onClick={() => deleteDemand(key)} />}
                                </div>
                            </div>
                        );
                    })}

                    <div className="demand-area">
                        <Button onClick={() => addDemand()} icon={faPlus} text="Hinzufügen" />
                    </div>
                    
                </div>
            </div>
            {open && <div className="dialog-overlay" onClick={onClose} />}
        </>
    )
}