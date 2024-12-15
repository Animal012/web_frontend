import { useEffect, useState } from 'react';
import API from '../../api/API';
import { useNavigate } from 'react-router-dom';
import './FightsPage.css';

interface Fight {
  id: string;
  fight_name: string;
  result: string;
  sailors: number | null; // Обновление: допускаем, что поле может быть пустым
  created_at: string;
  formed_at: string;
  completed_at: string;
  status: string;
}

const FightsPage = () => {
  const [fights, setFights] = useState<Fight[]>([]);
  const [filteredFights, setFilteredFights] = useState<Fight[]>([]);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const navigate = useNavigate();

  // Загрузка данных
  const fetchFights = async () => {
    try {
      const response = await API.getFights({ status });
      const data = (await response.json()) as Fight[];
      setFights(data);
      setFilteredFights(data);
    } catch (error) {
      console.error('Ошибка при загрузке сражений:', error);
    }
  };

  useEffect(() => {
    fetchFights();
  }, [status]);

  // Фильтрация по дате
  useEffect(() => {
    const filtered = fights.filter((fight) => {
      const createdDate = fight.created_at.split('T')[0]; // Оставляем только YYYY-MM-DD
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      const fightDate = new Date(createdDate);

      return (
        (!fromDate || fightDate >= fromDate) &&
        (!toDate || fightDate <= toDate)
      );
    });

    setFilteredFights(filtered);
  }, [dateFrom, dateTo, fights]);

  const formatDate = (dateString: string): string =>
    dateString ? dateString.split('T')[0] : '—'; // Обрезаем до YYYY-MM-DD

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'f':
        return 'В работе';
      case 'c':
        return 'Завершена';
      case 'r':
        return 'Отклонена';
      default:
        return 'Неизвестен';
    }
  };

  const getSailorsText = (sailors: number | null): string =>
    sailors && sailors > 0 ? sailors.toString() : '—'; // Условие для пустого или нулевого значения

  return (
    <div className="fights-page">
      <h1>Ваши сражения</h1>
      <div className="filters">
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
        {filteredFights.map((fight) => (
          <div
            key={fight.id}
            className="fight-row"
            onClick={() => navigate(`/fights/${fight.id}`)}
          >
            <div className="fight-row-section">
              <strong>№</strong>
              <div>{fight.id}</div>
            </div>
            <div className="fight-row-section">
              <strong>Название</strong>
              <div>{fight.fight_name}</div>
            </div>
            <div className="fight-row-section">
              <strong>Статус</strong>
              <div>{getStatusText(fight.status)}</div>
            </div>
            <div className="fight-row-section">
              <strong>Общее количество моряков</strong>
              <div>{getSailorsText(fight.sailors)}</div>
            </div>
            <div className="fight-row-section">
              <strong>Дата создания</strong>
              <div>{formatDate(fight.created_at)}</div>
            </div>
            <div className="fight-row-section">
              <strong>Дата формирования</strong>
              <div>{formatDate(fight.formed_at)}</div>
            </div>
            <div className="fight-row-section">
              <strong>Дата завершения</strong>
              <div>{formatDate(fight.completed_at)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FightsPage;
