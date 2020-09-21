import React from 'react'
import './styles.scss'

const TravelTag = ({ icon, color, departure }: Props): JSX.Element => {
    return (
        <div className="icon-box" style={{ backgroundColor: color }}>
            <div className="icon-box__icon">{icon}</div>
            <div>{departure}</div>
        </div>
    )
}

interface Props {
    icon: JSX.Element | null
    color: string
    departure: string
}

export default TravelTag
