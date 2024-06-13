import i18n from '@dhis2/d2-i18n'
import { composeValidators, hasValue, dhis2Password } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import {
    FormSection,
    CheckboxField,
    PasswordField,
    TextField,
    DateField,
} from '../Form.js'
import styles from './UserForm.module.css'
import { createRepeatPasswordValidator } from './validators.js'

const SecuritySection = React.memo(
    ({ user, inviteUser, externalAuth, changePassword, password }) => {
        if (inviteUser === 'INVITE_USER') {
            return null
        }

        return (
            <FormSection
                title={i18n.t('Security')}
                description={i18n.t('Settings for how this user can log in.')}
            >
                {!externalAuth && (
                    <>
                        {user && (
                            <CheckboxField
                                name="changePassword"
                                label={i18n.t('Change user password')}
                                initialValue={false}
                            />
                        )}
                        <div
                            className={
                                user ? styles.indentedPasswordFields : undefined
                            }
                        >
                            <PasswordField
                                required={!user}
                                name="password"
                                disabled={user && !changePassword}
                                label={
                                    user
                                        ? i18n.t('New password')
                                        : i18n.t('Password')
                                }
                                helpText={i18n.t(
                                    'Password should be at least 8 characters long, with at least one lowercase character, one uppercase character and one special character.'
                                )}
                                initialValue=""
                                autoComplete="new-password"
                                validate={
                                    user && !changePassword
                                        ? dhis2Password
                                        : composeValidators(
                                              hasValue,
                                              dhis2Password
                                          )
                                }
                            />
                            <PasswordField
                                required={!user}
                                name="repeatPassword"
                                disabled={user && !changePassword}
                                label={
                                    user
                                        ? i18n.t('Repeat new password')
                                        : i18n.t('Repeat password')
                                }
                                initialValue=""
                                autoComplete="new-password"
                                validate={
                                    user && !changePassword
                                        ? createRepeatPasswordValidator(
                                              password
                                          )
                                        : composeValidators(
                                              hasValue,
                                              createRepeatPasswordValidator(
                                                  password
                                              )
                                          )
                                }
                            />
                        </div>
                    </>
                )}
                <DateField
                    name="accountExpiry"
                    label={i18n.t('Account expiration date')}
                    initialValue={
                        user?.accountExpiry &&
                        moment(user.accountExpiry).format('YYYY-MM-DD')
                    }
                />
                <TextField
                    name="openId"
                    label={i18n.t('OIDC mapping value')}
                    helpText={i18n.t(
                        'OpenID Connect mapping claim for your identity platform'
                    )}
                    initialValue={user?.openId}
                    autoComplete="off"
                />
                <TextField
                    name="ldapId"
                    label={i18n.t('LDAP identifier')}
                    initialValue={user?.ldapId}
                    autoComplete="off"
                />
                <CheckboxField
                    name="externalAuth"
                    label={i18n.t(
                        'External authentication only (OpenID / LDAP)'
                    )}
                    initialValue={user?.externalAuth}
                />
            </FormSection>
        )
    }
)

SecuritySection.propTypes = {
    changePassword: PropTypes.bool,
    externalAuth: PropTypes.bool,
    inviteUser: PropTypes.string,
    password: PropTypes.string,
    user: PropTypes.object,
}

export default SecuritySection
