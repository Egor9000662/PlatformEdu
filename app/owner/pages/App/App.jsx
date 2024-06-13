import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import TabbedPane from '../../components/TabbedPane/TabbedPane';
import Home from '../Home/HomePage';
import SchoolForm from '../SchoolForm/SchoolForm';

export default function AppOwner() {
    let location = useLocation();
    const tabNeeded = ['/schools', '/school-form'];
    return (
        <>
            <Switch>
                <Route exact path="/schools">
                    <Home />
                </Route>
                <Route exact path="/school-form">
                    <SchoolForm />
                </Route>
                <Redirect to="/schools" />
            </Switch>
            <div
                className={
                    tabNeeded.some((path) => path === location.pathname)
                        ? 'lowerSide'
                        : 'none'
                }
            >
                <TabbedPane
                    paths={[
                        '/schools',
                        '/school-form',
                    ]}
                />
            </div>
        </>
    );
}
