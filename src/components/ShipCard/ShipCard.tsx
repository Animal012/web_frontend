import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./ShipCard.css";
import { setDraftFight } from "../../slices/fightSlice";
import { addShipToFight } from "../../slices/shipSlice";
import { RootState, AppDispatch } from "../../store";

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
    const dispatch: AppDispatch = useDispatch();
    const { loading, error } = useSelector(
        (state: RootState) => state.ship);

    const handleTitleClick = () => {
        navigate(`/ships/${ship.id}`);
    };

    const handleAddToFight = async (event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            // Диспатчим действие для добавления корабля в сражение
            const result = await dispatch(addShipToFight(Number(ship.id))).unwrap();

            // Если добавление прошло успешно, обновляем состояние с новым draft_fight_id
            if (result.draft_fight_id !== null) {
                dispatch(setDraftFight({
                    draftFightId: Number(result.draft_fight_id),
                    count: result.count,
                }));
            } else {
                console.error("Ошибка: draft_fight_id отсутствует в ответе API");
            }
        } catch (error) {
            console.error("Ошибка при добавлении корабля в сражение:", error);
        }
    };

    return (
        <div className="ship-card-shippage">
            <img src={ship.photo} className="ship-image" alt={`${ship.ship_name}`} />
            <h2 className="ship-name" onClick={handleTitleClick} style={{ cursor: "pointer" }}>
                {ship.ship_name}
            </h2>
            <p className="ship-details">Год постройки: {ship.year}</p>
            <p className="ship-details">Длина: {ship.length} м</p>
            <p className="ship-details">Водоизмещение: {ship.displacement} т</p>
            <p className="ship-details">Страна: {ship.country}</p>
            <div className="ship-add-button">
                <button onClick={handleAddToFight} disabled={loading}>
                    {loading ? "Загружается..." : "Добавить в сражение"}
                </button>
            </div>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ShipCard;
