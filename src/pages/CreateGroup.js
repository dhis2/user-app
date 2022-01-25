import i18n from '@dhis2/d2-i18n'
import React from 'react'
import GroupForm from '../components/GroupForm/index.js'

const CreateGroup = () => (
    <>
        <h2>{i18n.t('New group')}</h2>
        <GroupForm submitButtonLabel={i18n.t('Create group')} />
    </>
)

export default CreateGroup
