import { BikeRentalStation, Scooter } from '@entur/sdk'
import React, { useState, memo, useRef } from 'react'

import { ScooterIcon } from '@entur/icons'

import ReactMapGL, { InteractiveMap, Marker } from 'react-map-gl'
import useSupercluster from 'use-supercluster'

import { ClusterProperties } from 'supercluster'

import PositionPin from '../../assets/icons/positionPin'
import ScooterOperatorLogo from '../../assets/icons/scooterOperatorLogo'

import { useSettingsContext } from '../../settings'
import { StopPlaceWithDepartures } from '../../types'

import BikeRentalStationTag from './BikeRentalStationTag'
import StopPlaceTag from './StopPlaceTag'

import './styles.scss'

const Map = ({
    stopPlaces,
    bikeRentalStations,
    scooters,
    walkTimes,
    interactive,
    mapStyle,
    latitude,
    longitude,
    zoom,
}: Props): JSX.Element => {
    const [, { setZoom }] = useSettingsContext()
    const [viewport, setViewPort] = useState({
        latitude,
        longitude,
        width: 'auto',
        height: '100%',
        zoom,
        maxZoom: 18,
        minZoom: 13.5,
    })
    const mapRef = useRef<InteractiveMap>(null)
    const scooterpoints = scooters?.map((scooter: Scooter) => ({
        type: 'Feature' as 'Feature',
        properties: {
            cluster: false,
            scooterId: scooter.id,
            scooterOperator: scooter.operator,
        },
        geometry: {
            type: 'Point' as 'Point',
            coordinates: [scooter.lon, scooter.lat],
        },
    }))
    const bikeRentalStationPoints = bikeRentalStations?.map(
        (bikeRentalStation: BikeRentalStation) => ({
            type: 'Feature' as 'Feature',
            properties: {
                cluster: false,
                stationId: bikeRentalStation.id,
                bikesAvailable: bikeRentalStation.bikesAvailable,
                spacesAvailable: bikeRentalStation.spacesAvailable,
            },
            geometry: {
                type: 'Point' as 'Point',
                coordinates: [
                    bikeRentalStation.longitude,
                    bikeRentalStation.latitude,
                ],
            },
        }),
    )

    const bounds = mapRef.current
        ? (mapRef.current.getMap().getBounds().toArray().flat() as [
              number,
              number,
              number,
              number,
          ])
        : ([0, 0, 0, 0] as [number, number, number, number])

    const { clusters } = useSupercluster({
        points: scooterpoints ? scooterpoints : [],
        bounds,
        zoom,
        options: { radius: 34, maxZoom: 24 },
    })

    const { clusters: stationClusters } = useSupercluster({
        points: bikeRentalStationPoints ? bikeRentalStationPoints : [],
        bounds,
        zoom,
        options: {
            radius: 45,
            maxZoom: 18,
            map: (props): {} => ({
                bikesAvailable: props.bikesAvailable,
                spacesAvailable: props.spacesAvailable,
            }),
            reduce: (acc, props): {} => {
                acc.bikesAvailable += props.bikesAvailable
                acc.spacesAvailable += props.spacesAvailable
                return acc
            },
        },
    })

    return (
        <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
            mapStyle={mapStyle || process.env.MAPBOX_STYLE_MAPVIEW}
            onViewportChange={
                interactive
                    ? (newViewPort): void => {
                          const {
                              zoom: newZoom,
                              maxZoom,
                              minZoom,
                          } = newViewPort
                          setZoom(newZoom)
                          setViewPort({
                              latitude,
                              longitude,
                              width: 'auto',
                              height: '100%',
                              zoom: newZoom,
                              maxZoom,
                              minZoom,
                          })
                      }
                    : undefined
            }
            ref={mapRef}
        >
            {clusters.map((scooterCluster) => {
                // every cluster point has coordinates
                const [
                    slongitude,
                    slatitude,
                ] = scooterCluster.geometry.coordinates
                // the point may be either a cluster or a scooterpoint
                const { cluster: isCluster } = scooterCluster.properties
                let pointCount = 0
                // the point can have clusterProperties or scooterProoperties
                if (scooterCluster.properties.cluster)
                    pointCount = (scooterCluster.properties as ClusterProperties)
                        .point_count
                // we have a cluster to render
                if (isCluster) {
                    return (
                        <Marker
                            key={`cluster-${scooterCluster.id}`}
                            latitude={slatitude}
                            longitude={slongitude}
                        >
                            <div
                                key={'cluster-child' + scooterCluster.id}
                                className="cluster-marker"
                            >
                                <ScooterIcon className="scooter-icon"></ScooterIcon>
                                <div className="point-count">
                                    {pointCount < 10
                                        ? pointCount
                                        : `${pointCount}+`}
                                </div>
                            </div>
                        </Marker>
                    )
                }

                // we have a single point (crime) to render
                return (
                    <Marker
                        key={scooterCluster.properties.scooterId}
                        latitude={slatitude}
                        longitude={slongitude}
                    >
                        <ScooterOperatorLogo
                            logo={scooterCluster.properties.scooterOperator}
                            size={24}
                        />
                    </Marker>
                )
            })}
            {/* {scooters?.map((scooter) => (
                <Marker
                    key={scooter.id}
                    latitude={scooter.lat}
                    longitude={scooter.lon}
                >
                    <ScooterOperatorLogo logo={scooter.operator} size={24} />
                </Marker>
            ))} */}
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
            {stationClusters.map((stationCluster) => {
                const [
                    slongitude,
                    slatitude,
                ] = stationCluster.geometry.coordinates

                const { cluster: isCluster } = stationCluster.properties
                if (isCluster) {
                    return (
                        <Marker
                            key={stationCluster.id}
                            latitude={slatitude}
                            longitude={slongitude}
                            marker-size="large"
                        >
                            <BikeRentalStationTag
                                bikes={stationCluster.properties.bikesAvailable}
                                spaces={
                                    stationCluster.properties.spacesAvailable
                                }
                            ></BikeRentalStationTag>
                        </Marker>
                    )
                }
                return (
                    <Marker
                        key={stationCluster.properties.stationId}
                        latitude={slatitude}
                        longitude={slongitude}
                        marker-size="large"
                    >
                        <BikeRentalStationTag
                            bikes={stationCluster.properties.bikesAvailable}
                            spaces={stationCluster.properties.spacesAvailable}
                        ></BikeRentalStationTag>
                    </Marker>
                )
            })}
            {/* {bikeRentalStations?.map((station) => (
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
            ))} */}
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
    scooters?: Scooter[]
    walkTimes?: Array<{ stopId: string; walkTime: number }> | null
    interactive: boolean
    mapStyle?: string | undefined
    latitude: number
    longitude: number
    zoom: number
}

export default memo(Map)
