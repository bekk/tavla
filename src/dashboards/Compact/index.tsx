import React from 'react'
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout'

import {
    useBikeRentalStations,
    useStopPlacesWithDepartures,
    useScooters,
} from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'
import ResizeHandle from '../../assets/icons/ResizeHandle'

import DepartureTile from './DepartureTile'
import BikeTile from './BikeTile'
import ScooterTile from './ScooterTile'
import './styles.scss'

import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../settings/LocalStorage'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

function onLayoutChange(layouts: Layouts, key: string): void {
    saveToLocalStorage(key, layouts)
}

function getDataGrid(
    index: number,
    maxWidth: number,
): { [key: string]: number } {
    return {
        w: 1,
        maxW: maxWidth,
        minH: 1,
        h: 4,
        x: index,
        y: 0,
    }
}

const EnturDashboard = ({ history }: Props): JSX.Element => {
    const dashboardKey = history.location.key

    const bikeRentalStations = useBikeRentalStations()

    const scooters = useScooters()

    let stopPlacesWithDepartures = useStopPlacesWithDepartures()

    if (stopPlacesWithDepartures) {
        stopPlacesWithDepartures = stopPlacesWithDepartures.filter(
            ({ departures }) => departures.length > 0,
        )
    }

    const numberOfStopPlaces = stopPlacesWithDepartures
        ? stopPlacesWithDepartures.length
        : 0
    const anyBikeRentalStations: number | null =
        bikeRentalStations && bikeRentalStations.length

    const anyScooters = Boolean(scooters && scooters.length)

    const localStorageLayout: Layouts =
        getFromLocalStorage(history.location.key) || {}

    const bikeCol = anyBikeRentalStations ? 1 : 0

    const scooterCol = anyScooters ? 1 : 0

    const cols = {
        lg: numberOfStopPlaces + bikeCol + scooterCol,
        md: numberOfStopPlaces + bikeCol + scooterCol,
        sm: 1,
        xs: 1,
        xxs: 1,
    }

    const maxWidthCols = cols.lg + 1

    return (
        <DashboardWrapper
            className="compact"
            history={history}
            bikeRentalStations={bikeRentalStations}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
            scooters={scooters}
        >
            <div className="compact__tiles">
                <ResponsiveReactGridLayout
                    key={numberOfStopPlaces}
                    cols={cols}
                    layouts={localStorageLayout}
                    compactType="horizontal"
                    isResizable={true}
                    onLayoutChange={(
                        layout: Layout[],
                        layouts: Layouts,
                    ): void => {
                        if (numberOfStopPlaces > 0) {
                            onLayoutChange(layouts, dashboardKey)
                        }
                    }}
                >
                    {(stopPlacesWithDepartures || []).map((stop, index) => (
                        <div
                            key={index.toString()}
                            data-grid={getDataGrid(index, maxWidthCols)}
                        >
                            <ResizeHandle
                                size="32"
                                className="resizeHandle"
                                variant="light"
                            />
                            <DepartureTile
                                key={index}
                                stopPlaceWithDepartures={stop}
                                numberOfCols={cols.lg}
                            />
                        </div>
                    ))}
                    {bikeRentalStations && anyBikeRentalStations ? (
                        <div
                            key={numberOfStopPlaces.toString()}
                            data-grid={getDataGrid(
                                numberOfStopPlaces,
                                maxWidthCols,
                            )}
                        >
                            <ResizeHandle
                                size="32"
                                className="resizeHandle"
                                variant="light"
                            />
                            <BikeTile stations={bikeRentalStations} />
                        </div>
                    ) : (
                        []
                    )}
                    {scooters?.length ? (
                        <div
                            id="scooter"
                            key="sparkesykkel"
                            data-grid={getDataGrid(
                                numberOfStopPlaces + scooterCol,
                                maxWidthCols,
                            )}
                        >
                            <ResizeHandle
                                size="32"
                                className="resizeHandle"
                                variant="dark"
                            />
                            <ScooterTile scooters={scooters} />
                        </div>
                    ) : (
                        []
                    )}
                </ResponsiveReactGridLayout>
            </div>
        </DashboardWrapper>
    )
}

interface Props {
    history: any
}

export default EnturDashboard
