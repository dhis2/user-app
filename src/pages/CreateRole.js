import i18n from '@dhis2/d2-i18n'
import React from 'react'
import PageHeader from '../components/PageHeader.js'
import RoleForm from '../components/RoleForm/index.js'

const CreateRole = () => (
    <>
        <PageHeader>{i18n.t('New role')}</PageHeader>
        <RoleForm submitButtonLabel={i18n.t('Create role')} />
    </>
)

export default CreateRole
