import {createContext, useState} from "react";

export const SettingsContext = createContext({});

export const SettingsProvider = ({children}) => {
    const [rounds, setRounds] = useState(localStorage.getItem("rounds") || 10);
    const [demandTable, setDemandTable] = useState(JSON.parse(localStorage.getItem("demandTable")) || {
        0: 50,
        1800: 40,
        2200: 30
    });

    const updateRounds = (newValue) => {
        localStorage.setItem("rounds", newValue);
        setRounds(newValue);
    }

    const updateDemandTable = (newValue) => {
        localStorage.setItem("demandTable", JSON.stringify(newValue));
        setDemandTable(newValue);
    }

    return (
        <SettingsContext.Provider value={{rounds, updateRounds, demandTable, updateDemandTable}}>
            {children}
        </SettingsContext.Provider>
    );
}