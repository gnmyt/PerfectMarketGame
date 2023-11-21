import Header from "@/common/components/Header";
import "./styles.sass";
import Footer from "@/common/components/Footer";
import {useOutlet} from "react-router";
import Background from "@/common/components/Background";
import {socket} from "@/common/utils/socket.js";
import {useEffect} from "react";
import {GroupProvider} from "@/common/contexts/GroupContext.jsx";
import {MusicProvider} from "@/common/contexts/MusicContext.jsx";
import {SettingsProvider} from "@/common/contexts/SettingsProvider.jsx";

export const Root = () => {
    const outlet = useOutlet();

    useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        }
    }, []);

    return (
        <MusicProvider>
            <div className="root">
                <Header/>

                <main>
                    <GroupProvider>
                        <SettingsProvider>
                            {outlet}
                        </SettingsProvider>
                    </GroupProvider>
                </main>

                <Footer/>

                <Background/>

            </div>
        </MusicProvider>
    );
}