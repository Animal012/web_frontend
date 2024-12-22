import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import ShipCard from "../../components/ShipCard/ShipCard";
import { ROUTE_LABELS } from "../../Route";
import { setDraftFight } from "../../slices/fightSlice"; // Используем для обновления состояния боя
import { fetchShips } from "../../slices/shipSlice"; // Новый thunk для загрузки данных
import { selectSearchQuery, setSearchQuery } from "../../slices/shipsSlice"; // Логика поиска из shipsSlice
import { RootState, AppDispatch } from "../../store";
import "./ShipsPage.css";

const ShipsPage: FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const { count, draftFightId } = useSelector((state: RootState) => state.fight);
    const searchQuery = useSelector(selectSearchQuery);
    const { ships, loading, error } = useSelector((state: RootState) => state.ship);

    useEffect(() => {
        const fetchData = async () => {
            const result = await dispatch(fetchShips()).unwrap(); // Получаем результат через unwrap
            const draftFightIdAsNumber = Number(result.draft_fight_id); // Преобразуем draft_fight_id в number
            dispatch(setDraftFight({ draftFightId: draftFightIdAsNumber, count: result.count })); // Обновляем fightSlice
        };

        fetchData().catch((error) => {
            console.error("Ошибка при загрузке данных:", error);
        });
    }, [dispatch]);

    const filteredShips = ships.filter((ship) =>
        ship.ship_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchQuery(e.target.value)); // Обновляем строку поиска в Redux
    };

    const handleGoToFight = () => {
        if (draftFightId) {
            navigate(`/fights/${draftFightId}`);
        }
    };

    return (
        <div className="main-page">
            <div>
                <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SHIPS }]} />
            </div>
            <div className="search-and-bucket">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Введите название"
                    value={searchQuery} // Используем строку поиска из Redux
                    onChange={handleSearchChange}
                />
                <div
                    onClick={count > 0 ? handleGoToFight : undefined}
                    style={{ cursor: count > 0 ? "pointer" : "not-allowed" }}
                >
                    <img src="/plus.svg" className="bucket-icon" />
                    <span className="bucket-count">{count}</span>
                </div>
            </div>
            <div className="ship-card-container">
                {loading ? (
                    <div>Загрузка...</div>
                ) : error ? (
                    <div>Ошибка: {error}</div>
                ) : filteredShips.length === 0 ? (
                    <div>К сожалению, ничего не найдено :(</div>
                ) : (
                    <div className="ship-card-grid">
                        {filteredShips.map((ship) => (
                            <ShipCard key={ship.id} ship={ship} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShipsPage;
