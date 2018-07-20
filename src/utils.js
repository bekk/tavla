import React from 'react'
import EnturService from '@entur/sdk'
import moment from 'moment'
import {
    Bus, CityBike, Ferry, Lock, Metro, Train, Tram,
} from './assets/icons'

const service = new EnturService({ clientName: 'entur-tavla' })

export function getIcon(type, props) {
    switch (type) {
        case 'bus':
            return <Bus {...props} />
        case 'bike':
            return <CityBike {...props} />
        case 'ferry':
            return <Ferry {...props} />
        case 'metro':
            return <Metro {...props} />
        case 'rail':
            return <Train {...props} />
        case 'tram':
            return <Tram {...props} />
        case 'lock':
            return <Lock {...props} />
        default:
            return null
    }
}

export function getPositionFromUrl() {
    const positionArray = window.location.pathname.split('/')[2].split('@')[1].split('-').join('.').split(/,/)
    return { latitude: positionArray[0], longitude: positionArray[1] }
}

export function getSettingsFromUrl() {
    const settings = window.location.pathname.split('/')[3]
    return (settings !== '') ? JSON.parse(atob(settings)) : {
        hiddenStations: [], hiddenStops: [], hiddenRoutes: [], distance: 500,
    }
}

export function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property]
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(obj)
        return acc
    }, {})
}

export function isVisible(groupedDepartures, hiddenRoutes) {
    const tileKeys = Object.keys(groupedDepartures)
    const visibleRoutes = tileKeys.filter((route) => !hiddenRoutes.includes(route))
    return visibleRoutes.length > 0
}

export function formatDeparture(minDiff, departureTime) {
    if (minDiff > 15) return departureTime.format('HH:mm')
    return minDiff < 1 ? 'nå' : minDiff.toString() + ' min'
}

function getUniqueRoutes(routes) {
    const uniqueThings = {}
    routes.forEach(({ route, type }) => {
        uniqueThings[route] = type
    })
    return Object.entries(uniqueThings).map(([route, type]) => ({ route, type }))
}

export function getStopsWithUniqueStopPlaceDepartures(stops) {
    return Promise.all(stops.map((stop) => service.getStopPlaceDepartures(stop.id, { onForBoarding: true, departures: 50 }).then(departures => {
        const lineData = departures.map(departure => {
            const { expectedDepartureTime, destinationDisplay, serviceJourney } = departure
            const { line } = serviceJourney.journeyPattern
            const departureTime = moment(expectedDepartureTime)
            const minDiff = departureTime.diff(moment(), 'minutes')

            return {
                type: line.transportMode,
                time: formatDeparture(minDiff, departureTime),
                route: line.publicCode + ' '+ destinationDisplay.frontText,
            }
        })
        return {
            ...stop,
            departures: getUniqueRoutes(lineData),
        }
    })))
}
