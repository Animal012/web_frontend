import { Component, ReactNode } from "react";
import API from "../../api/API";
import ShipCard from "../../components/ShipCard/ShipCard";
import "./MainPage.css";

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

interface MainPageState {
    ships: Ship[];
    filteredShips: Ship[];
    draftId: number | null;
    shipsInBucket: number;
    loading: boolean;
    error: string | null;
    searchQuery: string;
}

class MainPage extends Component<{}, MainPageState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            ships: [],
            filteredShips: [],
            draftId: null,
            shipsInBucket: 0,
            loading: true,
            error: null,
            searchQuery: "",
        };
    }

    async getShips(searchQuery: string = "") {
        try {
            const response = await API.getShips();
            const data = await response.json();
            this.setState({
                ships: data.ships,
                filteredShips: data.ships,
                draftId: data.draft_fight_id,
                shipsInBucket: data.count,
                loading: false,
            });
        } catch (error) {
            this.setState({
                error: error.message || "Ошибка загрузки данных",
                loading: false,
            });
        }
    }

    componentDidMount(): void {
        this.getShips();
    }

    handleSearch = () => {
        const { ships, searchQuery } = this.state;
        const filteredShips = ships.filter((ship: Ship) =>
            ship.ship_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        this.setState({ filteredShips });
    };

    render(): ReactNode {
        const { filteredShips, shipsInBucket, loading, error, searchQuery } = this.state;

        if (loading) {
            return <div>Загрузка...</div>;
        }

        if (error) {
            return <div>Ошибка: {error}</div>;
        }

        return (
            <div className="main-page">
                <div className="search-and-bucket">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Введите название"
                        value={searchQuery}
                        onChange={(e) => this.setState({ searchQuery: e.target.value })}
                    />
                    <button type="button" className="search-button" onClick={this.handleSearch}>
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
    }
}

export default MainPage;
