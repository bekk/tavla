import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react'
import { useLocation } from 'react-router-dom'
import { LegMode, Coordinates } from '@entur/sdk'

import { useIsFirebaseInitialized } from '../firebase-init'
import {
    persist as persistToFirebase,
    restore as restoreFromFirebase,
    FieldValue,
} from './FirestoreStorage'
import {
    persist as persistToUrl,
    restore as restoreFromUrl,
} from './UrlStorage'

// Matches the ID in an URL, if it exists.
const ID_REGEX = /\/(?:t|(?:admin))\/(\w+)(?:\/)?/

export interface Settings {
    coordinates?: Coordinates
    hiddenStations: Array<string>
    hiddenStops: Array<string>
    hiddenModes: Array<LegMode>
    hiddenRoutes: {
        [stopPlaceId: string]: Array<string>
    }
    distance?: number
    newStations?: Array<string>
    newStops?: Array<string>
    dashboard?: string | void
}

interface SettingsSetters {
    setHiddenStations: (
        hiddenStations: Array<string>,
        options?: SetOptions,
    ) => void
    setHiddenStops: (hiddenStops: Array<string>, options?: SetOptions) => void
    setHiddenModes: (hiddenModes: Array<LegMode>, options?: SetOptions) => void
    setHiddenRoutes: (
        hiddenModes: { [stopPlaceId: string]: Array<string> },
        options?: SetOptions,
    ) => void
    setDistance: (distance: number, options?: SetOptions) => void
    setNewStations: (newStations: Array<string>, options?: SetOptions) => void
    setNewStops: (newStops: Array<string>, options?: SetOptions) => void
    setDashboard: (dashboard: string, options?: SetOptions) => void
}

interface SetOptions {
    persist?: boolean
}

type Persistor = () => void

export const SettingsContext = createContext<
    [Settings | undefined, SettingsSetters, Persistor]
>([
    undefined,
    {
        setHiddenStations: (): void => undefined,
        setHiddenStops: (): void => undefined,
        setHiddenModes: (): void => undefined,
        setHiddenRoutes: (): void => undefined,
        setDistance: (): void => undefined,
        setNewStations: (): void => undefined,
        setNewStops: (): void => undefined,
        setDashboard: (): void => undefined,
    },
    (): void => console.log('Persistor not set up yet'), // eslint-disable-line no-console
])

export function useSettingsContext(): [
    Settings | undefined,
    SettingsSetters,
    Persistor,
] {
    return useContext(SettingsContext)
}

const getDocumentId = (): string | undefined => {
    const id = window.location.pathname.match(ID_REGEX)

    if (id) {
        return id[1]
    }
}

export function useSettings(): [
    Settings | undefined,
    SettingsSetters,
    Persistor,
] {
    const [settings, setSettings] = useState<Settings | undefined>()

    const firebaseInitialized = useIsFirebaseInitialized()

    const location = useLocation()

    const documentId = getDocumentId()

    useEffect(() => {
        if (location.pathname == '/' || !firebaseInitialized) return

        async function loadSettings(): Promise<void> {
            if (documentId) {
                setSettings(await restoreFromFirebase(documentId))
                return
            }

            const positionArray = location.pathname
                .split('/')[2]
                .split('@')[1]
                .split('-')
                .join('.')
                .split(/,/)

            setSettings({
                ...restoreFromUrl(),
                coordinates: {
                    latitude: Number(positionArray[0]),
                    longitude: Number(positionArray[1]),
                },
            })
        }

        loadSettings()
    }, [firebaseInitialized, location, documentId])

    const persistSettings = useCallback(() => {
        if (!settings) return
        if (documentId) {
            persistToFirebase(documentId, settings)
        } else {
            persistToUrl(settings)
        }
    }, [settings, documentId])

    const set = useCallback(
        <T>(key: string, value: FieldValue, options?: SetOptions): void => {
            const newSettings = { ...settings, [key]: value } as Settings
            setSettings(newSettings)

            if (!options || !options.persist) return

            if (documentId) {
                persistToFirebase(documentId, newSettings)
                return
            }
            persistToUrl(newSettings)
        },
        [settings, documentId],
    )

    const setHiddenStations = useCallback(
        (newHiddenStations: Array<string>, options?: SetOptions): void => {
            set('hiddenStations', newHiddenStations, options)
        },
        [set],
    )

    const setHiddenStops = useCallback(
        (newHiddenStops: Array<string>, options?: SetOptions): void => {
            set('hiddenStops', newHiddenStops, options)
        },
        [set],
    )

    const setHiddenModes = useCallback(
        (newHiddenModes: Array<LegMode>, options?: SetOptions): void => {
            set('hiddenModes', newHiddenModes, options)
        },
        [set],
    )

    const setHiddenRoutes = useCallback(
        (
            newHiddenRoutes: { [stopPlaceId: string]: Array<string> },
            options?: SetOptions,
        ): void => {
            set('hiddenRoutes', newHiddenRoutes, options)
        },
        [set],
    )

    const setDistance = useCallback(
        (newDistance: number, options?: SetOptions): void => {
            set('distance', newDistance, options)
        },
        [set],
    )

    const setNewStations = useCallback(
        (newStations: Array<string>, options?: SetOptions): void => {
            set('newStations', newStations, options)
        },
        [set],
    )

    const setNewStops = useCallback(
        (newStops: Array<string>, options?: SetOptions): void => {
            set('newStops', newStops, options)
        },
        [set],
    )

    const setDashboard = useCallback(
        (dashboard: string, options?: SetOptions): void => {
            set('dashboard', dashboard, options)
        },
        [set],
    )

    const setters = {
        setHiddenStations,
        setHiddenStops,
        setHiddenModes,
        setHiddenRoutes,
        setDistance,
        setNewStations,
        setNewStops,
        setDashboard,
    }

    return [settings, setters, persistSettings]
}
