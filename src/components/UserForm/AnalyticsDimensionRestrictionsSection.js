import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { FormSection, TransferField } from '../Form.js'

const AnalyticsDimensionsRestrictionsSection = React.memo(
    ({ user, dimensionConstraintOptions }) => (
        <FormSection title={i18n.t('Analytics dimension restrictions')}>
            <TransferField
                name="dimensionConstraints"
                leftHeader={i18n.t('Available restrictions')}
                rightHeader={i18n.t('Selected restrictions')}
                options={dimensionConstraintOptions}
                initialValue={
                    user
                        ? []
                              .concat(
                                  user.cogsDimensionConstraints,
                                  user.catDimensionConstraints
                              )
                              .map(({ id }) => id)
                        : []
                }
            />
        </FormSection>
    )
)

AnalyticsDimensionsRestrictionsSection.propTypes = {
    dimensionConstraintOptions: PropTypes.array.isRequired,
    user: PropTypes.object,
}

export default AnalyticsDimensionsRestrictionsSection
