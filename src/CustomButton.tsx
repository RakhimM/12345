import React from 'react'

export default function CustomButton({
    onClick,
    text,
    imageSrc,
    altText,
    style,
    imageStyle,
}: {
    onClick: () => void
    text: string
    imageSrc: string
    altText: string
    style?: React.CSSProperties
    imageStyle?: React.CSSProperties
}) {
    return (
        <button 
            onClick={onClick} 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', ...style }}
        >
            <img 
                src={imageSrc} 
                alt={altText} 
                style={{ width: '40px', height: '40px', ...imageStyle }} 
            />
            {text}
        </button>
    )
}
