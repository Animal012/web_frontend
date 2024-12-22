import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchShipDetails, updateShipDetails } from "../../slices/shipSlice";  // Импортируем экшены
import { RootState } from "../../store"; // Типизированный root state
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { AppDispatch } from "../../store";
import { ROUTE_LABELS } from "../../Route";
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
    const dispatch = useDispatch<AppDispatch>();

    const { shipDetails, loading, error } = useSelector((state: RootState) => state.ship);

    const [editableShip, setEditableShip] = useState<Ship | null>(null);

    useEffect(() => {
        if (shipId) {
            dispatch(fetchShipDetails(shipId));  // Запрашиваем данные о корабле
        }
    }, [shipId, dispatch]);

    useEffect(() => {
        if (shipDetails) {
            setEditableShip(shipDetails);  // Обновляем данные editableShip при получении из Redux
        }
    }, [shipDetails]);

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
        if (editableShip) {
            try {
                const action = await dispatch(updateShipDetails(editableShip));  // Диспетчеризация для обновления

                if (updateShipDetails.fulfilled.match(action)) {
                    navigate(`/moderator-ships`, { replace: true });
                } else {
                    console.error("Не удалось сохранить изменения");
                }
            } catch (error) {
                console.error("Ошибка при сохранении изменений", error);
            }
        }
    };

    if (loading) {
        return <div className="loading-gif">
                    <img src="/loading.webp" alt="Loading" />
                </div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!shipDetails) {
        return <div>Корабль не найден.</div>;
    }

    return (
        <div>
            <div className="breadcrumbs-ship">
                <BreadCrumbs
                    crumbs={[
                        { label: ROUTE_LABELS.MODER_SHIPS, path: "/moderator-ships" },
                        { label: shipDetails.ship_name || "Корабль" },
                    ]}
                />
            </div>
            <div className="ship-page">
                <div className="ship-details">
                    <div className="ship-image-card">
                        <img src={shipDetails.photo} alt={shipDetails.ship_name} />
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
