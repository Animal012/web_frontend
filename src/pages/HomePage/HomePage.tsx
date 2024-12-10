import { FC, useEffect } from "react";
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
      <div className="content">
        <h1>Морские битвы на Тихом океане</h1>
        <p>
          Исследуйте великие морские сражения в Тихом океане. Выбирайте корабли и
          воссоздавайте сражения. Получите доступ к историческим данным и 
          управлению флотом.
        </p>
      </div>
    </div>
  );
};
