import React from 'react'
import { colors } from '@entur/tokens'
import { BicycleIcon, ParkIcon } from '@entur/icons'

import './styles.scss'

const BicycleTag = ({ bikes, spaces }: Props): JSX.Element => {
    return (
        <div className="bicycle-tag">
            <div className="bicycle-tag__bikes">
                <div className="bicycle-tag__bikes__icon">
                    <BicycleIcon
                        key="bike-tile-icon"
                        color={colors.brand.white}
                    />
                </div>
                <div>{bikes}</div>
            </div>
            <div className="bicycle-tag__spaces">
                <div className="bicycle-tag__bikes__icon">
                    <ParkIcon
                        key="space-tile-icon"
                        color={colors.brand.white}
                    />
                </div>
                <div>{spaces}</div>
            </div>
        </div>
    )
}

interface Props {
    bikes: number
    spaces: number
}

export default BicycleTag
