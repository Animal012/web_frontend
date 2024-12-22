import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/API";
import "./FightPage.css";

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

interface Fight {
    id: string;
    fight_name: string;
    result: string;
    sailors: number;
    ships: { ship: Ship; admiral: string }[];
    created_at: string;
    status: string;
}

const FightPage = () => {
    const { fightId } = useParams<{ fightId: string }>();
    const navigate = useNavigate();
    const [fight, setFight] = useState<Fight | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormValid, setIsFormValid] = useState(true);  // Состояние для проверки валидности формы
    const [formErrors, setFormErrors] = useState<{
        fightName: boolean;
        result: boolean;
        admiral: boolean[];
    }>({
        fightName: false,
        result: false,
        admiral: []
    });

    useEffect(() => {
        const getFightDetails = async () => {
            if (!fightId) return;

            try {
                const response = await API.getFightById(Number(fightId));
                const data = await response.json();
                setFight(data);
            } catch (error) {
                console.error("Ошибка при загрузке данных о сражении:", error);
                setError("Не удалось загрузить данные о сражении");
            } finally {
                setLoading(false);
            }
        };

        getFightDetails();
    }, [fightId]);

    if (loading) return <div className="loading-gif"><img src="/loading.webp" alt="loading"></img></div>;
    if (error) return <div>{error}</div>;
    if (!fight) return <div>Сражение не найдено.</div>;

    const isEditable = fight.status !== 'f' && fight.status !== 'c' && fight.status !== 'r';

    // Проверка на заполненность всех обязательных полей
    const validateForm = () => {
        if (!fight) return false;

        const fightName = fight.fight_name?.trim();
        const result = fight.result?.trim();
        const admiralEmpty = fight.ships.map(ship => !ship.admiral?.trim());

        setFormErrors({
            fightName: !fightName,
            result: !result,
            admiral: admiralEmpty
        });

        if (!fightName || !result || admiralEmpty.includes(true)) {
            setIsFormValid(false);
            return false;
        }

        setIsFormValid(true);
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;  // Если форма не валидна, просто не отправляем запрос
        }

        try {
            await API.formFight(Number(fightId));
            navigate('/');
        } catch (error) {
            console.error('Ошибка при завершении сражения:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await API.deleteFight(Number(fightId));
            navigate('/');
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    };

    const handleShipDelete = async (shipId: string, index: number) => {
        if (!fight) return;
        try {
            await API.deleteShipFromDraft(Number(fightId), Number(shipId));
            const updatedShips = [...fight.ships];
            updatedShips.splice(index, 1); // Удаляем корабль из массива
            setFight({ ...fight, ships: updatedShips });
        } catch (error) {
            console.error('Ошибка при удалении корабля:', error);
        }
    };

    const handleSaveChanges = async () => {
        try {
            // Обновляем поля Название сражения и Результат
            await API.changeAddFields(Number(fightId), fight.fight_name, fight.result);
    
            // Обновляем адмиралов всех кораблей
            for (let i = 0; i < fight.ships.length; i++) {
                const shipId = fight.ships[i].ship.id; // Используем id из объекта ship
                const admiral = fight.ships[i].admiral; // Получаем имя адмирала
                await API.changeShipFields(Number(shipId), Number(fightId), admiral);
            }
    
            console.log('Изменения сохранены');
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
        }
    };
    

    // Обработчик для изменений в полях
    const handleInputChange = (field: string, value: string, index?: number) => {
        if (field === 'fightName') {
            setFight((prevFight) => {
                if (!prevFight) return prevFight; // Возвращаем prevFight, если оно null
                return { ...prevFight, fight_name: value };
            });
            setFormErrors({ ...formErrors, fightName: !value.trim() });
        } else if (field === 'result') {
            setFight((prevFight) => {
                if (!prevFight) return prevFight;
                return { ...prevFight, result: value };
            });
            setFormErrors({ ...formErrors, result: !value.trim() });
        } else if (field === 'admiral' && index !== undefined) {
            setFight((prevFight) => {
                if (!prevFight) return prevFight;
                const updatedShips = [...prevFight.ships];
                updatedShips[index].admiral = value;
                return { ...prevFight, ships: updatedShips };
            });
            const updatedAdmiralErrors = [...formErrors.admiral];
            updatedAdmiralErrors[index] = !value.trim();
            setFormErrors({ ...formErrors, admiral: updatedAdmiralErrors });
        }
    };
    

    return (
        <div className="fight-page">
            <h1 className="fight-name-fix">Название сражения</h1>
            <input
                value={fight.fight_name}
                type="text"
                className={`fight-name-input ${formErrors.fightName ? 'error' : ''}`}  // Подсветка поля
                onChange={(e) => handleInputChange('fightName', e.target.value)}
                disabled={!isEditable}
            />
            <h1 className="fight-result-fix">Итог сражения</h1>
            <input
                value={fight.result}
                type="text"
                className={`fight-result-input ${formErrors.result ? 'error' : ''}`}  // Подсветка поля
                onChange={(e) => handleInputChange('result', e.target.value)}
                disabled={!isEditable}
            />

            <div className="battle-container">
                {fight.ships.map(({ ship, admiral }, index) => (
                    <div key={index} className="battle-row">
                        {/* Карточка корабля */}
                        <div className="ship-card">
                            <div className="ship-content">
                                <img src={ship.photo} alt={ship.ship_name} className="ship-photo" />
                                <div className="ship-info">
                                    <h1>{ship.ship_name}</h1>
                                    <h4><strong>Экипаж:</strong> {ship.crew}</h4>
                                    {isEditable && (
                                        <button className="ship-delete" onClick={() => handleShipDelete(ship.id, index)}>
                                            Удалить
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Поле адмирала */}
                        <div className="admiral-card">
                            <h2>Адмирал</h2>
                            <input
                                value={admiral}  // Используем value, чтобы контролировать поле
                                type="text"
                                className={`admiral-input ${formErrors.admiral[index] ? 'error' : ''}`}  // Подсветка поля
                                onChange={(e) => handleInputChange('admiral', e.target.value, index)}  // Обработка изменения
                                disabled={!isEditable}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="button-container">
                {isEditable ? (
                    <>
                        <button className="fight-save-changes" onClick={handleSaveChanges} disabled={!isEditable}> Сохранить изменения </button>
                        <button className="fight-submit" onClick={handleSubmit} disabled={!isFormValid}>Оформить</button>
                        <button className="fight-delete" onClick={handleDelete}>Удалить</button>
                    </>
                ) : null}
            </div>
            {isEditable || fight.sailors === null && (
                <div className="total-sailors">
                    Общее количество участников сражения: не определено
                </div>
            )}
            {!isEditable && fight.sailors !== null && (
                <div className="total-sailors">
                    Общее количество участников сражения: {fight.sailors}
                </div>
            )}
        </div>
    );
};

export default FightPage;
