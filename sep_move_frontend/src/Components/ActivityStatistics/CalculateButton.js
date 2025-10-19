import React from 'react';

function CalculateButton({ onClick }) {
    return (
        <button onClick={onClick} style={{ padding: '10px', cursor: 'pointer', marginTop: '20px' }}>
            Berechnen
        </button>
    );
}

export default CalculateButton;
