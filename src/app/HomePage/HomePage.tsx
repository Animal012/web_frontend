import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; 

export const HomePage: FC = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="home">
      <div className="overlay" />
      <div className="content">
        <h1>Морские сражения в Тихом океане</h1>
        <p>
          Исследуйте великие морские сражения в Тихом океане. Выбирайте корабли и
          воссоздавайте сражения. Получите доступ к историческим данным и 
          управлению флотом.
        </p>
        <Link to="/ships">
            <button className="custom-button">Просмотр кораблей</button>
        </Link>
      </div>
    </div>
  );
};
