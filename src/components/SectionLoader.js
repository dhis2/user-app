import i18n from '@dhis2/d2-i18n'
import { LoadingMask } from '@dhis2/d2-ui-core'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, withRouter } from 'react-router-dom'
import { initCurrentUser } from '../actions'
import getRouteConfig from '../constants/routeConfig'
import navigateTo from '../utils/navigateTo'
import ErrorMessage from './ErrorMessage'
import SideNav from './SideNav'

const styles = {
    container: {
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        height: '100%',
    },
    content: {
        padding: 16,
    },
}

/**
 * This component prepares the user-app sections and routes based on the current user's authorities
 * The sections will be rendered in the SideNav and the routes within a react-router Switch component
 */
class SectionLoader extends Component {
    componentDidMount() {
        const { initCurrentUser, currentUser } = this.props
        if (!currentUser) {
            initCurrentUser()
        } else {
            this.setRouteConfig(currentUser)
        }
    }

    componentWillReceiveProps({ currentUser, location: { pathname } }) {
        this.setRouteConfig(currentUser)

        // Navigate home if the current user has edited a setting that restricts
        // him from an active section. I.e. adjusting his own user role
        // so he cannot edit user roles anymore
        if (
            currentUser &&
            currentUser !== this.props.currentUser &&
            pathname !== '/' &&
            !this.pathHasAvailableSection(pathname)
        ) {
            navigateTo('/')
        }
    }

    pathHasAvailableSection(pathname) {
        if (!this.routeConfig) {
            return false
        }

        const { sections } = this.routeConfig
        return Boolean(
            sections &&
                sections.find(section =>
                    pathname.includes(section.path.split(':')[0])
                )
        )
    }

    setRouteConfig(currentUser) {
        // Only show menu items for which the user has either the "add" or "delete" authority
        this.routeConfig = !currentUser
            ? null
            : getRouteConfig().reduce(
                  (routeConfig, configItem) => {
                      const { routes, sections } = routeConfig
                      if (this.userHasAuthorities(configItem, currentUser)) {
                          routes.push(configItem)
                          if (configItem.label) {
                              sections.push(configItem)
                          }
                      }
                      return routeConfig
                  },
                  { routes: [], sections: [] }
              )
    }

    userHasAuthorities({ entityType }, currentUser) {
        if (!entityType) {
            return true
        }
        const { models } = this.context.d2
        const canCreate = currentUser.canCreate(models[entityType])
        const canDelete = currentUser.canDelete(models[entityType])
        return canCreate || canDelete
    }

    renderRoutes(routes) {
        return routes.map(section => (
            <Route key={section.key} exact strict {...section} />
        ))
    }

    renderContent() {
        const { currentUser } = this.props

        if (!currentUser) {
            return <LoadingMask />
        }

        if (typeof currentUser === 'string') {
            const introText = i18n.t(
                'There was an error loading the current user'
            )
            return (
                <ErrorMessage
                    introText={introText}
                    errorMessage={currentUser}
                />
            )
        }

        const { routes, sections } = this.routeConfig

        if (sections && sections.length === 0) {
            const introText = i18n.t(
                'You do not have authorities to see users, user roles or user groups'
            )
            return <ErrorMessage introText={introText} errorMessage="" />
        }

        return (
            <>
                <SideNav key="sidenav" sections={sections} />
                <div style={styles.content}>
                    <Switch key="routeswitch">
                        {this.renderRoutes(routes)}
                    </Switch>
                </div>
            </>
        )
    }

    render() {
        return <main style={styles.container}>{this.renderContent()}</main>
    }
}

SectionLoader.contextTypes = {
    d2: PropTypes.object,
}

SectionLoader.propTypes = {
    initCurrentUser: PropTypes.func.isRequired,
    currentUser: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    location: PropTypes.shape({ pathname: PropTypes.string }),
}

const mapStateToProps = ({ currentUser }) => ({ currentUser })

export default withRouter(
    connect(mapStateToProps, {
        initCurrentUser,
    })(SectionLoader)
)
