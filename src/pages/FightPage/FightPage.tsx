import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFightDetails, updateFightFields, updateShipFields, deleteFight, deleteShipFromFight } from "../../slices/fightsSlice";
import { RootState, AppDispatch } from "../../store";
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
    const dispatch = useDispatch<AppDispatch>();
    const { fight, loading, error } = useSelector((state: RootState) => state.fights);
    
    const [isFormValid, setIsFormValid] = useState(true);
    const [formErrors, setFormErrors] = useState<{
        fightName: boolean;
        result: boolean;
        admiral: boolean[];
    }>({
        fightName: false,
        result: false,
        admiral: []
    });

    const [localFight, setLocalFight] = useState<Fight | null>(null);

    useEffect(() => {
        if (fightId) {
            dispatch(fetchFightDetails(fightId));
        }
    }, [dispatch, fightId]);

    useEffect(() => {
        if (fight) {
            setLocalFight(fight);
        }
    }, [fight]);

    if (loading) return <div className="loading-gif"><img src="/loading.webp" alt="loading" /></div>;
    if (error) return <div>{error}</div>;
    if (!fight) return <div>Сражение не найдено.</div>;

    const isEditable = fight.status !== 'f' && fight.status !== 'c' && fight.status !== 'r';

    const validateForm = () => {
        if (!localFight) return false;

        const fightName = localFight.fight_name?.trim();
        const result = localFight.result?.trim();
        const admiralEmpty = localFight.ships.map(ship => !ship.admiral?.trim());

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
            return;
        }

        try {
            await dispatch(updateFightFields({ fightId: Number(fightId), fightName: localFight?.fight_name || "", result: localFight?.result || "" }));
            navigate('/');
        } catch (error) {
            console.error('Ошибка при завершении сражения:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteFight(Number(fightId)));
            navigate('/');
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    };

    const handleShipDelete = async (shipId: string, index: number) => {
        if (!localFight) return;
        try {
            await dispatch(deleteShipFromFight({ fightId: Number(fightId), shipId: Number(shipId) }));
            const updatedShips = [...localFight.ships];
            updatedShips.splice(index, 1);
            setLocalFight({ ...localFight, ships: updatedShips });
        } catch (error) {
            console.error('Ошибка при удалении корабля:', error);
        }
    };

    const handleSaveChanges = async () => {
        if (!localFight) return;
        try {
            await dispatch(updateFightFields({ fightId: Number(fightId), fightName: localFight.fight_name, result: localFight.result }));

            // Save admiral changes for each ship
            for (let i = 0; i < localFight.ships.length; i++) {
                const shipId = localFight.ships[i].ship.id;
                const admiral = localFight.ships[i].admiral;
                await dispatch(updateShipFields({ shipId: Number(shipId), fightId: Number(fightId), admiral }));
            }

            console.log('Изменения сохранены');
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error);
        }
    };

    const handleInputChange = (field: string, value: string, index?: number) => {
        if (!localFight) return;

        if (field === 'fightName') {
            setLocalFight({ ...localFight, fight_name: value });
        } else if (field === 'result') {
            setLocalFight({ ...localFight, result: value });
        } else if (field === 'admiral' && index !== undefined) {
            const updatedShips = [...localFight.ships];
            updatedShips[index] = { ...updatedShips[index], admiral: value }; // Обновление адмирала конкретного корабля
            setLocalFight({ ...localFight, ships: updatedShips });
        }
    };

    return (
        <div className="fight-page">
            <h1 className="fight-name-fix">Название сражения</h1>
            <input
                value={localFight?.fight_name || ''}
                type="text"
                className={`fight-name-input ${formErrors.fightName ? 'error' : ''}`}
                onChange={(e) => handleInputChange('fightName', e.target.value)}
                disabled={!isEditable}
            />
            <h1 className="fight-result-fix">Итог сражения</h1>
            <input
                value={localFight?.result || ''}
                type="text"
                className={`fight-result-input ${formErrors.result ? 'error' : ''}`}
                onChange={(e) => handleInputChange('result', e.target.value)}
                disabled={!isEditable}
            />

            <div className="battle-container">
                {localFight?.ships.map(({ ship, admiral }, index) => (
                    <div key={index} className="battle-row">
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

                        <div className="admiral-card">
                            <h2>Адмирал</h2>
                            <input
                                value={admiral || ''}  // Обеспечиваем корректную работу поля с пустыми значениями
                                type="text"
                                className={`admiral-input ${formErrors.admiral[index] ? 'error' : ''}`}
                                onChange={(e) => handleInputChange('admiral', e.target.value, index)}
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
