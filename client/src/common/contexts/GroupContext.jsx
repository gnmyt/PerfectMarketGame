import {createContext, useEffect, useState} from "react";
import {socket} from "@/common/utils/socket.js";

export const GroupContext = createContext({});

export const GroupProvider = ({children}) => {

    const [groups, setGroups] = useState([]);

    const handleJoin = (group) => {
        console.log(group)
        setGroups(groups => [...groups, group]);
    }

    const handleLeave = (group) => {
        setGroups(groups => groups.filter(g => g.id !== group.id));
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
        <GroupContext.Provider value={{groups}}>
            {children}
        </GroupContext.Provider>
    )
}