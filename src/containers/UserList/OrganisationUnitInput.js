import i18n from '@dhis2/d2-i18n'
import { InputField, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { showDialog, hideDialog } from '../../actions'
import { orgUnitsAsStringSelector } from '../../selectors'
import OrganisationUnitFilter from './OrganisationUnitFilter'

/**
 * Part of the UserFilter. This component renders the displayNames of the organisation units that have been set in the filter state.
 * If 3 or more units are selected in the filter, only the length of this array will be displayed.
 */
class OrganisationUnitInput extends Component {
    showOrgTreeInDialog = () => {
        const { showDialog, hideDialog } = this.props
        const content = <OrganisationUnitFilter />
        const props = {
            onRequestClose: hideDialog,
            title: i18n.t('Select an organisation unit'),
            contentStyle: {
                // This doesn't actually influence the height of the dialogue
                // but it will force it upwards, enabling it to have more height
                // The actual height is determined by a scrollbox inside the filter component
                minHeight: '100vh',
            },
        }
        showDialog(content, props)
    }

    render() {
        return (
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <InputField
                    label={i18n.t('Organisation unit')}
                    value={this.props.selectedOrganisationUnit}
                    dense
                    disabled
                />
                <Button onClick={this.showOrgTreeInDialog}>
                    {i18n.t('Select organisation unit')}
                </Button>
            </div>
        )
    }
}

OrganisationUnitInput.propTypes = {
    hideDialog: PropTypes.func.isRequired,
    selectedOrganisationUnit: PropTypes.string.isRequired,
    showDialog: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    selectedOrganisationUnit: orgUnitsAsStringSelector(
        state.filter.organisationUnits
    ),
})

export default connect(mapStateToProps, {
    showDialog,
    hideDialog,
})(OrganisationUnitInput)
