import React from 'react'

import Trikk from './../logos/trikk'
import Buss from './../logos/buss'

function TransportType(props: Props): JSX.Element | null {
    if (props.type === 'tram') {
        return <Trikk route={props.route} />
    } else if (props.type === 'bus') {
        return <Buss route={props.route} />
    }

    return null
}

interface Props {
    type: string
    route: string
}

export default TransportType
