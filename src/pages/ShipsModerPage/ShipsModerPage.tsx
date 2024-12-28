import React, { createContext, useContext, useEffect, useReducer, FC } from "react";
import { Link } from "react-router-dom";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../../Route";
import API from "../../api/API";
import { SHIPS_MOCK } from "../../modules/mock";
import "./ShipsModerPage.css";

// Типы данных для корабля и состояния
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
    loading: boolean;
    error: string | null;
};

type Action =
    | { type: "SET_SHIPS"; payload: Ship[] }
    | { type: "SET_SEARCH_QUERY"; payload: string }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null };

// Начальное состояние
const initialState: State = {
    ships: [],
    searchQuery: "", // Изначально строка поиска пуста
    loading: false,
    error: null,
};

// Редуктор для управления состоянием
const reducer = (state: State, action: Action): State => {
    console.log("Dispatching action:", action); // Логирование действия
    switch (action.type) {
        case "SET_SHIPS":
            console.log("Setting ships:", action.payload); // Логирование нового состояния для кораблей
            return { ...state, ships: action.payload };
        case "SET_SEARCH_QUERY":
            console.log("Setting search query:", action.payload); // Логирование нового значения строки поиска
            return { ...state, searchQuery: action.payload };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

// Контекст для состояния кораблей
const ShipsContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
} | null>(null);

// Провайдер для контекста
const ShipsProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        console.log("useEffect triggered"); // Логирование вызова useEffect
    
        const getShips = async () => {
            dispatch({ type: "SET_LOADING", payload: true });
            try {
                const response = await API.getShips();
                const data = await response.json();
                console.log("Received ships data:", data.ships); // Логирование полученных данных
                dispatch({ type: "SET_SHIPS", payload: data.ships });
                dispatch({ type: "SET_LOADING", payload: false });
            } catch (err) {
                console.error("Error loading data:", err);
                dispatch({ type: "SET_ERROR", payload: "Ошибка при загрузке данных с бэкенда" });
                dispatch({ type: "SET_LOADING", payload: false });
                dispatch({ type: "SET_SHIPS", payload: SHIPS_MOCK });
            }
        };
    
        getShips();
    }, []); // Пустой массив зависимостей: эффект должен быть вызван только один раз при монтировании
    
    return (
        <ShipsContext.Provider value={{ state, dispatch }}>
            {children}
        </ShipsContext.Provider>
    );
};

// Хук для использования контекста
const useShips = () => {
    const context = useContext(ShipsContext);
    if (!context) {
        throw new Error("useShips must be used within a ShipsProvider");
    }
    return context;
};

// Компонент для отображения страницы с кораблями
const ShipsModerPage: FC = () => {
    const { state, dispatch } = useShips();
    const { ships, searchQuery, loading, error } = state;

    // Логируем текущее состояние перед фильтрацией
    console.log("Ships before filtering:", ships);
    console.log("Search query before filtering:", searchQuery);

    // Фильтрация кораблей по строке поиска, фильтруем только после загрузки данных
    const filteredShips = ships.length > 0 && searchQuery
        ? ships.filter((ship) => ship.ship_name.toLowerCase().includes(searchQuery.toLowerCase()))
        : ships;

    // Обработчик изменения строки поиска
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchQuery = e.target.value;
        console.log("Updating search query:", newSearchQuery); // Логируем новое значение строки поиска
        dispatch({ type: "SET_SEARCH_QUERY", payload: newSearchQuery });
    };

    // Обработчик удаления корабля
    const handleDeleteClick = async (shipId: string) => {
        try {
            await API.deleteShip(Number(shipId)); // Удаляем корабль по id
            dispatch({ type: "SET_SHIPS", payload: ships.filter((ship) => ship.id !== shipId) });
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Ошибка при удалении корабля" });
        }
    };

    // Логируем текущее состояние страницы
    console.log("Current state:", state);

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
                    value={searchQuery} // сохраняем состояние строки поиска
                    onChange={handleSearchChange} // обновляем строку поиска
                />
            </div>
            <div>
                {loading ? (
                    <div>Загрузка...</div>
                ) : error ? (
                    <div>{error}</div>
                ) : filteredShips.length === 0 ? (
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
                                    <button 
                                        className="ship-delete-button" 
                                        onClick={() => handleDeleteClick(ship.id)}>
                                        Удалить
                                    </button>
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
