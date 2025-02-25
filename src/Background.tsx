import React from 'react'
import './assets/style.css'

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="background-wrapper">
      {children}
    </div>
  )
}
