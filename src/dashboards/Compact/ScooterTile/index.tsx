import React from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'

import { BikeRentalStation, Scooter } from '@entur/sdk'

import TestMap from '../../../components/Map'

import './styles.scss'

import { StopPlaceWithDepartures } from '../../../types'

function ScooterTile(data: Props): JSX.Element {
    return (
        <div className="scootertile">
            <TestMap {...data} interactable={false}></TestMap>
        </div>
    )
}

interface Props {
    stopPlaces: StopPlaceWithDepartures[] | null
    bikeRentalStations: BikeRentalStation[] | null
    scooters: Scooter[]
    walkTimes: Array<{ stopId: string; walkTime: number }> | null
}

export default ScooterTile
