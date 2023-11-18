import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faIndustry} from "@fortawesome/free-solid-svg-icons";

export const Header = () => {
    return (
        <header>
            <FontAwesomeIcon icon={faIndustry} />
            <h1>Der vollkommene Markt</h1>
        </header>
    )
}