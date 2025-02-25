import { useState } from 'react'
import { useImmer } from 'use-immer'
import loadingGif from './assets/loading.gif'
import ExcelImg from './assets/excel.jpg'
import ScheduleUploader from './ScheduleUploader'
import ScheduleFilter from './ScheduleFilter'
import ScheduleTable from './ScheduleTable'
import { parseSchedule, Schedule } from './ClassLesson'

export default function AddAndFilterSchedule() {
    const [filters, setFilters] = useImmer<Record<string, string>>({
        "группа": '',
        "преподаватель": '',
        "аудитория": '',
        "тип предмета": '',
        "название предмета": '',
    })
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [fileNames, setFileNames] = useState<string[]>([])

    async function handleFileChange(files: FileList | null) {
        if (!files || files.length === 0) return

        const newFileNames = Array.from(files).map(file => file.name)
        setFileNames(newFileNames)
        setLoading(true)
        const parsedSchedules = await parseSchedule(Array.from(files))
        setSchedules(parsedSchedules)
        setFilteredSchedules(parsedSchedules)
        setLoading(false)
    }

    function handleFilterChange(filterType: string, value: string) {
        setFilters(draft => {
            draft[filterType] = value
        })
    }

    function handleFilter() {
        const filtered = schedules.filter(schedule => {
            for (const filterType of Object.keys(filters)) {
                const filterValue = filters[filterType]?.toLowerCase()
                if (filterValue) {
                    if (filterType === 'группа' && !schedule.group?.toLowerCase().includes(filterValue)) {
                        return false
                    }
                    if (filterType === 'преподаватель' && !schedule.teacher?.toLowerCase().includes(filterValue)) {
                        return false
                    }
                    if (filterType === 'аудитория' && !schedule.classroom?.toLowerCase().includes(filterValue)) {
                        return false
                    }
                    if (filterType === 'тип предмета' && !schedule.subjectType?.toLowerCase().includes(filterValue)) {
                        return false
                    }
                    if (filterType === 'название предмета' && !schedule.subjectName?.toLowerCase().includes(filterValue)) {
                        return false
                    }
                }
            }
            return true
        })
        setFilteredSchedules(filtered)
    }

    return (
        <div>
            <ScheduleUploader
                onFileChange={handleFileChange}
                loading={loading}
                loadingGif={loadingGif}
                buttonImage={ExcelImg}
            />
            {fileNames.length > 0 && (
                <div>
                    <h3>Выбранные файлы:</h3>
                    <ul>
                        {fileNames.map((name, index) => (
                            <li key={index}>{name}</li>
                        ))}
                    </ul>
                </div>
            )}
            {schedules.length > 0 && (
                <div>
                    <ScheduleFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onApplyFilter={handleFilter}
                        onResetFilters={() => {
                            setFilters(draft => {
                                Object.keys(draft).forEach(key => {
                                    draft[key] = ''
                                })
                            })
                        }}
                    />
                </div>
            )}
            <ScheduleTable schedules={filteredSchedules} filters={{}} />
        </div>
    )
}
