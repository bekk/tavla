import React from 'react'
import { StopPlaceWithDepartures, IconColorType } from '../../../../types'

import './styles.scss'
import { getIcon, getIconColor } from '../../../../utils'
import TravelTag from '../../TravelTag'
import { colors } from '@entur/tokens'
import { Heading4 } from '@entur/typography'

const Tile = (props: Props): JSX.Element => {
    return (
        <div className="departure-tile">
            <Heading4
                className="departure-tile__stop"
                style={{ color: colors.brand.blue }}
            >
                {props.stopPlace.name}
            </Heading4>
            <div>
                {props.stopPlace.departures.slice(0, 2).map((departure) => (
                    <div className="departure-row" key={departure.id}>
                        <TravelTag
                            icon={getIcon(
                                departure.type,
                                undefined,
                                departure.subType,
                                colors.brand.white,
                            )}
                            color={getIconColor(
                                departure.type,
                                IconColorType.DEFAULT,
                                departure.subType,
                            )}
                            departure={departure.route.split(/[\s]/g)[0]}
                        />
                        <div className="departure-row__direction">
                            {departure.route.split(/([\s])/g).slice(1)}
                        </div>
                        <div className="departure-row__time">
                            {departure.expectedDepartureTime.substr(11, 5)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

interface Props {
    stopPlace: StopPlaceWithDepartures
}
export default Tile
