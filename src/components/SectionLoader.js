import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
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
    componentWillMount() {
        const { initCurrentUser } = this.props;
        initCurrentUser();
    }

    userHasAuthorities({ entityType }) {
        if (!entityType) {
            return true;
        }
        const { currentUser, models } = this.context.d2;
        const canCreate = currentUser.canCreate(models[entityType]);
        const canDelete = currentUser.canDelete(models[entityType]);
        return canCreate || canDelete;
    }

    getRouteConfig() {
        return ROUTE_CONFIG.reduce(
            (routeConfig, configItem) => {
                let { routes, sections } = routeConfig;
                if (this.userHasAuthorities(configItem)) {
                    routes.push(configItem);
                    if (configItem.label) {
                        sections.push(configItem);
                    }
                }
                return routeConfig;
            },
            { routes: [], sections: [] }
        );
    }

    renderRoutes(routes) {
        return routes.map(section => <Route exact strict {...section} />);
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

SectionLoader.contextTypes = {
    d2: PropTypes.object,
};

SectionLoader.propTypes = {
    initCurrentUser: PropTypes.func.isRequired,
};

export default withRouter(
    connect(null, {
        initCurrentUser,
    })(SectionLoader)
);
