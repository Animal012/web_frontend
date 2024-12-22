import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTE_LABELS } from "../../Route";
import { fetchShipDetails } from "../../slices/shipSlice"; // Импортируем thunk
import { RootState } from "../../store";
import { AppDispatch } from "../../store"; // Импортируем AppDispatch для типизации
import "./ShipPage.css";

const ShipPage: FC = () => {
    const { shipId } = useParams<{ shipId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { shipDetails, loading, error } = useSelector((state: RootState) => state.ship);
    const { isStaff } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (shipId) {
            dispatch(fetchShipDetails(shipId));
        }
    }, [dispatch, shipId]);

    useEffect(() => {
        console.log(shipDetails);  // Добавьте лог для проверки
    }, [shipDetails]);

    if (loading) {
        return (
            <div className="loading-gif">
                <img src="/loading.webp" alt="Loading" />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!shipDetails) {
        return <div>Корабль не найден.</div>;
    }

    return (
        <div>
            <div className="breadcrumbs-ship">
                <BreadCrumbs
                    crumbs={[
                        { label: isStaff ? ROUTE_LABELS.MODER_SHIPS : ROUTE_LABELS.SHIPS, path: isStaff ? "/moderator-ships" : "/ships" },
                        { label: shipDetails.ship_name || "Корабль" },
                    ]}
                />
            </div>
            <div className="ship-page">
                <div className="ship-details">
                    <div className="ship-image-card">
                        <img src={shipDetails.photo} alt={shipDetails.ship_name} />
                    </div>
                    <div className="ship-info">
                        <h1>{shipDetails.ship_name}</h1>
                        <p><strong>Год постройки:</strong> {shipDetails.year}</p>
                        <p><strong>Водоизмещение:</strong> {shipDetails.displacement} тонн</p>
                        <p><strong>Длина:</strong> {shipDetails.length} м</p>
                        <p><strong>Экипаж:</strong> {shipDetails.crew}</p>
                        <p><strong>Страна:</strong> {shipDetails.country}</p>
                        <p><strong>Описание:</strong> {shipDetails.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ShipPage;
