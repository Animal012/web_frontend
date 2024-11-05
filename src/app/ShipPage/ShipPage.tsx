import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/API";
import "./ShipPage.css";

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

const ShipPage = () => {
    // Получаем shipId из URL
    const { shipId } = useParams<{ shipId: string }>(); 
    const [ship, setShip] = useState<Ship | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getShipDetails = async () => {
            if (!shipId) return;

            try {
                const response = await API.getShipDetails(shipId);
                const data = await response.json();
                
                setShip(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Ошибка загрузки данных");
            } finally {
                setLoading(false);
            }
        };

        getShipDetails();
    }, [shipId]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    if (!ship) {
        return <div>Корабль не найден.</div>;
    }

    return (
        <div className="ship-page">
            <div className="ship-details">
                <div className="ship-image-card">
                    <img src={ship.photo} alt={ship.ship_name} />
                </div>
                <div className="ship-info">
                    <h1>{ship.ship_name}</h1>
                    <p><strong>Год постройки:</strong> {ship.year}</p>
                    <p><strong>Водоизмещение:</strong> {ship.displacement} тонн</p>
                    <p><strong>Длина:</strong> {ship.length} м</p>
                    <p><strong>Экипаж:</strong> {ship.crew}</p>
                    <p><strong>Страна:</strong> {ship.country}</p>
                    <p><strong>Описание:</strong> {ship.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ShipPage;
