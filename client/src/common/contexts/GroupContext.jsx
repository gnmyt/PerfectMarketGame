import {createContext, useEffect, useState} from "react";
import {socket} from "@/common/utils/socket.js";

export const GroupContext = createContext({});

export const GroupProvider = ({children}) => {

    const [allGroups, setAllGroups] = useState([]);
    const [groups, setGroups] = useState([]);
    const [round, setRound] = useState([]);
    const [roundHistory, setRoundHistory] = useState([]);
    const [groupName, setGroupName] = useState("");

    const handleJoin = (group) => {
        setGroups(groups => [...groups, {...group, capital: 25000}]);
    }

    const getGroupById = (id) => {
        return groups.find(group => group.id === id);
    }

    const handleRound = (round) => {
        setRound(current => [...current, round].sort((a, b) => a.price - b.price));
    }

    const handleLeave = (group) => {
        if (group.capital !== 25000) {
            setGroups(groups_ => {
                const current = groups_.find(g => g.id === group.id);
                if (current) setAllGroups(all => [...all, current]);
                return groups_;
            });
        }
        setGroups(groups => groups.filter(g => g.id !== group.id));
    }

    const updateCapital = (groupId, newCapital) => {
        socket.emit("UPDATE_CAPITAL", {id: groupId, capital: newCapital});

        setGroups(groups => groups.map(g => {
            if (g.id === groupId) {
                return {...g, capital: newCapital};
            }
            return g;
        }));
    }

    const endRound = () => {
        setRound([]);
    }

    const resetGame = () => {
        setAllGroups([]);
        setGroups([]);
        setRound([]);
    }

    useEffect(() => {
        socket.on("JOINED", handleJoin);
        socket.on("LEFT", handleLeave);

        return () => {
            socket.off("JOINED", handleJoin);
            socket.off("LEFT", handleLeave);
        }
    }, []);

    return (
        <GroupContext.Provider value={{groups, round, handleRound, getGroupById, updateCapital, endRound,
            allGroups, resetGame, groupName, setGroupName, roundHistory, setRoundHistory}}>
            {children}
        </GroupContext.Provider>
    )
}