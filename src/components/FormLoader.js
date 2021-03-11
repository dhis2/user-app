import i18n from '@dhis2/d2-i18n'
import { Heading } from '@dhis2/d2-ui-core'
import capitalize from 'lodash.capitalize'
import kebabCase from 'lodash.kebabcase'
import { Paper, CircularProgress } from 'material-ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getItem, initNewItem } from '../actions'
import { USER, USER_GROUP, USER_ROLE } from '../constants/entityTypes'
import GroupForm from '../containers/GroupForm'
import RoleForm from '../containers/RoleForm'
import UserForm from '../containers/UserForm'
import { shortItemSelector } from '../selectors'
import ErrorMessage from './ErrorMessage'
import IconLink from './IconLink'

const styles = {
    main: {
        width: '100%',
        paddingLeft: '2rem',
    },
    heading: {
        paddingBottom: '1rem',
    },
    paper: {
        padding: '2rem 5rem 4rem',
    },
}

class FormLoader extends Component {
    componentDidMount() {
        const {
            match: {
                params: { id },
            },
            item,
            getItem,
            initNewItem,
            entityType,
        } = this.props
        if (id && !(item && item.id === id)) {
            getItem(entityType, id)
        } else if (!id) {
            initNewItem(entityType)
        }
        this.formNotFoundErrorMsg = i18n.t(
            'There was an error getting the form:'
        )
    }

    renderForm() {
        const { entityType } = this.props
        switch (entityType) {
            case USER:
                return <UserForm />
            case USER_ROLE:
                return <RoleForm />
            case USER_GROUP:
                return <GroupForm />
            default:
                return (
                    <ErrorMessage
                        introText={this.formNotFoundErrorMsg}
                        errorMessage={''}
                    />
                )
        }
    }

    renderHeader() {
        const {
            match: {
                params: { id },
            },
            item,
            shortItem,
            entityType,
        } = this.props
        const baseItem = item && item.id === id ? item : shortItem
        const entityTxt = baseItem
            ? baseItem.modelDefinition.displayName
            : capitalize(entityType)
        const displayName = baseItem ? baseItem.displayName : ''
        const updateMsg = `${i18n.t('Update')} ${entityTxt}: ${displayName}`
        const createMsg = `${i18n.t('Create new')} ${entityTxt}`
        const msg = id ? updateMsg : createMsg
        const link = baseItem
            ? `/${kebabCase(baseItem.modelDefinition.plural)}`
            : null
        const linkTooltip = `${i18n.t('Back to')} ${entityTxt}s`

        return (
            <Heading style={styles.heading}>
                <IconLink
                    to={link}
                    tooltip={linkTooltip}
                    disabled={Boolean(link)}
                    icon="arrow_back"
                />
                {msg}
            </Heading>
        )
    }

    renderContent() {
        const {
            match: {
                params: { id },
            },
            item,
        } = this.props

        if (typeof item === 'string') {
            return (
                <ErrorMessage
                    introText={this.formNotFoundErrorMsg}
                    errorMessage={item}
                />
            )
        }

        if (!item || (item && item.id !== id)) {
            return (
                <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
                    <CircularProgress />
                </div>
            )
        }

        return this.renderForm()
    }

    render() {
        return (
            <main style={styles.main}>
                {this.renderHeader()}
                <Paper style={styles.paper}>{this.renderContent()}</Paper>
            </main>
        )
    }
}

FormLoader.propTypes = {
    entityType: PropTypes.string.isRequired,
    getItem: PropTypes.func.isRequired,
    initNewItem: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    item: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    shortItem: PropTypes.object,
}

const mapStateToProps = (state, props) => {
    return {
        item: state.currentItem,
        // shortItem is available when navigating from a list but not after refesh
        shortItem: shortItemSelector(props.match.params.id, state.list.items),
    }
}

export default connect(mapStateToProps, {
    getItem,
    initNewItem,
})(FormLoader)
