import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import api from '../api';
import ROUTE_CONFIG from '../constants/routeConfig';
import SideNav from './SideNav';

const style = {
    marginTop: '4rem',
    display: 'flex',
    flex: '1 1 0%',
};

class SectionLoader extends Component {
    static contextTypes = {
        d2: PropTypes.object,
    };

    componentWillMount() {
        const { d2 } = this.context;
        api.init(d2);
    }

    getRouteConfig() {
        // TODO: Only return sections available to the currentUser
        return ROUTE_CONFIG.reduce(
            (routeConfig, configItem) => {
                let { routes, sections } = routeConfig;
                if (configItem.label) {
                    sections.push(configItem);
                }
                routes.push(configItem);
                return routeConfig;
            },
            { routes: [], sections: [] }
        );
    }

    renderRoutes(routes) {
        return routes.map(section => <Route {...section} />);
    }

    render() {
        const { routes, sections } = this.getRouteConfig();

        return (
            <main style={style}>
                <SideNav sections={sections} />
                <Switch>{this.renderRoutes(routes)}</Switch>
            </main>
        );
    }
}

export default SectionLoader;
