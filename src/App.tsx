import Background from './Background'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
import ScheduleViewer from './ScheduleViewer'
import AppendAndFilterSchedule from './AppendAndFilterSchedule'

export default function App() {
    return (
        <Background>
            <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/new-files" element={<ScheduleViewer />} />
                        <Route path="/filter-schedules" element={<AppendAndFilterSchedule />} />
                    </Routes>
            </BrowserRouter>
        </Background>
    )
}