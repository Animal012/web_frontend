import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/API";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../../Route";
import { SHIPS_MOCK } from "../../modules/mock";
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
                console.error("Ошибка при загрузке данных о корабле:", error);
                const mockShip = SHIPS_MOCK.find((s) => String(s.id) === shipId);
                if (mockShip) {
                    setShip(mockShip);
                    setError(null);
                } else {
                    setError("Корабль не найден в mock-данных");
                }
            } finally {
                setLoading(false);
            }
        };

        getShipDetails();
    }, [shipId]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!ship) {
        return <div>Корабль не найден.</div>;
    }

    if (error) {
        return <div>Ошибка</div>;
    }

    const imageUrl = `http://localhost:9000/navy-sea/${ship.id}.jpg`;

    return (
        <div>
            <div className="breadcrumbs-ship">
                <BreadCrumbs
                    crumbs={[
                        { label: ROUTE_LABELS.SHIPS, path: '/ships' },
                        { label: ship.ship_name || "Корабль" },
                    ]}
                />
            </div>
            <div className="ship-page">
                <div className="ship-details">
                    <div className="ship-image-card">
                        <img src={imageUrl} alt={ship.ship_name} />
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
        </div>
    );
};

export default ShipPage;
