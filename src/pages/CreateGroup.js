import i18n from '@dhis2/d2-i18n'
import React from 'react'
import GroupForm from '../components/GroupForm/index.js'
import PageHeader from '../components/PageHeader.js'

const CreateGroup = () => (
    <>
        <PageHeader>{i18n.t('New group')}</PageHeader>
        <GroupForm submitButtonLabel={i18n.t('Create group')} />
    </>
)

export default CreateGroup
