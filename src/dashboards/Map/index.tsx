import React from 'react'

import DashboardWrapper from '../../containers/DashboardWrapper'
import {
    useStopPlacesWithDepartures,
    useBikeRentalStations,
    useWalkTime,
} from '../../logic'

import MapView from '../../components/Map'

import DepartureTag from './DepartureTag'
import './styles.scss'

const MapDashboard = ({ history }: Props): JSX.Element => {
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()
    const bikeRentalStations = useBikeRentalStations()
    const walkTimes = useWalkTime(stopPlacesWithDepartures)
    const HEADER_MARGIN = 16
    //Used to calculate the height of the viewport for the map
    const headerHeight =
        (document?.getElementsByClassName('header')[0]?.clientHeight ?? 0) +
        HEADER_MARGIN
    return (
        <DashboardWrapper
            className="map-tile"
            history={history}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
            bikeRentalStations={bikeRentalStations}
        >
            <div style={{ height: `calc(100vh - ${headerHeight}px)` }}>
                <MapView
                    scooters={null}
                    bikeRentalStations={bikeRentalStations}
                    stopPlaces={stopPlacesWithDepartures}
                    walkTimes={walkTimes}
                    interactable={true}
                ></MapView>
                <div className="departure-display">
                    {stopPlacesWithDepartures?.map((sp) =>
                        sp.departures.length ? (
                            <DepartureTag
                                key={sp.id}
                                stopPlace={sp}
                            ></DepartureTag>
                        ) : (
                            []
                        ),
                    )}
                </div>
            </div>
        </DashboardWrapper>
    )
}

interface Props {
    history: any
}

export default MapDashboard
