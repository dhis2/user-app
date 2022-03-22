// TODO: delete file

import PropTypes from 'prop-types'
import React from 'react'
import DetailSummary from '../components/DetailSummary'
import { USER_GROUP } from '../constants/entityTypes'
import { getUserGroupDetails } from './detailFieldConfigs'

/** Renders a DetailSummary for a UserGroup instance
 * @class
 */
const GroupDetails = ({
    match: {
        params: { id },
    },
}) => (
    <DetailSummary
        routeId={id}
        config={getUserGroupDetails()}
        baseName={USER_GROUP}
    />
)

GroupDetails.propTypes = {
    match: PropTypes.object.isRequired,
}

export default GroupDetails
