import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'

import DashboardWrapper from '../../containers/DashboardWrapper'
import { DEFAULT_ZOOM } from '../../constants'
import { useSettingsContext } from '../../settings'
import { useStopPlacesWithDepartures, useBikeRentalStations } from '../../logic'
import PositionPin from '../../assets/icons/positionPin'
import { Coordinates } from '@entur/sdk'
import BicycleCapacity from '../../assets/icons/bicycleCapacity'

import './styles.scss'
import Tooltip from './Tooltip'

const MapView = ({ history }: Props): JSX.Element => {
    const [settings] = useSettingsContext()
    const [viewport, setViewPort] = useState({
        latitude: settings?.coordinates?.latitude,
        longitude: settings?.coordinates?.longitude,
        width: 'auto',
        height: window.innerHeight - 124,
        zoom: settings?.zoom ?? DEFAULT_ZOOM,
    })

    const stopPlacesWithDepartures = useStopPlacesWithDepartures()
    const bikeRentalStations = useBikeRentalStations()

    const data = 5
    console.log(stopPlacesWithDepartures)
    console.log(bikeRentalStations)
    return (
        <DashboardWrapper
            className="map-tile"
            history={history}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
            bikeRentalStations={bikeRentalStations}
        >
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
                mapStyle={process.env.MAPBOX_STYLE}
                onViewportChange={(vp): void => {
                    const { width, height, latitude, longitude, zoom } = vp
                    setViewPort({
                        latitude,
                        longitude,
                        width: 'auto',
                        height: window.innerHeight - 124,
                        zoom,
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
                {stopPlacesWithDepartures?.map((stopPlace) => (
                    <Marker
                        key={stopPlace.id}
                        latitude={stopPlace.latitude ?? 0}
                        longitude={stopPlace.longitude ?? 0}
                        offsetLeft={-0}
                        offsetTop={-10}
                    >
                        <Tooltip
                            placement={data > 1 ? 'top' : 'right'}
                            stopPlace={stopPlace}
                        >
                            <div className="tooltip-content"></div>
                        </Tooltip>
                    </Marker>
                ))}
            </ReactMapGL>
        </DashboardWrapper>
    )
}

interface Props {
    history: any
}

export default MapView
