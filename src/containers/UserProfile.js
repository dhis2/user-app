import PropTypes from 'prop-types'
import React from 'react'
import DetailSummary from '../components/DetailSummary'
import { USER } from '../constants/entityTypes'
import { getUserProfile } from './detailFieldConfigs'

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
