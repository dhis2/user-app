import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
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

const userHasAuthorities = ({ entity, currentUser, d2 }) => {
    const { entityType } = entity
    if (!entityType) {
        return true
    }

    const { models } = d2
    const canCreate = currentUser.canCreate(models[entityType])
    const canDelete = currentUser.canDelete(models[entityType])
    return canCreate || canDelete
}

const SectionLoader = ({
    initCurrentUser,
    currentUser,
    location: { pathname },
}) => {
    const { d2 } = useD2()

    useEffect(() => {
        if (!currentUser) {
            initCurrentUser()
        }
    }, [])

    useEffect(() => {
        if (!currentUser || typeof currentUser === 'string') {
            return
        }

        // Navigate home if the current user has edited a setting that restricts
        // them from an active section (i.e. adjusting their own user role so
        // they cannot edit user roles anymore)
        if (pathname !== '/' && !pathHasAvailableSection(pathname)) {
            navigateTo('/')
        }
    }, [currentUser, pathname])

    // Only show menu items for which the user has either the "add" or "delete" authority
    const routeConfig =
        typeof currentUser === 'string' || currentUser === null
            ? null
            : getRouteConfig().reduce(
                  (routeConfig, configItem) => {
                      const { routes, sections } = routeConfig
                      if (
                          userHasAuthorities({
                              entity: configItem,
                              currentUser,
                              d2,
                          })
                      ) {
                          routes.push(configItem)
                          if (configItem.label) {
                              sections.push(configItem)
                          }
                      }
                      return routeConfig
                  },
                  { routes: [], sections: [] }
              )
    const pathHasAvailableSection = pathname => {
        if (!routeConfig) {
            return false
        }

        return routeConfig.sections.some(section =>
            pathname.includes(section.path.split(':')[0])
        )
    }

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
                title={i18n.t('There was an error loading the current user')}
                className={styles.noticeBox}
            >
                {errorMessage}
            </NoticeBox>
        )
    }

    const { routes, sections } = routeConfig

    if (sections && sections.length === 0) {
        return (
            <NoticeBox
                error
                title={i18n.t(
                    'You do not have authorities to see users, user roles or user groups'
                )}
                className={styles.noticeBox}
            ></NoticeBox>
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
