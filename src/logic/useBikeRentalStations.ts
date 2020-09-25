import { useState, useEffect, useMemo } from 'react'
import { isEqual } from 'lodash'
import { BikeRentalStation } from '@entur/sdk'
import { usePrevious } from '../utils'

import service from '../service'
import { useSettingsContext } from '../settings'
import { REFRESH_INTERVAL } from '../constants'

import useNearestPlaces from './useNearestPlaces'
import { isNotNullOrUndefined } from '../utils'

async function fetchBikeRentalStations(
    allStationIds: string[],
): Promise<BikeRentalStation[] | null> {
    // const allStationIds = [...newStations, ...nearestBikeRentalStations]
    //     .filter((id) => !hiddenStations.includes(id))
    //     .filter((id, index, ids) => ids.indexOf(id) === index)

    const allStations = await service.getBikeRentalStations(allStationIds)
    console.log('Bikerentalstations fetch blir kjørt')
    return allStations.filter(isNotNullOrUndefined)
}

export default function useBikeRentalStations(): BikeRentalStation[] | null {
    const [settings] = useSettingsContext()
    const [bikeRentalStations, setBikeRentalStations] = useState<
        BikeRentalStation[] | null
    >(null)
    const nearestPlaces = useNearestPlaces(
        settings?.coordinates,
        settings?.distance,
    )

    const { newStations, hiddenStations, hiddenModes } = settings || {}

    const nearestBikeRentalStations = useMemo(
        () =>
            nearestPlaces
                .filter(({ type }) => type === 'BikeRentalStation')
                .map(({ id }) => id),
        [nearestPlaces],
    )

    const allStationIds = [...newStations, ...nearestBikeRentalStations]
        .filter((id) => !hiddenStations?.includes(id))
        .filter((id, index, ids) => ids.indexOf(id) === index)

    const prevStationIds = usePrevious(allStationIds)

    const isDisabled = Boolean(hiddenModes?.includes('bysykkel'))

    const isChanged = Boolean(isEqual(allStationIds, prevStationIds))
    useEffect(() => {
        console.log('isDisabled', isDisabled)
        console.log('isChanged', isChanged)
        if (isDisabled) {
            console.log('Bikes are set to null')
            return setBikeRentalStations(null)
        }
        if (!isChanged) {
            console.log('Er ikke likens')
            fetchBikeRentalStations(allStationIds).then(setBikeRentalStations)
        }
        const intervalId = setInterval(() => {
            fetchBikeRentalStations(allStationIds).then(setBikeRentalStations)
        }, REFRESH_INTERVAL)
        return (): void => clearInterval(intervalId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isChanged, isDisabled])

    return bikeRentalStations
}
