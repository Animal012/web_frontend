import React from "react";
import { useNavigate } from "react-router-dom";
import "./ShipCard.css";

interface Ship {
    id: string;
    ship_name: string;
    description: string;
    year: number;
    displacement: number;
    length: number;
    crew: number;
    country: string;
    photo: string;
};

const ShipCard: React.FC<{ ship: Ship }> = ({ ship }) => {
    const navigate = useNavigate();

    const handleTitleClick = () => {
        navigate(`/ships/${ship.id}`);
    };

    return (
        <div className="ship-card">
            <img src={ship.photo} className="ship-image" alt={`${ship.ship_name}`} />
            <h2 className="ship-name" onClick={handleTitleClick} style={{ cursor: "pointer" }}>
                {ship.ship_name}
            </h2>
            <p className="ship-details">Год постройки: {ship.year}</p>
            <p className="ship-details">Длина: {ship.length} м</p>
            <p className="ship-details">Водоизмещение: {ship.displacement} т</p>
            <p className="ship-details">Страна: {ship.country}</p>
        </div>
    );
};

export default ShipCard;
