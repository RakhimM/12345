import { useNavigate } from 'react-router-dom'
import './assets/style.css'

export default function HomePage(){
    const navigate = useNavigate()
    return (
        <div className="homepage-container">
            <h1 className="homepage-title">Добро пожаловать! </h1>
            <div className="homepage-buttons">
                <button onClick={() => navigate('/new-files')}>
                    Выбрать данные, фильтровать, но не сохранять
                </button>
                <button onClick={() => navigate('/filter-schedules')}>
                    Добавить и фильтровать данные с сохранением
                </button>
            </div>
        </div>
    )
}

