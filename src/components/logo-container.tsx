import React from 'react'
import { Link } from 'react-router-dom'

export const LogoContainer = () => {
  return (
    <Link to={"/"} className="flex items-center">
      <img 
        src="/svg/logo.svg" 
        alt="Logo" 
        className="w-10 h-10 object-contain" 
        style={{ display: "block" }}
      />
    </Link>
  )
}
