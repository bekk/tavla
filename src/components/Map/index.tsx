import { BikeRentalStation, Scooter } from '@entur/sdk'
import React, { useState } from 'react'

import ReactMapGL, { Marker } from 'react-map-gl'

import PositionPin from '../../assets/icons/positionPin'
import ScooterOperatorLogo from '../../assets/icons/scooterOperatorLogo'

import { DEFAULT_ZOOM } from '../../constants'
import { useSettingsContext } from '../../settings'
import { StopPlaceWithDepartures } from '../../types'

import BikeRentalStationTag from './BikeRentalStationTag'
import StopPlaceTag from './StopPlaceTag'

import './styles.scss'

const MapView = ({
    stopPlaces,
    bikeRentalStations,
    scooters,
    walkTimes,
    interactable,
}: Props): JSX.Element => {
    const [settings, { setZoom }] = useSettingsContext()
    const [viewport, setViewPort] = useState({
        latitude: settings?.coordinates?.latitude,
        longitude: settings?.coordinates?.longitude,
        width: 'auto',
        height: '100%',
        zoom: settings?.zoom ?? DEFAULT_ZOOM,
        maxZoom: 18,
        minZoom: 13.5,
    })
    return (
        <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
            mapStyle={process.env.MAPBOX_STYLE_MAPVIEW}
            onViewportChange={
                interactable
                    ? (vp): void => {
                          const { zoom, maxZoom, minZoom } = vp
                          setZoom(zoom)
                          setViewPort({
                              latitude: settings?.coordinates?.latitude,
                              longitude: settings?.coordinates?.longitude,
                              width: 'auto',
                              height: '100%',
                              zoom,
                              maxZoom,
                              minZoom,
                          })
                      }
                    : undefined
            }
        >
            {scooters?.map((sctr) => (
                <Marker key={sctr.id} latitude={sctr.lat} longitude={sctr.lon}>
                    <ScooterOperatorLogo logo={sctr.operator} size={24} />
                </Marker>
            ))}
            {stopPlaces?.map((stopPlace) =>
                stopPlace.departures.length > 0 ? (
                    <Marker
                        key={stopPlace.id}
                        latitude={stopPlace.latitude ?? 0}
                        longitude={stopPlace.longitude ?? 0}
                        offsetLeft={-50}
                        offsetTop={-10}
                    >
                        <StopPlaceTag
                            stopPlace={stopPlace}
                            walkTime={
                                walkTimes?.find(
                                    (walkTime) =>
                                        walkTime.stopId === stopPlace.id &&
                                        walkTime.walkTime !== undefined,
                                )?.walkTime ?? null
                            }
                        />
                    </Marker>
                ) : (
                    []
                ),
            )}
            {bikeRentalStations?.map((station) => (
                <Marker
                    key={station.id}
                    latitude={station.latitude}
                    longitude={station.longitude}
                    marker-size="large"
                >
                    <BikeRentalStationTag
                        bikes={station.bikesAvailable ?? 0}
                        spaces={station.spacesAvailable ?? 0}
                    ></BikeRentalStationTag>
                </Marker>
            ))}
            <Marker
                latitude={viewport.latitude ?? 0}
                longitude={viewport.longitude ?? 0}
            >
                <PositionPin size={24} />
            </Marker>
        </ReactMapGL>
    )
}

interface Props {
    stopPlaces?: StopPlaceWithDepartures[] | null
    bikeRentalStations?: BikeRentalStation[] | null
    scooters?: Scooter[] | null
    walkTimes?: Array<{ stopId: string; walkTime: number }> | null
    interactable: boolean
    zoomFromParent?: number | null
}

export default MapView
