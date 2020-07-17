import React, { ChangeEvent } from 'react'

import { Checkbox, TravelSwitch, TravelSwitchProps } from '@entur/form'
import { ExpandablePanel } from '@entur/expand'
import { LegMode } from '@entur/sdk'

import { unique, getIcon, getIconColorType } from '../../../../../utils'
import { Settings } from '../../../../../settings'
import { StopPlaceWithLines } from '../../../../../types'

const PanelRow = ({
    onToggleStop,
    onToggleMode,
    onToggleRoute,
    settings,
    stopPlace,
}: Props): JSX.Element => {
    const iconColorType = getIconColorType(settings.theme) || 'contrast'

    const { id, lines, name } = stopPlace

    const visibleLines = lines.filter(
        (line) => !settings.hiddenStopModes[id]?.includes(line.transportMode),
    )

    const uniqueModes = unique(lines.map(({ transportMode }) => transportMode))

    const header = (
        <div className="stop-place-panel__row__header">
            <Checkbox
                id={id}
                className="stop-place-panel__row__checkbox"
                checked={!settings.hiddenStops.includes(id)}
                onChange={onToggleStop}
            />
            <span>{name}</span>
            <span onClick={(event) => event.stopPropagation()}>
                {uniqueModes.map((mode) => (
                    <TravelSwitch
                        key={mode}
                        transport={mode as TravelSwitchProps['transport']}
                        size="large"
                        onChange={(): void => {
                            onToggleMode(id, mode)
                        }}
                        checked={!settings.hiddenStopModes[id]?.includes(mode)}
                    />
                ))}
            </span>
        </div>
    )

    if (!visibleLines.length) {
        return (
            <div
                key={id}
                className="stop-place-panel__row stop-place-panel__row__empty"
            >
                {header}
            </div>
        )
    }

    return (
        <div key={id} className="stop-place-panel__row">
            <ExpandablePanel
                className="stop-place-panel__row__expandable"
                title={header}
            >
                {visibleLines.map(
                    ({ name: routeName, transportMode, transportSubmode }) => {
                        const routeId = `${id}-${routeName}`
                        const icon = getIcon(
                            transportMode,
                            iconColorType,
                            transportSubmode,
                        )

                        return (
                            <Checkbox
                                key={`checkbox-${routeId}`}
                                id={`checkbox-${routeId}`}
                                className="stop-place-panel__route"
                                name={routeName}
                                onChange={(): void =>
                                    onToggleRoute(id, routeName)
                                }
                                checked={
                                    !settings.hiddenRoutes[id]?.includes(
                                        routeName,
                                    )
                                }
                            >
                                {icon}
                                {routeName}
                            </Checkbox>
                        )
                    },
                )}
            </ExpandablePanel>
        </div>
    )
}

interface Props {
    onToggleMode: (id: string, mode: LegMode) => void
    onToggleRoute: (id: string, routeName: string) => void
    onToggleStop: (event: ChangeEvent<HTMLInputElement>) => void
    stopPlace: StopPlaceWithLines
    settings: Settings
}

export default PanelRow
