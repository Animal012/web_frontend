import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/API"; // Импортируем API
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../../Route";
import "./ShipAddPage.css";

const ShipAddPage = () => {
    const navigate = useNavigate();
    const [editableShip, setEditableShip] = useState({
        ship_name: "",
        description: "",
        year: 0,
        displacement: 0,
        length: 0,
        crew: 0,
        country: "",
        photo: "", // Если хотите поддерживать фото, добавьте соответствующие поля
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditableShip({
            ...editableShip,
            [name]: value,
        });
    };

    const handleSaveChanges = async () => {
        try {
            const response = await API.addShip(
                editableShip.ship_name,
                editableShip.description,
                editableShip.year,
                editableShip.length,
                editableShip.displacement,
                editableShip.crew,
                editableShip.country
            );

            if (response.ok) {
                navigate("/moderator-ships", { replace: true }); // Переходим к списку кораблей
            } else {
                setError("Не удалось создать корабль.");
            }
        } catch (error) {
            console.error("Ошибка при сохранении изменений:", error);
            setError("Не удалось создать корабль.");
        }
    };

    return (
        <div>
            <div className="breadcrumbs-ship">
                <BreadCrumbs
                    crumbs={[
                        { label: ROUTE_LABELS.MODER_SHIPS, path: "/moderator-ships" },
                        { label: "Добавить корабль" },
                    ]}
                />
            </div>
            <div className="ship-page">
                <div className="ship-details">
                    <div className="ship-image-card">
                        <img src="/default-ship-image.jpg" alt="Ship" /> {/* Здесь можно добавить дефолтное изображение */}
                    </div>
                    <div className="ship-info">
                        <p>
                            <strong>Название:</strong>
                            <input
                                type="text"
                                name="ship_name"
                                className="ship-edit-input"
                                value={editableShip.ship_name}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Год постройки:</strong>
                            <input
                                type="number"
                                name="year"
                                className="ship-edit-input"
                                value={editableShip.year || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Водоизмещение:</strong>
                            <input
                                type="number"
                                name="displacement"
                                className="ship-edit-input"
                                value={editableShip.displacement || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Длина:</strong>
                            <input
                                type="number"
                                name="length"
                                className="ship-edit-input"
                                value={editableShip.length || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Экипаж:</strong>
                            <input
                                type="number"
                                name="crew"
                                className="ship-edit-input"
                                value={editableShip.crew || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Страна:</strong>
                            <input
                                type="text"
                                name="country"
                                className="ship-edit-input"
                                value={editableShip.country || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <p>
                            <strong>Описание:</strong>
                            <textarea
                                name="description"
                                className="ship-edit-input"
                                value={editableShip.description || ''}
                                onChange={handleInputChange}
                            />
                        </p>
                        <button className="ship-save-edit" onClick={handleSaveChanges}>
                            Сохранить изменения
                        </button>
                        {error && <div className="error-message">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipAddPage;
