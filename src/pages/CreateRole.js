import i18n from '@dhis2/d2-i18n'
import React from 'react'
import RoleForm from '../components/RoleForm/index.js'

const CreateRole = () => (
    <>
        <h2>{i18n.t('New role')}</h2>
        <RoleForm submitButtonLabel={i18n.t('Create role')} />
    </>
)

export default CreateRole
