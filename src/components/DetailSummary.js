import i18n from '@dhis2/d2-i18n'
import { LoadingMask, Heading } from '@dhis2/d2-ui-core'
import capitalize from 'lodash.capitalize'
import kebabCase from 'lodash.kebabcase'
import { Paper } from 'material-ui'
import RaisedButton from 'material-ui/RaisedButton'
import ContentSend from 'material-ui/svg-icons/content/send'
import ImageEdit from 'material-ui/svg-icons/image/edit'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getItem } from '../actions'
import api from '../api'
import { USER, USER_GROUP, USER_ROLE } from '../constants/entityTypes'
import parseDateFromUTCString from '../utils/parseDateFromUTCString'
import ErrorMessage from './ErrorMessage'

const styles = {
    main: {
        width: '100%',
        paddingLeft: '2rem',
    },
    heading: {
        paddingBottom: '1rem',
    },
    raisedButton: {
        height: '36px',
        transform: 'translateY(10px)',
        float: 'right',
        marginLeft: '1rem',
    },
    paper: {
        padding: '1.4rem',
    },
    cell: {
        fontSize: '1rem',
        padding: '0.8rem',
        verticalAlign: 'top',
    },
    valueCell: {
        textAlign: 'right',
        color: '#757575',
    },
}
/**
 * This component reads specified properties of an object and displays this in a table
 */
class DetailSummary extends Component {
    componentDidMount() {
        const { baseName, routeId, getItem } = this.props
        getItem(baseName, routeId)
    }

    getLabelForEntity(baseName) {
        switch (baseName) {
            case USER:
                return i18n.t('Edit user')
            case USER_GROUP:
                return i18n.t('Edit user group')
            case USER_ROLE:
                return i18n.t('Edit user role')
            default:
                return ''
        }
    }

    /**
     * Renders a button wrapped in a link.
     * The link points to a location outside of the user-app where a message can be sent to a user with a given id.
     * @param {string} userId
     */
    renderSendMessageBtn(userId) {
        const url = `${api.getContextPath()}/dhis-web-messaging/#/PRIVATE/create/${userId}`
        return (
            <RaisedButton
                style={styles.raisedButton}
                label={i18n.t('Send message')}
                secondary={true}
                containerElement={<a href={url}> </a>}
                icon={<ContentSend />}
            />
        )
    }

    renderPropertyFields() {
        const { summaryObject, config } = this.props
        const labelCellStyle = { ...styles.cell, ...styles.valueCell }

        return config.map((field, index) => {
            const {
                key,
                removeText,
                parseDate,
                parseDateTime,
                nestedPropselector,
                parseArrayAsCommaDelimitedString,
                count,
            } = field
            let { label } = field

            // TODO: Handle label translation properly
            label = i18n.t(label)
            let value = summaryObject[key]

            if (typeof value === 'undefined') {
                value = ''
            } else {
                if (nestedPropselector) {
                    nestedPropselector.forEach(selector => {
                        value = value[selector]
                    })
                }

                if (parseArrayAsCommaDelimitedString) {
                    // Some nested lists come through as a modelCollection but others are already arrays
                    if (typeof value.toArray === 'function') {
                        value = value.toArray()
                    }
                    value = value
                        .map(item => item[parseArrayAsCommaDelimitedString])
                        .join(', ')
                }

                if (removeText) {
                    value = capitalize(value.replace(removeText, ''))
                }

                if ((parseDate || parseDateTime) && typeof value === 'string') {
                    value = parseDateFromUTCString(value, parseDateTime)
                }

                if (count) {
                    if (typeof value.size === 'number') {
                        value = value.size
                    } else if (typeof value.length === 'number') {
                        value = value.length
                    }
                }
            }

            return (
                <tr key={index}>
                    <td style={labelCellStyle}>{label}</td>
                    <td style={styles.cell}>{value}</td>
                </tr>
            )
        })
    }

    render() {
        const { summaryObject, baseName } = this.props

        if (summaryObject === null) {
            return <LoadingMask />
        }

        if (typeof summaryObject === 'string') {
            // TODO: use interpolation correctly
            const errorText = i18n.t(
                `There was an error fetching the ${baseName}`
            )
            return (
                <ErrorMessage
                    introText={errorText}
                    errorMessage={summaryObject}
                />
            )
        }

        const { id, displayName, access } = summaryObject
        const plural = `${baseName}s`,
            baseRoute = `/${kebabCase(plural)}`,
            editLink = `${baseRoute}/edit/${id}`,
            editLabel = this.getLabelForEntity(baseName)

        return (
            <main style={styles.main}>
                <Heading style={styles.heading}>
                    {displayName}

                    {access.update ? (
                        <RaisedButton
                            style={styles.raisedButton}
                            label={editLabel}
                            primary={true}
                            containerElement={<Link to={editLink} />}
                            icon={<ImageEdit />}
                        />
                    ) : null}

                    {baseName === USER ? this.renderSendMessageBtn(id) : null}
                </Heading>
                <Paper style={styles.paper}>
                    <table>
                        <tbody>{this.renderPropertyFields()}</tbody>
                    </table>
                </Paper>
            </main>
        )
    }
}

DetailSummary.propTypes = {
    baseName: PropTypes.string.isRequired,
    config: PropTypes.array.isRequired,
    getItem: PropTypes.func.isRequired,
    routeId: PropTypes.string.isRequired,
    summaryObject: PropTypes.object,
}

const mapStateToProps = state => ({
    summaryObject: state.currentItem,
})

export default connect(mapStateToProps, {
    getItem,
})(DetailSummary)
