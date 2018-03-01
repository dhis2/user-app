import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import api from '../api';
import { initCurrentUser } from '../actions';
import ROUTE_CONFIG from '../constants/routeConfig';
import SideNav from './SideNav';

const style = {
    marginTop: '4rem',
    display: 'flex',
    flex: '1 1 0%',
    paddingRight: '2rem',
};

class SectionLoader extends Component {
    static contextTypes = {
        d2: PropTypes.object,
    };

    static propTypes = {
        initCurrentUser: PropTypes.func.isRequired,
    };

    componentWillMount() {
        const { d2 } = this.context;
        const { initCurrentUser } = this.props;
        api.init(d2);
        initCurrentUser();
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

export default withRouter(
    connect(null, {
        initCurrentUser,
    })(SectionLoader)
);
