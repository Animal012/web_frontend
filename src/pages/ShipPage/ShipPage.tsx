import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/index";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../../Route";
import { SHIPS_MOCK } from "../../modules/mock";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
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
    const navigate = useNavigate(); // Получаем функцию для навигации
    const [ship, setShip] = useState<Ship | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isStaff } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const getShipDetails = async () => {
            if (!shipId) return;
    
            try {
                const response = await Promise.race([
                    api.ships.shipsRead(shipId as string)
                ]) as any;
                setShip(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке данных о корабле:", error);
                const mockShip = SHIPS_MOCK.find((s) => String(s.id) === shipId);
                if (mockShip) {
                    setShip(mockShip);
                    setError(null);
                } else {
                    setError("Корабль не найден в mock-данных");
                    // Редирект на страницу 404 при ошибке
                    navigate(`/error/404`, { replace: true });
                }
            } finally {
                setLoading(false);
            }
        };
    
        getShipDetails();
    }, [shipId, navigate]); // Добавляем navigate в зависимости

    if (loading) 
        return <div className="loading-gif">
                    <img src="/loading.webp" alt="Loading" />
                </div>;

    if (error) {
        return <div>{error}</div>;
    }

    if (!ship) {
        return <div>Корабль не найден.</div>;
    }    

    return (
        <div>
            <div className="breadcrumbs-ship">
                <BreadCrumbs
                    crumbs={[
                        { label: isStaff ? ROUTE_LABELS.MODER_SHIPS : ROUTE_LABELS.SHIPS,
                            path: isStaff ? "/moderator-ships" : "/ships", },
                        { label: ship.ship_name || "Корабль" },
                    ]}
                />
            </div>
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
        </div>
    );
};

export default ShipPage;
