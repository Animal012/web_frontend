import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setShips,
    setSearchQuery,
    selectShips,
    selectSearchQuery,
    selectShipsInBucket,
    setShipsInBucket,
    setDraftId,
} from "../../slices/shipsSlice";
import API from "../../api/API";
import ShipCard from "../../components/ShipCard/ShipCard";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../../Route";
import { SHIPS_MOCK } from "../../modules/mock";
import "./ShipsPage.css";

const MainPage: FC = () => {
    const dispatch = useDispatch();
    const ships = useSelector(selectShips);
    const searchQuery = useSelector(selectSearchQuery);
    const shipsInBucket = useSelector(selectShipsInBucket);

    const getShips = async () => {
        try {
            const response = await API.getShips();
            const data = await response.json();
            dispatch(setShips(data.ships));
            dispatch(setDraftId(data.draft_fight_id));
            dispatch(setShipsInBucket(data.count));
        } catch (error) {
            console.error("Ошибка при загрузке данных с бэкенда:", error);
            dispatch(setShips(SHIPS_MOCK));
            dispatch(setDraftId(null));
            dispatch(setShipsInBucket(0));
        }
    };

    useEffect(() => {
        getShips();
    }, []);

    const handleSearch = () => {
        dispatch(setSearchQuery(searchQuery));
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
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                />
                <button type="button" className="search-button" onClick={handleSearch}>
                    <img src="/search.svg" alt="Поиск" className="search-icon" />
                </button>
                <a href="#">
                    <img src="/plus.svg" alt="Корзина" className="bucket-icon" />
                    <span className="bucket-count">{shipsInBucket}</span>
                </a>
            </div>
            <div className="ship-card-container">
                {ships.length === 0 ? (
                    <div>К сожалению, ничего не найдено :(</div>
                ) : (
                    <div className="ship-card-grid">
                        {ships.map((ship) => (
                            <ShipCard key={ship.id} ship={ship} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainPage;
