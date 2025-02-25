import React from 'react';
import AddIcon from './assets/add.png';

type FileAdderProps = {
    onAddFile: (files: FileList | null) => void;
    fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
};

export default function FileAdder({ onAddFile, fileInputRef }: FileAdderProps) {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            onAddFile(event.target.files);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
            <label
                htmlFor="add-file-input"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <img
                    src={AddIcon}
                    alt="Добавить"
                    style={{ width: '20px', height: '20px', marginRight: '10px' }}
                />
                <span style={{ fontSize: '14px', color: '#333' }}>Добавить файл</span>
            </label>
            <input
                id="add-file-input"
                type="file"
                multiple
                accept=".xls, .xlsx"
                style={{ display: 'none' }}
                onChange={handleInputChange}
                ref={fileInputRef}
            />
        </div>
    );
}


