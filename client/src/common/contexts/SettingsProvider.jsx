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

    const updateStartCapital = (newValue) => {
        localStorage.setItem("startCapital", newValue);
        setStartCapital(newValue);
    }

    const updateCostPerCake = (newValue) => {
        localStorage.setItem("costPerCake", newValue);
        setCostPerCake(newValue);
    }

    const updateCostPerRound = (newValue) => {
        localStorage.setItem("costPerRound", newValue);
        setCostPerRound(newValue);
    }

    const updateProduction = (newValue) => {
        localStorage.setItem("maxProduction", newValue);
        setMaxProduction(newValue);
    }

    const updatePrice = (newValue) => {
        localStorage.setItem("maxProduction", newValue);
        setMaxPrice(newValue);
    }

    const updateDemandTable = (newValue) => {
        localStorage.setItem("demandTable", JSON.stringify(newValue));
        setDemandTable(newValue);
    }

    return (
        <SettingsContext.Provider value={{
            rounds, updateRounds, demandTable, updateDemandTable, startCapital, updateStartCapital,
            costPerCake, updateCostPerCake, costPerRound, updateCostPerRound, maxProduction, updateProduction,
            maxPrice, updatePrice
        }}>
            {children}
        </SettingsContext.Provider>
    );
}