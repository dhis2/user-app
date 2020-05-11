import React from 'react'
import PropTypes from 'prop-types'
import { USER } from '../constants/entityTypes'
import DetailSummary from '../components/DetailSummary'
import { getUserProfile } from '../constants/detailFieldConfigs'

/** Renders a DetailSummary for a User instance
 * @class
 */
const UserProfile = ({
    match: {
        params: { id },
    },
}) => <DetailSummary routeId={id} config={getUserProfile()} baseName={USER} />

UserProfile.propTypes = {
    match: PropTypes.object.isRequired,
}

export default UserProfile
