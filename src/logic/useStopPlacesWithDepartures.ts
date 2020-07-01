import { useState, useEffect, useMemo } from 'react'
import { LegMode } from '@entur/sdk'

import { StopPlaceWithDepartures } from '../types'
import {
    transformDepartureToLineData,
    unique,
    isNotNullOrUndefined,
} from '../utils'
import service from '../service'
import { useSettingsContext, Settings } from '../settings'
import { REFRESH_INTERVAL } from '../constants'

import useNearestPlaces from './useNearestPlaces'

async function fetchStopPlaceDepartures(
    settings: Settings,
    nearestStopPlaces: Array<string>,
): Promise<StopPlaceWithDepartures[]> {
    const { newStops, hiddenStops, hiddenModes, hiddenRoutes } = settings

    const allStopPlaceIds = unique([...newStops, ...nearestStopPlaces]).filter(
        id => !hiddenStops.includes(id),
    )

    const allStopPlaceIdsWithoutDuplicateNumber = allStopPlaceIds.map(id =>
        id.replace(/-\d+$/, ''),
    )

    const allStopPlaces = await service.getStopPlaces(
        allStopPlaceIdsWithoutDuplicateNumber,
    )
    const sortedStops = allStopPlaces.sort((a, b) => {
        if (!a && !b) return 0
        if (!a) return -1
        if (!b) return 1
        return a.name.localeCompare(b.name, 'no')
    })

    const whiteListedModes = Object.values(LegMode).filter(
        (mode: LegMode) => !hiddenModes.includes(mode),
    )

    const departures = await service.getDeparturesFromStopPlaces(
        allStopPlaceIdsWithoutDuplicateNumber,
        {
            includeNonBoarding: false,
            limit: 200,
            limitPerLine: 3,
            whiteListedModes,
        },
    )

    const stopPlacesWithDepartures: StopPlaceWithDepartures[] = allStopPlaceIds
        .map(stopId => {
            const stop = sortedStops.find(
                stopPlace =>
                    stopPlace && stopPlace.id === stopId.replace(/-\d+$/, ''),
            )

            if (!stop) return

            const departuresForThisStopPlace = departures.find(
                stopPlace => stopPlace && stop?.id === stopPlace.id,
            )
            if (
                !departuresForThisStopPlace ||
                !departuresForThisStopPlace.departures
            ) {
                return stop
            }

            const mappedAndFilteredDepartures = departuresForThisStopPlace.departures
                .map(transformDepartureToLineData)
                .filter(
                    ({ route }) =>
                        !hiddenRoutes[stopId] ||
                        !hiddenRoutes[stopId].includes(route),
                )

            return {
                ...stop,
                departures: mappedAndFilteredDepartures,
            }
        })
        .filter(isNotNullOrUndefined)

    return stopPlacesWithDepartures
}

export default function useStopPlacesWithDepartures(): Array<
    StopPlaceWithDepartures
> | null {
    const [settings] = useSettingsContext()
    const nearestPlaces = useNearestPlaces(
        settings?.coordinates,
        settings?.distance,
    )
    const [
        stopPlacesWithDepartures,
        setStopPlacesWithDepartures,
    ] = useState<Array<StopPlaceWithDepartures> | null>(null)

    const nearestStopPlaces = useMemo(
        () =>
            nearestPlaces
                .filter(({ type }) => type === 'StopPlace')
                .map(({ id }) => id),
        [nearestPlaces],
    )

    useEffect(() => {
        if (!settings) return
        fetchStopPlaceDepartures(settings, nearestStopPlaces).then(
            setStopPlacesWithDepartures,
        )
        const intervalId = setInterval(() => {
            fetchStopPlaceDepartures(settings, nearestStopPlaces).then(
                setStopPlacesWithDepartures,
            )
        }, REFRESH_INTERVAL)

        return (): void => clearInterval(intervalId)
    }, [nearestStopPlaces, settings])

    return stopPlacesWithDepartures
}
