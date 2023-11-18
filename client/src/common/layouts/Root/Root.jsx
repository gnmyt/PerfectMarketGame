import Header from "@/common/components/Header";
import "./styles.sass";
import Footer from "@/common/components/Footer";
import {useOutlet} from "react-router";
import Background from "@/common/components/Background";

export const Root = () => {
    const outlet = useOutlet();

    return (
        <div className="root">
            <Header />

            <main>
                {outlet}
            </main>

            <Footer />

            <Background />

        </div>
    );
}