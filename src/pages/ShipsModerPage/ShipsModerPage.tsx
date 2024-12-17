import React, { FC, useContext, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../../Route";
import API from "../../api/API";
import { SHIPS_MOCK } from "../../modules/mock";
import "./ShipsModerPage.css";

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

type State = {
    ships: Ship[];
    searchQuery: string;
};

type Action =
    | { type: "SET_SHIPS"; payload: Ship[] }
    | { type: "SET_SEARCH_QUERY"; payload: string };

const initialState: State = {
    ships: [],
    searchQuery: "",
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_SHIPS":
            return { ...state, ships: action.payload };
        case "SET_SEARCH_QUERY":
            return { ...state, searchQuery: action.payload };
        default:
            return state;
    }
};

const ShipsContext = React.createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
} | null>(null);

const ShipsProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <ShipsContext.Provider value={{ state, dispatch }}>
            {children}
        </ShipsContext.Provider>
    );
};

const useShips = () => {
    const context = useContext(ShipsContext);
    if (!context) {
        throw new Error("useShips must be used within a ShipsProvider");
    }
    return context;
};

const ShipsModerPage: FC = () => {
    const { state, dispatch } = useShips();
    const { ships, searchQuery } = state;

    const getShips = async () => {
        try {
            const response = await API.getShips();
            const data = await response.json();
            dispatch({ type: "SET_SHIPS", payload: data.ships });
        } catch (error) {
            console.error("Ошибка при загрузке данных с бэкенда:", error);
            dispatch({ type: "SET_SHIPS", payload: SHIPS_MOCK });
        }
    };

    useEffect(() => {
        getShips();
    }, []);

    const filteredShips = ships.filter((ship) =>
        ship.ship_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value });
    };

    const handleDeleteClick = async (shipId: string) => {
        try {
            await API.deleteShip(Number(shipId)); // Удаляем корабль по id
            // Обновляем список кораблей после удаления
            dispatch({ type: "SET_SHIPS", payload: ships.filter((ship) => ship.id !== shipId) });
        } catch (error) {
            console.error("Ошибка при удалении корабля:", error);
        }
    };

    return (
        <div className="main-page">
            <div>
                <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SHIPS }]} />
            </div>
            <div className="search-container-moder">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Введите название"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <div>
                <div>
                    <Link 
                        to={`/add-ships`} 
                        className="ship-add-button-moder">
                        Добавить новый корабль
                    </Link>
                </div>
                {filteredShips.length === 0 ? (
                    <div>К сожалению, ничего не найдено :(</div>
                ) : (
                    filteredShips.map((ship) => (
                        <div key={ship.id} className="ship-card-moder">
                            <img src={ship.photo} alt={ship.ship_name} className="ship-photo-moder" />
                            <div className="ship-details-moder">
                                <div className="ship-field">
                                    <strong>Название:</strong>
                                    <Link to={`/ships/${ship.id}`} className="ship-name-link" style={{ cursor: "pointer" }}>
                                        {ship.ship_name}
                                    </Link>
                                </div>
                                <div className="ship-field"><strong>Год:</strong> {ship.year}</div>
                                <div className="ship-field"><strong>Длина:</strong> {ship.length} м</div>
                                <div className="ship-field"><strong>Водоизмещение:</strong> {ship.displacement} т</div>
                                <div className="ship-field"><strong>Экипаж:</strong> {ship.crew}</div>
                                <div className="ship-field"><strong>Страна:</strong> {ship.country}</div>
                                <div>
                                    <Link 
                                        to={`/edit-ships/${ship.id}`} 
                                        className="ship-edit-button">
                                        Изменить
                                    </Link>
                                    <button className="ship-delete-button" onClick={() => handleDeleteClick(ship.id)}>Удалить</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default () => (
    <ShipsProvider>
        <ShipsModerPage />
    </ShipsProvider>
);
