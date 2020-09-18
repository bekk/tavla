import { useState, useEffect, useMemo } from 'react'

import { StopPlaceWithDepartures } from '../types'
import {
    transformDepartureToLineData,
    unique,
    isNotNullOrUndefined,
} from '../utils'
import service from '../service'
import { useSettingsContext } from '../settings'
import { REFRESH_INTERVAL } from '../constants'

import useNearestPlaces from './useNearestPlaces'
import { LegMode } from '@entur/sdk'

async function fetchStopPlaceDepartures(
    newStops: string[],
    hiddenStops: string[],
    hiddenStopModes: { [stopPlaceId: string]: LegMode[] },
    hiddenRoutes: { [stopPlaceId: string]: string[] },
    nearestStopPlaces: string[],
): Promise<StopPlaceWithDepartures[]> {
    //const { newStops, hiddenStops, hiddenStopModes, hiddenRoutes } = settings

    const allStopPlaceIds = unique([...newStops, ...nearestStopPlaces]).filter(
        (id) => !hiddenStops.includes(id),
    )

    const allStopPlaceIdsWithoutDuplicateNumber = allStopPlaceIds.map((id) =>
        id.replace(/-\d+$/, ''),
    )

    const allStopPlaces = await service.getStopPlaces(
        allStopPlaceIdsWithoutDuplicateNumber,
    )
    const sortedStops = allStopPlaces
        .filter(isNotNullOrUndefined)
        .sort((a, b) => a.name.localeCompare(b.name, 'no'))

    const departures = await service.getDeparturesFromStopPlaces(
        allStopPlaceIdsWithoutDuplicateNumber,
        {
            includeNonBoarding: false,
            limit: 200,
            limitPerLine: 3,
        },
    )

    const stopPlacesWithDepartures = allStopPlaceIds.map((stopId) => {
        const stop = sortedStops.find(
            ({ id }) => id === stopId.replace(/-\d+$/, ''),
        )

        if (!stop) return

        const departuresForThisStopPlace = departures
            .filter(isNotNullOrUndefined)
            .find(({ id }) => stop.id === id)

        if (
            !departuresForThisStopPlace ||
            !departuresForThisStopPlace.departures
        ) {
            return { ...stop, departures: [] }
        }

        const mappedAndFilteredDepartures = departuresForThisStopPlace.departures
            .map(transformDepartureToLineData)
            .filter(isNotNullOrUndefined)
            .filter(
                ({ route, type }) =>
                    !hiddenRoutes?.[stopId]?.includes(route) &&
                    !hiddenStopModes?.[stopId]?.includes(type),
            )

        return {
            ...stop,
            departures: mappedAndFilteredDepartures,
        }
    })

    return stopPlacesWithDepartures.filter(isNotNullOrUndefined)
}

export default function useStopPlacesWithDepartures():
    | StopPlaceWithDepartures[]
    | null {
    const [settings] = useSettingsContext()

    const nearestPlaces = useNearestPlaces(
        settings?.coordinates,
        settings?.distance,
    )
    const [stopPlacesWithDepartures, setStopPlacesWithDepartures] = useState<
        StopPlaceWithDepartures[] | null
    >(null)

    const {
        newStops,
        hiddenStops,
        hiddenStopModes,
        hiddenRoutes,
        hiddenModes,
    } = settings || {}

    const nearestStopPlaces = useMemo(
        () =>
            nearestPlaces
                .filter(({ type }) => type === 'StopPlace')
                .map(({ id }) => id),
        [nearestPlaces],
    )

    const newStopsMemo = useMemo(() => newStops?.map((s) => s), [newStops])
    const hiddenStopsMemo = useMemo(() => hiddenStops?.map((hs) => hs), [
        hiddenStops,
    ])
    const hiddenStopModesMemo = useMemo(() => hiddenStopModes, [
        hiddenStopModes,
    ])
    const hiddenRoutesMemo = useMemo(() => hiddenRoutes, [hiddenRoutes])


    const isDisabled = Boolean(hiddenModes?.includes('kollektiv'))

    useEffect(() => {
        if (
            !newStopsMemo ||
            !hiddenStopsMemo ||
            !hiddenStopModesMemo ||
            !hiddenRoutesMemo ||
            isDisabled
        ) {
            return setStopPlacesWithDepartures(null)
        }
        fetchStopPlaceDepartures(
            newStopsMemo,
            hiddenStopsMemo,
            hiddenStopModesMemo,
            hiddenRoutesMemo,
            nearestStopPlaces,
        ).then(setStopPlacesWithDepartures)
        const intervalId = setInterval(() => {
            fetchStopPlaceDepartures(
                newStopsMemo,
                hiddenStopsMemo,
                hiddenStopModesMemo,
                hiddenRoutesMemo,
                nearestStopPlaces,
            ).then(setStopPlacesWithDepartures)
        }, REFRESH_INTERVAL)

        return (): void => clearInterval(intervalId)
    }, [
        hiddenModes,
        hiddenRoutesMemo,
        hiddenStopModesMemo,
        hiddenStopsMemo,
        isDisabled,
        nearestStopPlaces,
        newStopsMemo,
    ])

    return stopPlacesWithDepartures
}
