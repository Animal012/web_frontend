import { FC, useState, useEffect } from "react";
import API from "../../api/API";
import ShipCard from "../../components/ShipCard/ShipCard";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../../Route";
import { SHIPS_MOCK } from "../../modules/mock";
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

const MainPage: FC = () => {
    const [ships, setShips] = useState<Ship[]>([]);
    const [filteredShips, setFilteredShips] = useState<Ship[]>([]);
    const [draftId, setDraftId] = useState<number | null>(null);
    const [shipsInBucket, setShipsInBucket] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const getShips = async () => {
        try {
            const response = await API.getShips();
            const data = await response.json();
            setShips(data.ships);
            setFilteredShips(data.ships);
            setDraftId(data.draft_fight_id);
            setShipsInBucket(data.count);
            setLoading(false);
        } catch (error) {
            console.error("Ошибка при загрузке данных с бэкенда:", error);
            setShips(SHIPS_MOCK);
            setFilteredShips(SHIPS_MOCK);
            setDraftId(null);
            setShipsInBucket(0);
            setLoading(false);
            setError(null);
        }
    };

    useEffect(() => {
        getShips();
    }, []);

    const handleSearch = () => {
        const filtered = ships.filter((ship) =>
            ship.ship_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredShips(filtered);
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

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
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                {filteredShips.length === 0 ? (
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

export default MainPage;
