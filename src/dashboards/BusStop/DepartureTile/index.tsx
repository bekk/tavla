import React, { useState, useEffect } from 'react'
import { colors } from '@entur/tokens'
import { Heading2, Heading3 } from '@entur/typography'
import {
    Table,
    TableBody,
    TableRow,
    DataCell,
    TableHead,
    HeaderCell,
} from '@entur/table'

import {
    getIcon,
    unique,
    getTransportIconIdentifier,
    createTileSubLabel,
    isNotNullOrUndefined,
    getIconColorType,
} from '../../../utils'
import {
    StopPlaceWithDepartures,
    LineData,
    IconColorType,
} from '../../../types'

import SubLabelIcon from '../components/SubLabelIcon'
import './styles.scss'
import { useSettingsContext } from '../../../settings'

function getTransportHeaderIcons(departures: LineData[]): JSX.Element[] {
    const transportModes = unique(
        departures.map(({ type, subType }) => ({ type, subType })),
        (a, b) =>
            getTransportIconIdentifier(a.type, a.subType) ===
            getTransportIconIdentifier(b.type, b.subType),
    )

    const transportIcons = transportModes.map(({ type, subType }) => ({
        icon: getIcon(type, undefined, subType, colors.blues.blue60),
    }))

    return transportIcons.map(({ icon }) => icon).filter(isNotNullOrUndefined)
}

const DepartureTile = ({ stopPlaceWithDepartures }: Props): JSX.Element => {
    const { departures } = stopPlaceWithDepartures
    const headerIcons = getTransportHeaderIcons(departures)
    const [settings] = useSettingsContext()
    const [iconColorType, setIconColorType] = useState<IconColorType>(
        IconColorType.CONTRAST,
    )

    useEffect(() => {
        if (settings) {
            setIconColorType(getIconColorType(settings.theme))
        }
    }, [settings])

    return (
        <div className="tile">
            <header className="tile__header">
                <Heading2>{stopPlaceWithDepartures.name}</Heading2>
                <div className="tile__header__icons">{headerIcons}</div>
            </header>
            <Table spacing="small" fixed>
                <col style={{ width: '3%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '5%' }} />
                <col style={{ width: '70%' }} />
                <TableHead>
                    <TableRow>
                        <HeaderCell> </HeaderCell>
                        <HeaderCell>Linje</HeaderCell>
                        <HeaderCell>Avgang</HeaderCell>
                        <HeaderCell>Avvik</HeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {departures.map((data) => (
                        <TableRow key={data.id}>
                            <DataCell>
                                <Heading3>
                                    <div>
                                        {getIcon(
                                            data.type,
                                            iconColorType,
                                            data.subType,
                                        )}
                                    </div>
                                </Heading3>
                            </DataCell>
                            <DataCell>
                                <Heading3>{data.route}</Heading3>
                            </DataCell>
                            <DataCell>{data.time}</DataCell>
                            <DataCell>
                                <SubLabelIcon
                                    subLabel={createTileSubLabel(data)}
                                />
                            </DataCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

interface Props {
    stopPlaceWithDepartures: StopPlaceWithDepartures
}

export default DepartureTile
