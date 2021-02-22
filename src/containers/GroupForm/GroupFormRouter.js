import React from 'react'
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom'
import i18n from '@dhis2/d2-i18n'
import GroupForm from './GroupForm.js'
import GroupUserManagement from './GroupUserManagement/index.js'
import styles from './GroupFormRouter.module.css'

export default function GroupFormRouter() {
    const {
        path,
        url,
        params: { id },
    } = useRouteMatch()
    const isCreatMode = !id

    if (isCreatMode) {
        return <GroupForm />
    }

    return (
        <>
            <nav className={styles.tabbar}>
                <NavLink exact className={styles.tab} to={url}>
                    {i18n.t('Group settings')}
                </NavLink>
                <NavLink exact className={styles.tab} to={`${url}/users`}>
                    {i18n.t('Users')}
                </NavLink>
            </nav>
            <div className={styles.content}>
                <Switch>
                    <Route exact path={path}>
                        <GroupForm />
                    </Route>
                    <Route exact path={`${path}/users`}>
                        <GroupUserManagement />
                    </Route>
                </Switch>
            </div>
        </>
    )
}
