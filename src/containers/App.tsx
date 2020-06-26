import React from 'react'
import { Route, Switch, Redirect, Router } from 'react-router-dom'
import analytics from 'universal-ga'

import { SettingsContext, useSettings } from '../settings'
import { useAnonymousLogin, UserProvider } from '../auth'
import initializeFirebase from '../firebase-init'

import Compact from '../dashboards/Compact'
import Chrono from '../dashboards/Chrono'
import Timeline from '../dashboards/Timeline'

import LandingPage from './LandingPage'
import Admin from './Admin'
import Privacy from './Privacy'

initializeFirebase()

analytics.initialize('UA-108877193-6')
analytics.set('anonymizeIp', true)

analytics.set('page', window.location.pathname)
analytics.pageview(window.location.pathname)

function getDashboardComponent(dashboardKey?: string | void) {
    switch (dashboardKey) {
        case 'Timeline':
            return Timeline
        case 'Chrono':
            return Chrono
        default:
            return Compact
    }
}

const App = ({ history }: Props): JSX.Element => {
    const user = useAnonymousLogin()
    const settings = useSettings()

    const Dashboard = settings[0] ? getDashboardComponent(settings[0].dashboard) : null

    return (
        <UserProvider value={user}>
            <SettingsContext.Provider value={settings}>
                <Router history={history}>
                    <Switch>
                        <Route exact path="/" component={LandingPage} />
                        <Route path="/dashboard" component={Dashboard} />
                        <Route path="/admin" component={Admin} />
                        <Route path="/privacy" component={Privacy} />
                        <Redirect to="/" />
                    </Switch>
                </Router>
            </SettingsContext.Provider>
        </UserProvider>
    )
}

interface Props {
    history: any
}

export default App
