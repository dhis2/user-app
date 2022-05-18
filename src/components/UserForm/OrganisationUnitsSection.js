import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    FormSection,
    SearchableOrgUnitTreeField,
    SingleSelectField,
} from '../Form.js'
import styles from './UserForm.module.css'
import { hasSelectionValidator } from './validators.js'

const OrganisationUnitsSection = React.memo(
    ({ user, filledOrganisationUnitLevels }) => (
        <FormSection
            title={i18n.t('Organisation unit access')}
            description={i18n.t(
                'Customise the organisation units this user has access to for searching, capturing and managing data.'
            )}
        >
            <NoticeBox
                title={i18n.t('Organisation unit selections are recursive')}
                className={styles.organisationUnitsNoticeBox}
            >
                {i18n.t(
                    'Selecting a unit gives access to all units in its sub-hierarchy.'
                )}
            </NoticeBox>
            <SearchableOrgUnitTreeField
                required
                name="organisationUnits"
                orgUnitType="organisationUnits"
                headerText={i18n.t('Data capture and maintenance')}
                description={i18n.t(
                    'The organisation units that this user can enter and edit data for.'
                )}
                initialValue={user?.organisationUnits || []}
                validate={hasSelectionValidator}
            />
            <SearchableOrgUnitTreeField
                name="dataViewOrganisationUnits"
                orgUnitType="dataViewOrganisationUnits"
                headerText={i18n.t('Data output and analysis')}
                description={i18n.t(
                    'The organisation units that this user can export and analyse.'
                )}
                initialValue={user?.dataViewOrganisationUnits || []}
            />
            <SearchableOrgUnitTreeField
                name="teiSearchOrganisationUnits"
                orgUnitType="teiSearchOrganisationUnits"
                headerText={i18n.t('Search')}
                description={i18n.t(
                    'The organisation that this user can search for and in.'
                )}
                initialValue={user?.teiSearchOrganisationUnits || []}
            />
            <SingleSelectField
                name="dataViewMaxOrganisationUnitLevel"
                label={i18n.t(
                    'Maximum organisation unit level for data output'
                )}
                initialValue={user?.dataViewMaxOrganisationUnitLevel?.toString()}
                filterable
                clearable
                options={filledOrganisationUnitLevels.map(
                    ({ displayName, level }) => ({
                        label: displayName,
                        value: level.toString(),
                    })
                )}
            />
        </FormSection>
    )
)

OrganisationUnitsSection.propTypes = {
    filledOrganisationUnitLevels: PropTypes.arrayOf(
        PropTypes.shape({
            displayName: PropTypes.string.isRequired,
            level: PropTypes.number.isRequired,
        }).isRequired
    ).isRequired,
    user: PropTypes.object,
}

export default OrganisationUnitsSection
