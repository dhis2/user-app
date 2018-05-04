import React from 'react';
import PropTypes from 'prop-types';
import { USER_ROLE } from '../constants/entityTypes';
import DetailSummary from '../components/DetailSummary';
import { USER_ROLE_DETAILS } from '../constants/detailFieldConfigs';

/** Renders a DetailSummary for a UserRole instance
 * @class
 */
const RoleDetails = ({
    match: {
        params: { id },
    },
}) => <DetailSummary routeId={id} config={USER_ROLE_DETAILS} baseName={USER_ROLE} />;

RoleDetails.propTypes = {
    match: PropTypes.object.isRequired,
};

export default RoleDetails;
