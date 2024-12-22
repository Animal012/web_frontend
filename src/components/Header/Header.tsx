import { FC, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { loginUserFromSession, logoutUser } from "../../slices/userSlice";
import { resetFilters } from "../../slices/shipsSlice";

const Header: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, userName, isStaff } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Проверка сессии при монтировании компонента
    dispatch(loginUserFromSession());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // Дожидаемся завершения действия
      dispatch(resetFilters());
      navigate("/"); // Переход на главную страницу
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
    }
  };

  return (
    <nav className="header">
      <Link to="/">
        <img src="/icon.svg" alt="Logo" />
      </Link>
      <div className="header-links">
        <Link to={isStaff ? "/moderator-ships" : "/ships"}>Корабли</Link>
        <Link to="/fights">Сражения</Link>
        {isLoggedIn ? (
          <>
            <Link to="/profile">
              <span>{userName}</span>
            </Link>
            <button onClick={handleLogout} className="button-exit">
              Выйти
            </button>
          </>
        ) : (
          <Link to="/auth">
            <button className="button-exit">Войти</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
