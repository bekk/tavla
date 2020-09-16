import React from 'react'
import { LineData } from '../../../types'

import './styles.scss'
import TransportType from '../../../assets/icons/transportType'

const DepartureRow = (props: Props): JSX.Element => {
    return (
        <div className="departure-row">
            <div className="departure-row__icon">
                <TransportType
                    type={props.departure.type}
                    route={props.departure.route.split(/[\s]/g)[0]}
                ></TransportType>
            </div>
            <div>{props.departure.expectedDepartureTime.substr(11, 5)}</div>
        </div>
    )
}

interface Props {
    departure: LineData
}

export default DepartureRow
