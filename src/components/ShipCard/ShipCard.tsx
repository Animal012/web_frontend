import React from "react";
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
    return (
        <div className="ship-card">
            <img src={ship.photo} className="ship-image" />
            <h2 className="ship-name">{ship.ship_name}</h2>
            <p className="ship-details">Год постройки: {ship.year}</p>
            <p className="ship-details">Длина: {ship.length} м</p>
            <p className="ship-details">Водоизмещение: {ship.displacement} т</p>
            <p className="ship-details">Страна: {ship.country}</p>
        </div>
    );
}
export default ShipCard;