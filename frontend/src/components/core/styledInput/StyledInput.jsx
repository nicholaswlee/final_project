
import React from 'react'

function StyledInput({name, value, onChange, placeholder, type="text"}) {
  return (
    <input className="styled-input" type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}/>
  )
}

export default StyledInput