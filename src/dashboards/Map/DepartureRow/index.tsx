import React from 'react'
import { LineData, IconColorType } from '../../../types'
import { colors } from '@entur/tokens'

import './styles.scss'
import { getIcon, getIconColor } from '../../../utils'
import TravelTag from '../TravelTag'

const DepartureRow = (props: Props): JSX.Element => {
    const icon = getIcon(
        props.departure.type,
        undefined,
        props.departure.subType,
        colors.brand.white,
    )
    const color = getIconColor(
        props.departure.type,
        IconColorType.DEFAULT,
        props.departure.subType,
    )
    return (
        <div className="departure-row">
            <div className="departure-row__box">
                <TravelTag
                    icon={icon}
                    color={color}
                    departure={props.departure.route.split(/[\s]/g)[0]}
                />
            </div>
            <div className="departure-row__departure">
                {props.departure.expectedDepartureTime.substr(11, 5)}
            </div>
        </div>
    )
}

interface Props {
    departure: LineData
}

export default DepartureRow
