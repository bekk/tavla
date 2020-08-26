import { useState, useEffect, useMemo } from 'react'
import { ScooterOperator, Scooter } from '@entur/sdk'

import service from '../service'
import { useSettingsContext, Settings } from '../settings'
import { REFRESH_INTERVAL } from '../constants'

import useNearestPlaces from './useNearestPlaces'

function countScootersByOperator(
    list: Scooter[] | null,
): Record<ScooterOperator, Scooter[]> {
    const operators: Record<ScooterOperator, Scooter[]> = {
        voi: [],
        tier: [],
        lime: [],
        zvipp: [],
    }
    list?.map((scooter) => operators[scooter.operator].push(scooter))
    return operators
}

async function fetchScooters(settings: Settings): Promise<Scooter[] | null> {
    const { coordinates, distance, hiddenModes } = settings

    if (hiddenModes.includes('bysykkel')) {
        return null
    }

    let scooters: Scooter[] = []

    if (coordinates) {
        scooters = await service.getScootersByPosition({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            distance,
            limit: 50,
            //operators: ['TIER', 'VOI'], // Use the ScooterOperator enum if using TypeScript
        })
    }

    return scooters
}

export default function useScooters(): Record<
    ScooterOperator,
    Scooter[]
> | null {
    const [settings] = useSettingsContext()
    const [scooters, setScooters] = useState<Scooter[] | null>(null)
    const nearestPlaces = useNearestPlaces(
        settings?.coordinates,
        settings?.distance,
    )

    // const nearestBikeRentalStations = useMemo(
    //     () =>
    //         nearestPlaces
    //             .filter(({ type }) => type === 'BikeRentalStation')
    //             .map(({ id }) => id),
    //     [nearestPlaces],
    // )

    useEffect(() => {
        if (!settings) return
        fetchScooters(settings).then(setScooters)
        const intervalId = setInterval(() => {
            fetchScooters(settings).then(setScooters)
        }, REFRESH_INTERVAL)

        return (): void => clearInterval(intervalId)
    }, [scooters, settings])

    return countScootersByOperator(scooters)
}
