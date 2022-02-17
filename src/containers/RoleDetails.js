import PropTypes from 'prop-types'
import React from 'react'
import DetailSummary from '../components/DetailSummary'
import { USER_ROLE } from '../constants/entityTypes'
import { getUserRoleDetails } from './detailFieldConfigs'

/** Renders a DetailSummary for a UserRole instance
 * @class
 */
const RoleDetails = ({
    match: {
        params: { id },
    },
}) => (
    <DetailSummary
        routeId={id}
        config={getUserRoleDetails()}
        baseName={USER_ROLE}
    />
)

RoleDetails.propTypes = {
    match: PropTypes.object.isRequired,
}

export default RoleDetails
