import i18n from '@dhis2/d2-i18n'
import { CircularLoader, CenteredContent } from '@dhis2/ui'
import { capitalize } from 'lodash-es'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getItem, initNewItem } from '../actions'
import { USER_ROLE } from '../constants/entityTypes'
import RoleForm from '../containers/RoleForm'
import { shortItemSelector } from '../selectors'
import ErrorMessage from './ErrorMessage'
import styles from './FormLoader.module.css'

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
            'There was an error getting the form:',
            {
                nsSeparator: '-:-',
            }
        )
    }

    renderForm() {
        const { entityType } = this.props
        switch (entityType) {
            case USER_ROLE:
                return <RoleForm />
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

        return <h2 className={styles.heading}>{msg}</h2>
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
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            )
        }

        return this.renderForm()
    }

    render() {
        return (
            <main className={styles.container}>
                {this.renderHeader()}
                {this.renderContent()}
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
