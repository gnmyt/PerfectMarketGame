import {createContext, useState} from "react";

export const SettingsContext = createContext({});

export const SettingsProvider = ({children}) => {
    const [rounds, setRounds] = useState(localStorage.getItem("rounds") || 10);
    const [demandTable, setDemandTable] = useState(JSON.parse(localStorage.getItem("demandTable")) || {
        0: 50,
        1800: 40,
        2200: 30
    });
    const [startCapital, setStartCapital] = useState(localStorage.getItem("startCapital") || 25000);
    const [costPerCake, setCostPerCake] = useState(localStorage.getItem("costPerCake") || 1000);
    const [costPerRound, setCostPerRound] = useState(localStorage.getItem("costPerRound") || 4000);
    const [maxProduction, setMaxProduction] = useState(localStorage.getItem("maxProduction") || 20);
    const [maxPrice, setMaxPrice] = useState(localStorage.getItem("maxPrice") || 10000);

    const updateRounds = (newValue) => {
        localStorage.setItem("rounds", newValue);
        setRounds(newValue);
    }

    const updateDemandTable = (newValue) => {
        localStorage.setItem("demandTable", JSON.stringify(newValue));
        setDemandTable(newValue);
    }

    return (
        <SettingsContext.Provider value={{
            rounds, updateRounds, demandTable, updateDemandTable, startCapital, setStartCapital,
            costPerCake, setCostPerCake, costPerRound, setCostPerRound, maxProduction, setMaxProduction,
            maxPrice, setMaxPrice
        }}>
            {children}
        </SettingsContext.Provider>
    );
}