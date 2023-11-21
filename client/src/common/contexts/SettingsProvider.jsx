import {createContext, useState} from "react";

export const SettingsContext = createContext({});

export const SettingsProvider = ({children}) => {
    const [rounds, setRounds] = useState(localStorage.getItem("rounds") || 10);

    const updateRounds = (newValue) => {
        localStorage.setItem("rounds", newValue);
        setRounds(newValue);
    }

    return (
        <SettingsContext.Provider value={{rounds, updateRounds}}>
            {children}
        </SettingsContext.Provider>
    );
}