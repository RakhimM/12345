import React, { useState } from 'react';

interface HeatmapProps {
    width: number;
    height: number;
}

const Heatmap: React.FC<HeatmapProps> = ({ width, height }) => {
    const [coordinates, setCoordinates] = useState<{ x: number; y: number }[]>([]);

    const handleClick = (event: React.MouseEvent) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        setCoordinates((prev) => [...prev, { x, y }]);
    };

    return (
        <div
            onClick={handleClick}
            style={{
                position: 'relative',
                width: `${width}px`,
                height: `${height}px`,
                background: 'lightgrey',
                border: '1px solid black',
            }}
        >
            {coordinates.map((coord, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        left: coord.x,
                        top: coord.y,
                        width: '10px',
                        height: '10px',
                        backgroundColor: 'rgba(255, 0, 0, 0.7)',
                        borderRadius: '50%',
                    }}
                ></div>
            ))}
        </div>
    );
};

export default Heatmap;
