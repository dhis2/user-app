import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, withRouter } from 'react-router-dom'
import { initCurrentUser } from '../actions'
import getRouteConfig from '../constants/routeConfig'
import navigateTo from '../utils/navigateTo'
import styles from './SectionLoader.module.css'
import SideNav from './SideNav'

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

        // In case of error `currentUser` is a string containing the error message
        if (typeof currentUser === 'string') {
            return false
        }

        const { models } = this.context.d2
        const canCreate = currentUser.canCreate(models[entityType])
        const canDelete = currentUser.canDelete(models[entityType])
        return canCreate || canDelete
    }

    render() {
        const { currentUser } = this.props

        if (!currentUser) {
            return (
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            )
        }

        if (typeof currentUser === 'string') {
            const errorMessage = currentUser
            return (
                <NoticeBox
                    error
                    title={i18n.t(
                        'There was an error loading the current user'
                    )}
                    className={styles.noticeBox}
                >
                    {errorMessage}
                </NoticeBox>
            )
        }

        const { routes, sections } = this.routeConfig

        if (sections && sections.length === 0) {
            return (
                <NoticeBox
                    error
                    title={i18n.t(
                        'You do not have authorities to see users, user roles or user groups'
                    )}
                    className={styles.noticeBox}
                >
                </NoticeBox>
            )
        }

        return (
            <main className={styles.container}>
                <SideNav key="sidenav" sections={sections} />
                <div className={styles.content}>
                    <Switch key="routeswitch">
                        {routes.map(section => (
                            <Route key={section.key} exact strict {...section} />
                        ))}
                    </Switch>
                </div>
            </main>
        )
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
