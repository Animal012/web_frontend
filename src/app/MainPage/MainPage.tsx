import {Component, ReactNode} from "react";
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
};

interface MainPageState {
    ships: Ship[];
    draftId: number| null;
    shipsInBucket: number;
    loading: boolean;
    error: string | null;
}

class MainPage extends Component<{}, MainPageState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            ships: [],
            draftId: null,
            shipsInBucket: 0,
            loading: true,
            error: null
        }
    }

    async getShips() {
        try{
            const response = await API.getShips();
            const data = await response.json();
            console.log(data);
            this.setState({
                ships: data.ships,
                draftId: data.draft_fight_id,
                shipsInBucket: data.count,
                loading: false,
            });
        } catch (error) {
            this.setState({
                error: error.message || "Ошибка загрузки данных",
                loading: false,
            })
            console.log('error: ', error);
        }
    }

    componentDidMount(): void {
        this.getShips()
    }

    render(): ReactNode {
        const { ships, draftId, shipsInBucket, loading, error } = this.state;

        if (loading){
            return <div>Загрузка...</div>
        }

        if (error) {
            return <div>Ошибка {error}</div>
        }

        return (
            <div className="main-page">
                <div className="ship-card-container">
                    <div className="ship-card-grid">
                        {ships.map((ship) => (
                            <ShipCard key={ship.id} ship={ship}/>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default MainPage;