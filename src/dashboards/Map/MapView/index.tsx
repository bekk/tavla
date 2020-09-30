import React, { useState } from 'react'

import ReactMapGL, { Marker } from 'react-map-gl'
import { StopPlaceWithDepartures, LineData } from '../../../types'
import { BikeRentalStation } from '@entur/sdk'
import PositionPin from '../../../assets/icons/positionPin'
import BicycleCapacity from '../../../assets/icons/bicycleCapacity'

import Tooltip from '../Tooltip'
import { DEFAULT_ZOOM } from '../../../constants'
import { useSettingsContext } from '../../../settings'
import Tile from '../components/Tile'

import './styles.scss'

const MapView = ({
    bikeRentalStations,
    stopPlacesWithDepartures,
}: Props): JSX.Element => {
    const [settings, { setZoom }] = useSettingsContext()
    const [viewport, setViewPort] = useState({
        latitude: settings?.coordinates?.latitude,
        longitude: settings?.coordinates?.longitude,
        width: 'auto',
        height: window.innerHeight - 124,
        zoom: settings?.zoom ?? DEFAULT_ZOOM,
        maxZoom: 16,
        minZoom: 13.5,
    })

    const data = 2

    return (
        <div>
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
                mapStyle={process.env.MAPBOX_STYLE}
                onViewportChange={(vp): void => {
                    const { zoom, maxZoom, minZoom } = vp
                    setZoom(zoom)
                    setViewPort({
                        latitude: settings?.coordinates?.latitude,
                        longitude: settings?.coordinates?.longitude,
                        width: 'auto',
                        height: window.innerHeight - 124,
                        zoom,
                        maxZoom,
                        minZoom,
                    })
                }}
            >
                <Marker
                    latitude={viewport.latitude || 0}
                    longitude={viewport.longitude || 0}
                >
                    <PositionPin size="24px" />
                </Marker>
                {bikeRentalStations?.map((station) => (
                    <Marker
                        key={station.id}
                        latitude={station.latitude}
                        longitude={station.longitude}
                        marker-size="large"
                    >
                        <BicycleCapacity
                            capacity={station.bikesAvailable ?? 0}
                        ></BicycleCapacity>
                    </Marker>
                ))}
            </ReactMapGL>
            <div className="departure-display">
                {stopPlacesWithDepartures?.map((sp) =>
                    sp.departures.length ? (
                        <Tile key={sp.id} stopPlace={sp}></Tile>
                    ) : (
                        []
                    ),
                )}
            </div>
        </div>
    )
}

interface Props {
    stopPlacesWithDepartures: StopPlaceWithDepartures[] | null
    bikeRentalStations: BikeRentalStation[] | null
}

export default MapView
