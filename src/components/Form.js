import i18n from '@dhis2/d2-i18n'
import {
    ReactFinalForm,
    InputFieldFF,
    SingleSelectFieldFF,
    CheckboxFieldFF,
    ButtonStrip,
    Button,
    Required,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './Form.module.css'
import SearchableOrgUnitTree from './SearchableOrgUnitTree'

export const FormSection = ({ title, children, description }) => (
    <section className={styles.section}>
        <h3 className={styles.sectionHeader}>{title}</h3>
        {description && (
            <p className={styles.sectionDescription}>{description}</p>
        )}
        {children}
    </section>
)

FormSection.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
}

export const TextField = props => (
    <ReactFinalForm.Field
        {...props}
        className={styles.textField}
        component={InputFieldFF}
    />
)

export const PasswordField = props => (
    <ReactFinalForm.Field
        {...props}
        className={styles.passwordField}
        component={InputFieldFF}
        type="password"
    />
)

export const SingleSelectField = props => (
    <ReactFinalForm.Field
        {...props}
        className={styles.singleSelectField}
        component={SingleSelectFieldFF}
    />
)

export const CheckboxField = props => (
    <ReactFinalForm.Field
        {...props}
        className={styles.field}
        component={CheckboxFieldFF}
        type="checkbox"
    />
)

export const SearchableOrgUnitTreeField = props => (
    <ReactFinalForm.Field
        {...props}
        headerText={
            props.required ? (
                <>
                    {props.headerText}
                    <Required />
                </>
            ) : (
                props.headerText
            )
        }
        className={styles.field}
        component={SearchableOrgUnitTree}
    />
)

SearchableOrgUnitTreeField.propTypes = {
    headerText: PropTypes.element,
    required: PropTypes.bool,
}

const Form = ({ children, submitButtonLabel, onSubmit, onCancel }) => (
    <ReactFinalForm.Form onSubmit={onSubmit}>
        {({ handleSubmit, valid, values, submitting }) => (
            <form className={styles.form} onSubmit={handleSubmit}>
                {children({ values })}
                <ButtonStrip>
                    <Button
                        primary
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!valid}
                        loading={submitting}
                    >
                        {submitButtonLabel}
                    </Button>
                    <Button onClick={onCancel} disabled={submitting}>
                        {i18n.t('Cancel without saving')}
                    </Button>
                </ButtonStrip>
            </form>
        )}
    </ReactFinalForm.Form>
)

Form.propTypes = {
    children: PropTypes.func.isRequired,
    submitButtonLabel: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export default Form
