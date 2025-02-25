import  { useRef } from 'react'
import CustomButton from './CustomButton'

export default function ScheduleUploader({ onFileChange, loading, loadingGif, buttonImage }: { onFileChange: (files: FileList | null) => void
    loading: boolean
    loadingGif: string
    buttonImage: string
    onClick?: () => void}) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    }
    return (
        <div>
            <h1>Загрузчик расписания преподавателей</h1>
            {loading && (
                <div>
                    <img
                        src={loadingGif}
                        alt="Загрузка..."
                        style={{ width: '160px', height: '100px' }}
                    />
                </div>
            )}
            <CustomButton 
                onClick={handleButtonClick} 
                text="Выбрать файлы" 
                imageSrc={buttonImage} 
                altText="Иконка кнопки"
            />
            <input
                type="file"
                multiple
                accept=".xlsx, .xls"
                onChange={(e) => onFileChange(e.target.files)}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
        </div>
    )
}


