import React from 'react'
import { colors } from '@entur/tokens'
import { getIcon, getIconColor } from '../../../utils'

import './styles.scss'
import { IconColorType, StopPlaceWithDepartures } from '../../../types'
import { TripPattern } from '@entur/sdk'

const StopPlaceTag = ({ stopPlace, travelTimes }: Props): JSX.Element => {
    const uniqueTypes = [
        ...new Set(stopPlace.departures.map((departure) => departure.type)),
    ]

    const icons = uniqueTypes.map((type) => ({
        icon: getIcon(type, undefined, undefined, colors.brand.white),
        color: getIconColor(type, IconColorType.DEFAULT, undefined),
    }))

    const travelTimeForStopPlace =
        travelTimes?.filter(
            (tripPattern) =>
                (tripPattern[0].legs[0]
                    ? tripPattern[0].legs[0].toPlace?.name
                    : '') === stopPlace.name,
        ) ?? []

    return (
        <div className="stopplace-tag">
            <div className="stopplace-tag__icon-row">
                {icons.map((icon, i) => (
                    <div
                        key={i}
                        className="stopplace-tag__icon-row__icon"
                        style={{ backgroundColor: icon.color }}
                    >
                        {icon.icon}
                    </div>
                ))}
            </div>
            <div className="stopplace-tag__stopplace">{stopPlace.name}</div>
            <div className="stopplace-tag__walking-distance">
                {travelTimeForStopPlace[0]
                    ? `${Math.ceil(
                          (travelTimeForStopPlace[0][0].duration ?? 0) / 60,
                      )} min å gå`
                    : ''}
            </div>
        </div>
    )
}

interface Props {
    stopPlace: StopPlaceWithDepartures
    travelTimes: TripPattern[][] | null
}

export default StopPlaceTag
