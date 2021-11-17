import React, { useEffect } from 'react'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import { ReactFinalForm, InputFieldFF, SingleSelectFieldFF, composeValidators, hasValue, email, ButtonStrip, Button } from '@dhis2/ui'
import { useHistory } from 'react-router-dom'

const UserForm = ({
    submitButtonLabel,
    onSubmit,
    user,
    interfaceLanguages,
    userInterfaceLanguage,
    databaseLanguages,
    userDatabaseLanguage
}) => {
    const history = useHistory()

    return (
        <ReactFinalForm.Form onSubmit={onSubmit}>
            {({ handleSubmit, valid, values, submitting }) => (
                <form onSubmit={handleSubmit}>
                    <h3>{i18n.t('Basic information')}</h3>
                    <ReactFinalForm.Field
                        required
                        name="username"
                        label={i18n.t('Username')}
                        component={InputFieldFF}
                        initialValue={user?.displayName}
                        validate={hasValue}
                    />
                    <ReactFinalForm.Field
                        name="email"
                        label={i18n.t('Email address')}
                        component={InputFieldFF}
                        initialValue={user?.email}
                        validate={composeValidators(hasValue, email)}
                    />
                    <ReactFinalForm.Field
                        required
                        name="firstName"
                        label={i18n.t('First name')}
                        component={InputFieldFF}
                        initialValue={user?.firstName}
                        validate={hasValue}
                    />
                    <ReactFinalForm.Field
                        required
                        name="surname"
                        label={i18n.t('Last name')}
                        component={InputFieldFF}
                        initialValue={user?.surname}
                        validate={hasValue}
                    />
                    <ReactFinalForm.Field
                        required
                        name="interfaceLanguage"
                        label={i18n.t('Interface language')}
                        component={SingleSelectFieldFF}
                        initialValue={userInterfaceLanguage}
                        options={interfaceLanguages.map(({ name, locale }) => ({
                            label: name,
                            value: locale,
                        }))}
                        validate={hasValue}
                    />
                    <ReactFinalForm.Field
                        required
                        name="databaseLanguage"
                        label={i18n.t('Database language')}
                        component={SingleSelectFieldFF}
                        initialValue={userDatabaseLanguage}
                        options={(
                            [
                                { label: i18n.t('Use database locale / no translation'), value: 'USE_DB_LOCALE' },
                                ...databaseLanguages.map(({ name, locale }) => ({
                                    label: name,
                                    value: locale,
                                }))
                            ]
                        )}
                        validate={hasValue}
                    />
                    <ButtonStrip>
                        <Button primary type="submit" onClick={handleSubmit}>
                            {submitButtonLabel}
                        </Button>
                        <Button onClick={() => history.push('/users')}>
                            {i18n.t('Cancel without saving')}
                        </Button>
                    </ButtonStrip>
                </form>
            )}
        </ReactFinalForm.Form>
    )
}

const localesPropType = PropTypes.arrayOf(PropTypes.shape({
    locale: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
}).isRequired)

UserForm.propTypes = {
    databaseLanguages: localesPropType.isRequired,
    interfaceLanguages: localesPropType.isRequired,
    submitButtonLabel: PropTypes.string.isRequired,
    userInterfaceLanguage: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    user: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        // id: PropTypes.string.isRequired,
    }),
    userDatabaseLanguage: PropTypes.string,
}

export default UserForm
