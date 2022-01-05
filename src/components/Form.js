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
import React, { useState, useCallback } from 'react'
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

export const DateField = props => (
    <ReactFinalForm.Field
        {...props}
        className={styles.dateField}
        component={InputFieldFF}
        type="date"
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

const SearchableOrgUnitTreeFF = ({ input, meta, ...props }) => {
    const handleChange = useCallback(createChangeHandler(input.onChange), [
        input.onChange,
    ])
    const error = meta.touched && meta.invalid ? meta.error : undefined
    return (
        <div>
            <SearchableOrgUnitTree
                {...props}
                error={!!error}
                onChange={handleChange}
                onBlur={input.onBlur}
            />
            {error && <Help error>{error}</Help>}
        </div>
    )
}

SearchableOrgUnitTreeFF.propTypes = {
    input: PropTypes.shape({
        onBlur: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
        invalid: PropTypes.bool.isRequired,
        touched: PropTypes.bool.isRequired,
        error: PropTypes.string,
    }).isRequired,
}

export const SearchableOrgUnitTreeField = ({
    headerText,
    initialValue,
    ...props
}) => {
    // Fixes the infinite loop rendering bug that occurs when the
    // initial value fails shallow equal on form rerender.
    // Issue on GitHub: https://github.com/final-form/react-final-form/issues/686
    const [memoedInitialValue] = useState(initialValue)

    return (
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
                initialValue={memoedInitialValue}
                initiallySelected={initialValue}
            />
        </div>
    )
}

SearchableOrgUnitTreeField.propTypes = {
    headerText: PropTypes.node.isRequired,
    initialValue: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    required: PropTypes.bool,
}

// eslint-disable-next-line no-unused-vars
const TransferFF = ({ input, meta, ...props }) => (
    <Transfer
        {...props}
        selected={input.value}
        onChange={createChangeHandler(input.onChange)}
    />
)

TransferFF.propTypes = {
    input: PropTypes.shape({
        value: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        onChange: PropTypes.func.isRequired,
    }).isRequired,
    meta: PropTypes.object.isRequired,
}

export const TransferField = ({
    leftHeader,
    rightHeader,
    initialValue,
    ...props
}) => {
    // Fixes the infinite loop rendering bug that occurs when the
    // initial value fails shallow equal on form rerender.
    // Issue on GitHub: https://github.com/final-form/react-final-form/issues/686
    const [memoedInitialValue] = useState(initialValue)

    return (
        <ReactFinalForm.Field
            {...props}
            height="320px"
            leftHeader={
                <h3 className={styles.transferFieldHeader}>{leftHeader}</h3>
            }
            rightHeader={
                <h3 className={styles.transferFieldHeader}>
                    {props.required ? (
                        <>
                            {rightHeader}
                            <Required dataTest="required" />
                        </>
                    ) : (
                        rightHeader
                    )}
                </h3>
            }
            filterable
            filterPlaceholder={i18n.t('Filter options')}
            className={styles.field}
            component={TransferFF}
            initialValue={memoedInitialValue}
        />
    )
}

TransferField.propTypes = {
    initialValue: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    leftHeader: PropTypes.string.isRequired,
    rightHeader: PropTypes.string.isRequired,
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
