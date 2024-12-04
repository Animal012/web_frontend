import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./ShipCard.css";
import API from "../../api/API";
import { setDraftFight } from "../../slices/fightSlice"; 

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
}

const ShipCard: React.FC<{ ship: Ship }> = ({ ship }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleTitleClick = () => {
        navigate(`/ships/${ship.id}`);
    };

    const handleAddToFight = async (event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            const response = await API.addShipToDraft(Number(ship.id));
            const data = await response.json();

            if (data.draft_fight_id) {
                dispatch(setDraftFight({
                    draftFightId: data.draft_fight_id,
                    count: data.count,
                }));
            } else {
                console.error("Ошибка: неверный ответ от API");
            }
        } catch (error) {
            console.error("Ошибка при добавлении корабля в сражение:", error);
        }
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
            <div className="ship-add-button">
                <button onClick={handleAddToFight}>
                    Добавить в сражение
                </button>
            </div>
        </div>
    );
};

export default ShipCard;
