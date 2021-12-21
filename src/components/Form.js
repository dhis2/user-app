import i18n from '@dhis2/d2-i18n'
import {
    ReactFinalForm,
    InputFieldFF,
    SingleSelectFieldFF,
    CheckboxFieldFF,
    ButtonStrip,
    Button,
    Required,
    Transfer,
    Help,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
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

const createChangeHandler = onChange => payload => {
    if (typeof payload === 'object' && payload.value) {
        onChange(payload.value)
    } else if (typeof payload === 'object' && payload.selected) {
        onChange(payload.selected)
    } else {
        onChange(payload)
    }
}

/* eslint-disable react/prop-types,no-unused-vars */
const SearchableOrgUnitTreeFF = ({
    input,
    meta,
    ...props
}) => {
    if (input.name === "organisationUnits") {
        console.log({
            value: input.value,
            active: meta.active,
            error: meta.error,
        })
    }

    const handleChange = useCallback(createChangeHandler(input.onChange), [
        input.onChange,
    ])
    return (
        <div>
            <SearchableOrgUnitTree {...props} error={meta.error} onChange={handleChange} onBlur={input.onBlur} />
            {meta.error && (
                <Help error>
                    {meta.error}
                </Help>
            )}
        </div>
    )
}
/* eslint-enable react/prop-types,no-unused-vars */


export const SearchableOrgUnitTreeField = ({ headerText, ...props }) => (
    <div>
        <ReactFinalForm.Field
            {...props}
            headerText={
                props.required ? (
                    <>
                        {headerText}
                        <Required dataTest="required" />
                    </>
                ) : (
                    headerText
                )
            }
            className={styles.field}
            component={SearchableOrgUnitTreeFF}
        />
    </div>
)

SearchableOrgUnitTreeField.propTypes = {
    headerText: PropTypes.node.isRequired,
    required: PropTypes.bool,
}

/* eslint-disable react/prop-types,no-unused-vars */
const TransferFF = ({
    input,
    meta,
    ...props
}) => <Transfer {...props} onChange={createChangeHandler(input.onChange)} />
/* eslint-enable react/prop-types,no-unused-vars */

export const TransferField = ({ leftHeader, rightHeader, ...props }) => (
    <ReactFinalForm.Field
        {...props}
        height="320px"
        leftHeader={
            <h3 className={styles.transferFieldHeader}>{leftHeader}</h3>
        }
        rightHeader={
            <h3 className={styles.transferFieldHeader}>{rightHeader}</h3>
        }
        filterable
        filterPlaceholder={i18n.t('Filter options')}
        className={styles.field}
        component={TransferFF}
    />
)

TransferField.propTypes = {
    leftHeader: PropTypes.string.isRequired,
    rightHeader: PropTypes.string.isRequired,
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
