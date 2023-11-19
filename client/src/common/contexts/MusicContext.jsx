import {createContext, useState} from "react";

export const MusicContext = createContext({});

export const MusicProvider = ({children}) => {
    const [musicEnabled, setMusicEnabled] = useState(true);

    return (
        <MusicContext.Provider value={{musicEnabled, setMusicEnabled}}>
            {children}
        </MusicContext.Provider>
    );
}