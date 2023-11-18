import "./styles.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCake} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";

export const Background = () => {

    const [cakes, setCakes] = useState([]);

    const addRandomizedCake = () => {
        const randomX = Math.floor(Math.random() * 100 % 80 + 10);
        const randomY = Math.floor(Math.random() * 100 % 80 + 10);
        const randomSize = Math.floor(Math.random() * 100 % 50 + 20);
        const randomRotation = Math.floor(Math.random() * 360 % 10);

        setCakes(cakes => [...cakes, {x: randomX, y: randomY, size: randomSize, rotation: randomRotation}]);
    }

    useEffect(() => {
        for (let i = 0; i < 12; i++) addRandomizedCake();

        return () => setCakes([]);
    }, []);

    return (
        <div className="background">
            {cakes.map((cake, index) => (
                <FontAwesomeIcon key={index} icon={faCake} style={{
                    left: `${cake.x}%`,
                    top: `${cake.y}%`,
                    transform: `rotate(${cake.rotation}deg)`,
                    fontSize: `${cake.size}pt`
                }} />
            ))}
        </div>
    );
}