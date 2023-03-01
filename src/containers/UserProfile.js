import { useTimeZoneConversion } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import DetailSummary from '../components/DetailSummary'
import { getUserProfile } from '../constants/detailFieldConfigs'
import { USER } from '../constants/entityTypes'

/** Renders a DetailSummary for a User instance
 * @class
 */
const UserProfile = ({
    match: {
        params: { id },
    },
}) => {
    const { fromServerDate } = useTimeZoneConversion()
    return (
        <DetailSummary
            routeId={id}
            config={getUserProfile()}
            baseName={USER}
            fromServerDate={fromServerDate}
        />
    )
}

UserProfile.propTypes = {
    match: PropTypes.object.isRequired,
}

export default UserProfile
