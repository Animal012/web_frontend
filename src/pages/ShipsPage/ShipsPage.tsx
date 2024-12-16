import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import API from "../../api/API";
import ShipCard from "../../components/ShipCard/ShipCard";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../../Route";
import { SHIPS_MOCK } from "../../modules/mock";
import { setDraftFight } from "../../slices/fightSlice"; 
import { selectSearchQuery, setSearchQuery } from "../../slices/shipsSlice"; // Импортируем новый экшен и селектор
import { RootState } from "../../store";
import "./ShipsPage.css";

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

const ShipsPage: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { count, draftFightId } = useSelector((state: RootState) => state.fight);
    const searchQuery = useSelector(selectSearchQuery); // Получаем строку поиска из Redux

    const [ships, setShips] = useState<Ship[]>([]);

    const getShips = async () => {
        try {
            const response = await API.getShips();
            const data = await response.json();
            setShips(data.ships);
            dispatch(setDraftFight({
                draftFightId: data.draft_fight_id,
                count: data.count,
            }));
        } catch (error) {
            console.error("Ошибка при загрузке данных с бэкенда:", error);
            setShips(SHIPS_MOCK);
        }
    };

    useEffect(() => {
        getShips();
    }, []);

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
                    style={{ cursor: count > 0 ? 'pointer' : 'not-allowed' }}
                >
                    <img src="/plus.svg" className="bucket-icon" />
                    <span className="bucket-count">{count}</span>
                </div>
            </div>
            <div className="ship-card-container">
                {filteredShips.length === 0 ? (
                    <div>К сожалению, ничего не найдено :(</div>
                ) : (
                    <div className="ship-card-grid">
                        {filteredShips.map((ship: Ship) => (
                            <ShipCard key={ship.id} ship={ship} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShipsPage;
