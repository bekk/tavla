import React from 'react'

import Handle from '../logos/Handle.svg'

function ResizeHandle({ className, size }: Props): JSX.Element | null {
    return <img src={Handle} width={size} height={size} className={className} />
}

interface Props {
    className?: string
    size?: string
}

export default ResizeHandle
