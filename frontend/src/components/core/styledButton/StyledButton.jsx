import React, { useState } from 'react'

function StyledButton({name, onClick, color="#1e90ff", hoverColor="#70a1ff"}) {
    const[currentColor, setCurrentColor] = useState(color)

    const onMouseEnter = () => {
        setCurrentColor(hoverColor)
    }
  return (
    <div className="styled-button" style={{backgroundColor: currentColor}} onMouseEnter={onMouseEnter} onMouseLeave={() => setCurrentColor(color)} onClick={onClick}>
        <p>{name}</p>
    </div>
  )
}

export default StyledButton