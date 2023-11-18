import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./styles.sass";

export const Button = ({text, icon, onClick}) => {
    return (
        <button className="glassy btn" onClick={onClick}>
            {icon && <FontAwesomeIcon icon={icon} />}
            {text}
        </button>
    )
}