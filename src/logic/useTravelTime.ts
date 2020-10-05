import { useState, useEffect } from 'react'
import { isEqual } from 'lodash'
import service from '../service'
import { TripPattern, Coordinates } from '@entur/sdk'
import { useSettingsContext } from '../settings'
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
                        },
                        modes: ['foot'],
                    },
                    undefined,
                ),
        ),
    )
    return travelTimes
}

export default function useTravelTime(
    stopPlaces: StopPlaceWithDepartures[] | null,
): TripPattern[][] | null {
    const [settings] = useSettingsContext()
    const [travelTime, setTravelTime] = useState<TripPattern[][] | null>(null)

    const {
        latitude: fromLatitude,
        longitude: fromLongitude,
    } = settings?.coordinates ?? {
        latitude: 0,
        longitude: 0,
    }

    const ids = stopPlaces?.map((stopPlace) => stopPlace.id)
    const previousIds = usePrevious(ids)
    useEffect(() => {
        if (stopPlaces === null) {
            return setTravelTime(null)
        }
        if (!isEqual(ids, previousIds)) {
            fetchTravelTime(stopPlaces, {
                latitude: fromLatitude,
                longitude: fromLongitude,
            }).then(setTravelTime)
        }
    }, [fromLatitude, fromLongitude, ids, previousIds, stopPlaces])

    return travelTime
}
