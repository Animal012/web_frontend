import { FC, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { login, logout } from "../../slices/userSlice";
import { resetFilters } from "../../slices/shipsSlice";
import API from "../../api/API";
import { getCookie, deleteCookie } from "../../api/Utils";

const Header: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, userName, isStaff } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const sessionId = getCookie("session_id");
    if (sessionId) {
      const checkSession = async () => {
        try {
          const sessionData = await API.getSession();
          if (sessionData.username) {
            dispatch(
              login({ username: sessionData.username, isStaff: sessionData.isStaff })
            ); // Обновляем Redux с новыми данными
          } else {
            dispatch(logout());
          }
        } catch (error) {
          console.error("Ошибка при проверке сессии:", error);
          dispatch(logout());
        }
      };
      checkSession();
    }
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await API.logout();
      deleteCookie("session_id");
      dispatch(logout());
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
