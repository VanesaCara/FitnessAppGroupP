import React from 'react';

function PointSelector({ id, options, selectedOption, onSelectChange }) {
    return (
        <div style={{ marginBottom: '20px' }}>
            <h2>TrackPoint {id}</h2>
            <select
                value={selectedOption}
                onChange={(e) => onSelectChange(id, e.target.value)}
            >
                <option value="" disabled>
                    Bitte auswählen...
                </option>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default PointSelector;
