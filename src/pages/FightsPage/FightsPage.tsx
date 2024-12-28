import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../../api/API";
import { RootState } from "../../store";
import "./FightsPage.css";

interface Fight {
  id: string;
  fight_name: string;
  result: string;
  sailors: number | null;
  created_at: string;
  formed_at: string;
  completed_at: string;
  status: string;
  creator: string;
}

const FightsPage = () => {
  const [fights, setFights] = useState<Fight[]>([]);
  const [filteredFights, setFilteredFights] = useState<Fight[]>([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [authorFilter, setAuthorFilter] = useState<string>(""); // Состояние для автора
  const navigate = useNavigate();

  const { isStaff } = useSelector((state: RootState) => state.user);

  const fetchFights = async () => {
    try {
      const response = await API.getFights({ status });
      const data = (await response.json()) as Fight[];
      setFights(data);
      setFilteredFights(data);
    } catch (error) {
      console.error("Ошибка при загрузке сражений:", error);
    }
  };

  useEffect(() => {
    fetchFights();
    const intervalId = setInterval(fetchFights, 5000);
    return () => clearInterval(intervalId);
  }, [status]);

  useEffect(() => {
    const filtered = fights.filter((fight) => {
      const fightDate = new Date(fight.created_at);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      return (
        (!fromDate || fightDate >= fromDate) &&
        (!toDate || fightDate <= toDate) &&
        (!authorFilter || fight.creator.toLowerCase().includes(authorFilter.toLowerCase()))
      );
    });

    setFilteredFights(filtered);
  }, [dateFrom, dateTo, authorFilter, fights]);

  const formatDate = (dateString: string): string =>
    dateString ? dateString.split("T")[0] : "—";

  const getStatusText = (status: string): string => {
    switch (status) {
      case "f":
        return "В работе";
      case "c":
        return "Завершена";
      case "r":
        return "Отклонена";
      default:
        return "Неизвестен";
    }
  };

  const getSailorsText = (sailors: number | null): string =>
    sailors && sailors > 0 ? sailors.toString() : "—";

  const handleAccept = async (id: string) => {
    try {
      const response = await API.completeFight(parseInt(id));
      if (response.ok) {
        console.log(`Сражение с ID ${id} успешно завершено.`);
        fetchFights();
      } else {
        console.error(`Не удалось завершить сражение с ID ${id}:`, response);
      }
    } catch (error) {
      console.error(`Ошибка при завершении сражения с ID ${id}:`, error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await API.rejectedFight(parseInt(id));
      if (response.ok) {
        console.log(`Сражение с ID ${id} успешно отклонено.`);
        fetchFights();
      } else {
        console.error(`Не удалось отклонить сражение с ID ${id}:`, response);
      }
    } catch (error) {
      console.error(`Ошибка при отклонении сражения с ID ${id}:`, error);
    }
  };

  return (
    <div className="fights-page">
      <h1>Ваши сражения</h1>
      <div className="filters">
        {isStaff && (
          <label>
            Создатель:
            <input
              type="text"
              className="fights-page-input"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              placeholder="Введите создателя"
            />
          </label>
        )}
        <label>
          Дата от:
          <input
            type="date"
            className="fights-page-input"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </label>
        <label>
          Дата до:
          <input
            type="date"
            className="fights-page-input"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </label>
        <label>
          Статус:
          <select
            className="fights-page-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Все</option>
            <option value="f">В работе</option>
            <option value="c">Завершена</option>
            <option value="r">Отклонена</option>
          </select>
        </label>
      </div>

      <div className="fights-list">
        <div className="fight-row">
          <div className="fight-row-section"><strong>№</strong></div>
          <div className="fight-row-section"><strong>Название</strong></div>
          <div className="fight-row-section"><strong>Статус</strong></div>
          <div className="fight-row-section"><strong>Общее количество моряков</strong></div>
          <div className="fight-row-section"><strong>Дата создания</strong></div>
          <div className="fight-row-section"><strong>Дата формирования</strong></div>
          <div className="fight-row-section"><strong>Дата завершения</strong></div>
          {isStaff && <div className="fight-row-section"><strong>Создатель</strong></div>}
          {isStaff && <div className="fight-row-section"><strong>Действие</strong></div>}
        </div>
        {filteredFights.map((fight) => (
          <div
            key={fight.id}
            className="fight-row"
            onClick={() => navigate(`/fights/${fight.id}`)}
          >
            <div className="fight-row-section">
              <div>{fight.id}</div>
            </div>
            <div className="fight-row-section">
              <div>{fight.fight_name}</div>
            </div>
            <div className="fight-row-section">
              <div>{getStatusText(fight.status)}</div>
            </div>
            <div className="fight-row-section">
              <div>{getSailorsText(fight.sailors)}</div>
            </div>
            <div className="fight-row-section">
              <div>{formatDate(fight.created_at)}</div>
            </div>
            <div className="fight-row-section">
              <div>{formatDate(fight.formed_at)}</div>
            </div>
            <div className="fight-row-section">
              <div>{formatDate(fight.completed_at)}</div>
            </div>

            {isStaff && (
              <div className="fight-row-section">
                <div>{fight.creator}</div>
              </div>
            )}

            {isStaff && (
              <div className="fight-row-section">
                {fight.status === "f" ? (
                  <div className="fight-row-buttons">
                    <button
                      className="fight-complete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(fight.id);
                      }}
                    >
                      Принять
                    </button>
                    <button
                      className="fight-reject"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(fight.id);
                      }}
                    >
                      Отклонить
                    </button>
                  </div>
                ) : (
                  <div>—</div>
                )}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default FightsPage;
