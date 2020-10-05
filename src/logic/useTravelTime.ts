import { useState, useEffect, useMemo, useCallback } from 'react'
import { isEqual } from 'lodash'
import service from '../service'
import { TripPattern, Coordinates } from '@entur/sdk'
import { useSettingsContext } from '../settings'
import useStopPlacesWithDepartures from './useStopPlacesWithDepartures'
import { StopPlaceWithDepartures } from '../types'
import { usePrevious } from '../utils'

async function fetchTravelTime(
    stopPlaces: StopPlaceWithDepartures[],
    from: Coordinates,
): Promise<TripPattern[][]> {
    const travelTimes = Promise.all(
        stopPlaces.map(
            async (stopPlace) =>
                await service.getTripPatterns(
                    {
                        from: {
                            name: 'pin',
                            coordinates: from,
                        },
                        to: {
                            name: stopPlace.name,
                            place: stopPlace.id,
                            coordinates: {
                                latitude: stopPlace.latitude ?? 0,
                                longitude: stopPlace.longitude ?? 0,
                            },
                        },
                        modes: ['foot'],
                    },
                    undefined,
                ),
        ),
    )
    console.log('traveltime fetch is called')
    return travelTimes
}

export default function useTravelTime(): TripPattern[][] | null {
    const [settings] = useSettingsContext()
    const [travelTime, setTravelTime] = useState<TripPattern[][] | null>(null)

    const {
        latitude: fromLatitude,
        longitude: fromLongitude,
    } = settings?.coordinates ?? {
        latitude: 0,
        longitude: 0,
    }

    const stopPlacesWithDepartures = useStopPlacesWithDepartures()
    const names = stopPlacesWithDepartures?.map((stopPlace) => stopPlace.name)
    const previousNames = usePrevious(names)
    useEffect(() => {
        if (stopPlacesWithDepartures === null) {
            return setTravelTime(null)
        }
        if (!isEqual(names, previousNames)) {
            fetchTravelTime(stopPlacesWithDepartures, {
                latitude: fromLatitude,
                longitude: fromLongitude,
            }).then(setTravelTime)
        }
    }, [
        fromLatitude,
        fromLongitude,
        names,
        previousNames,
        stopPlacesWithDepartures,
    ])

    return travelTime
}
