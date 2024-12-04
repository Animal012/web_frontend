import { useEffect, useState } from 'react';
import API from '../../api/API';
import { useNavigate } from 'react-router-dom';
import './FightsPage.css';

interface Fight {
    id: string;
    fight_name: string;
    result: string;
    sailors: number;
    created_at: string;
    formed_at: string;
    completed_at: string;
    status: string;
    creator: number;
}

const FightsPage = () => {
  const [fights, setFights] = useState<Fight[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFights = async () => {
      try {
        const response = await API.getFights({ date_from: dateFrom, date_to: dateTo, status });
        const data: Fight[] = await response.json();
        setFights(data);
      } catch (error) {
        console.error('Ошибка при загрузке сражений:', error);
      }
    };

    fetchFights();
  }, [dateFrom, dateTo, status]);

  const formatDate = (dateString: string): string =>
    dateString ? new Date(dateString).toLocaleString() : '—';

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

  const handleRowClick = (id: string) => {
    navigate(`/fights/${id}`);
  };

  return (
    <div className="fights-page">
      <h1>Ваши сражения</h1>
      <div className="filters">
        <label className='fights-page-label'>
          <input
            type="date"
            value={dateFrom}
            className='fights-page-input'
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </label>
        <label className='fights-page-label'>
          <input
            type="date"
            value={dateTo}
            className='fights-page-input'
            onChange={(e) => setDateTo(e.target.value)}
          />
        </label>
        <label className='fights-page-label'>
          <select value={status} className='fights-page-select' onChange={(e) => setStatus(e.target.value)}>
            <option value="">Все</option>
            <option value="f">В работе</option>
            <option value="c">Завершена</option>
            <option value="r">Отклонена</option>
          </select>
        </label>
      </div>
      <table className="fights-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Дата формирования</th>
            <th>Дата завершения</th>
          </tr>
        </thead>
        <tbody>
          {fights.map((fight) => (
            <tr
              key={fight.id}
              onClick={() => handleRowClick(fight.id)}
            >
              <td>{fight.id}</td>
              <td>{getStatusText(fight.status)}</td>
              <td>{formatDate(fight.created_at)}</td>
              <td>{formatDate(fight.formed_at)}</td>
              <td>{formatDate(fight.completed_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FightsPage;
