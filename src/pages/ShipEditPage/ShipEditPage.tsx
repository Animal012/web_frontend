import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/API"; // Импортируем API
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../../Route";
import { SHIPS_MOCK } from "../../modules/mock";
import "./ShipEditPage.css";

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

const ShipEditPage = () => {
    const { shipId } = useParams<{ shipId: string }>();
    const navigate = useNavigate();
    const [ship, setShip] = useState<Ship | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editableShip, setEditableShip] = useState<Ship | null>(null);

    useEffect(() => {
        const getShipDetails = async () => {
            if (!shipId) return;

            try {
                const response = await API.getShipDetails(shipId);
                const data = await response.json();
                setShip(data);
                setEditableShip(data); 
            } catch (error) {
                console.error("Ошибка при загрузке данных о корабле:", error);
                const mockShip = SHIPS_MOCK.find((s) => String(s.id) === shipId);
                if (mockShip) {
                    setShip(mockShip);
                    setEditableShip(mockShip);
                    setError(null);
                } else {
                    setError("Корабль не найден в mock-данных");
                    navigate(`/error/404`, { replace: true });
                }
            } finally {
                setLoading(false);
            }
        };

        getShipDetails();
    }, [shipId, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (editableShip) {
            setEditableShip({
                ...editableShip,
                [name]: value,
            });
        }
    };

    const handleSaveChanges = async () => {
        if (editableShip !== null) { // Проверяем, что editableShip не null
            try {
                // Ждем завершения асинхронной операции
                const response = await API.changeShip(
                    Number(shipId), 
                    editableShip.ship_name, 
                    editableShip.description, 
                    editableShip.year, 
                    editableShip.length, 
                    editableShip.displacement, 
                    editableShip.crew, 
                    editableShip.country
                );
                
                // Даем результат в setShip после того как данные изменены
                if (response.ok) {
                    setShip((prevShip) => ({
                        ...prevShip, // Сохраняем старые данные, если они не были изменены
                        ship_name: editableShip.ship_name,
                        description: editableShip.description,
                        year: editableShip.year,
                        displacement: editableShip.displacement,
                        length: editableShip.length,
                        crew: editableShip.crew,
                        country: editableShip.country,
                        // Убедитесь, что id присутствует и строка
                        id: prevShip?.id || '', // Используем пустую строку, если id нет
                        photo: prevShip?.photo || '' // Используем пустую строку, если фото нет
                    }));
                } else {
                    setError("Не удалось сохранить изменения.");
                }
            } catch (error) {
                console.error("Ошибка при сохранении изменений:", error);
                setError("Не удалось сохранить изменения.");
            }
        } else {
            setError("Данные корабля отсутствуют.");
        }
    };
    
    

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
                        { label: ROUTE_LABELS.MODER_SHIPS,
                            path: "/moderator-ships" },
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
                        <h1>
                            <input
                                type="text"
                                name="ship_name"
                                className="ship-edit-input"
                                value={editableShip?.ship_name || ''}
                                onChange={handleInputChange}
                            />
                        </h1>
                        <p>
                            <strong>Год постройки:</strong>
                            <input
                                type="number"
                                name="year"
                                className="ship-edit-input"
                                value={editableShip?.year || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Водоизмещение:</strong>
                            <input
                                type="number"
                                name="displacement"
                                className="ship-edit-input"
                                value={editableShip?.displacement || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Длина:</strong>
                            <input
                                type="number"
                                name="length"
                                className="ship-edit-input"
                                value={editableShip?.length || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Экипаж:</strong>
                            <input
                                type="number"
                                name="crew"
                                className="ship-edit-input"
                                value={editableShip?.crew || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Страна:</strong>
                            <input
                                type="text"
                                name="country"
                                className="ship-edit-input"
                                value={editableShip?.country || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Описание:</strong>
                            <textarea
                                name="description"
                                className="ship-edit-input"
                                value={editableShip?.description || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <button className="ship-save-edit" onClick={handleSaveChanges}>Сохранить изменения</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipEditPage;
