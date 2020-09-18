import React from 'react'

import Trikk from './../logos/trikk'
import Buss from './../logos/buss'
import Metro from './../logos/tbane'
import Tog from './../logos/tog'

function TransportType(props: Props): JSX.Element | null {
    if (props.type === 'tram') {
        return <Trikk route={props.route} />
    } else if (props.type === 'bus') {
        return <Buss route={props.route} />
    } else if (props.type === 'rail') {
        return <Tog route={props.route}></Tog>
    } else if (props.type === 'metro') {
        return <Metro route={props.route}></Metro>
    }

    return null
}

interface Props {
    type: string
    route: string
}

export default TransportType
