import { useState, useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import loadingGif from './assets/loading.gif'
import ExcelImg from './assets/excel.jpg'
import ScheduleUploader from './ScheduleUploader'
import ScheduleFilter from './ScheduleFilter'
import ScheduleTable from './ScheduleTable'
import FileAdder from './FileAdder'
import { parseSchedule, Schedule } from './ClassLesson'

export default function AppendAndFilterSchedule(): JSX.Element {
    const [filters, updateFilters] = useImmer<Record<string, string>>({
        "группа": '',
        "преподаватель": '',
        "аудитория": '',
        "тип предмета": '',
        "название предмета": ''
    })

    const [schedules, updateSchedules] = useImmer<Schedule[]>([])
    const [filteredSchedules, setFilteredSchedules] = useImmer<Schedule[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [uploadedFiles, updateUploadedFiles] = useImmer<string[]>([])
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [fileNames, updateFileNames] = useImmer<string[]>([])

    useEffect(() => {
        const savedSchedules = localStorage.getItem('schedules')
        const savedFiles = localStorage.getItem('uploadedFiles')

        if (savedSchedules) {
            const parsedSchedules = JSON.parse(savedSchedules)
            updateSchedules(() => parsedSchedules)
            setFilteredSchedules(() => parsedSchedules)
        }

        if (savedFiles) {
            updateUploadedFiles(() => JSON.parse(savedFiles))
        }
    }, [])

    function saveSchedulesToLocalStorage(newSchedules: Schedule[]): void {
        localStorage.setItem('schedules', JSON.stringify(newSchedules))
    }

    function saveUploadedFilesToLocalStorage(files: string[]): void {
        localStorage.setItem('uploadedFiles', JSON.stringify(files))
    }

    function handleFileChange(files: FileList | null, isUploader: boolean = false): void {
        if (!files || files.length === 0) return

        setLoading(true)

        const newFiles = Array.from(files)
        const newFileNames = newFiles.map((file) => file.name)

        if (isUploader) {
            updateFileNames(() => newFileNames)
            updateUploadedFiles(() => newFileNames)
            updateSchedules(() => [])
            setFilteredSchedules(() => [])
        } else {
            updateFileNames((prev) => [...prev, ...newFileNames])
            updateUploadedFiles((prev) => [...prev, ...newFileNames])
        }

        parseSchedule(newFiles).then((parsedSchedules) => {
            updateSchedules((draft) => {
                if (isUploader) {
                    return parsedSchedules
                } else {
                    draft.push(...parsedSchedules)
                }
            })

            setFilteredSchedules(() => {
                if (isUploader) {
                    return parsedSchedules
                } else {
                    return [...schedules, ...parsedSchedules]
                }
            })

            saveSchedulesToLocalStorage(isUploader ? parsedSchedules : schedules)
            saveUploadedFilesToLocalStorage(isUploader ? newFileNames : uploadedFiles)
            setLoading(false)
        })
    }

    function handleFilterChange(filterType: string, value: string): void {
        updateFilters((draft) => {
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

    const handleClearAll = (): void => {
        updateSchedules(() => []) 
        setFilteredSchedules(() => [])
        updateUploadedFiles(() => [])
        updateFileNames(() => [])
        localStorage.removeItem('schedules')
        localStorage.removeItem('uploadedFiles')
    }

    return (
        <div>
            <ScheduleUploader
                onFileChange={(files) => handleFileChange(files, true)} 
                loading={loading}
                loadingGif={loadingGif}
                buttonImage={ExcelImg}
                onClick={() => {
                    handleClearAll()
                    if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                    }
                }}
            />

            <FileAdder 
                onAddFile={(files) => handleFileChange(files, false)}
                fileInputRef={fileInputRef}
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
                        onResetFilters={() => updateFilters((draft) => {
                            Object.keys(draft).forEach(key => draft[key] = '')
                        })}
                    />
                </div>
            )}

            <button onClick={handleClearAll} style={{ marginTop: '20px', color: 'red' }}>
                Очистить все
            </button>

            <ScheduleTable schedules={filteredSchedules} filters={{}} />
        </div>
    )
}
