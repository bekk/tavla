import React from 'react'
import './styles.scss'
import DepartureRow from '../DepartureRow'
import { StopPlaceWithDepartures } from '../../../types'

const Tooltip = (props: Props): JSX.Element => {
    if (props.stopPlace.departures.length) {
        return (
            <div className={`entur-tooltip entur-tooltip--${props.placement}`}>
                <DepartureRow
                    departure={props.stopPlace.departures[0]}
                ></DepartureRow>
                <DepartureRow
                    departure={props.stopPlace.departures[1]}
                ></DepartureRow>
                {props.children}
            </div>
        )
    }
    return <div></div>
}

type Props = {
    stopPlace: StopPlaceWithDepartures
    placement: string
    children: JSX.Element
}

export default Tooltip
