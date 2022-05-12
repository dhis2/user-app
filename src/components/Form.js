import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    CircularLoader,
    NoticeBox,
    ReactFinalForm,
    InputFieldFF,
    TextAreaFieldFF,
    SingleSelectFieldFF,
    CheckboxFieldFF,
    ButtonStrip,
    Button,
    Required,
    Transfer,
    Help,
    IconErrorFilled24,
    theme,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
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

const InputFieldFFWrapper = (props) => {
    // `meta.validating` is true for all fields when an async validator is used
    // so only show spinner if input field is currently focused
    const validating = props.meta.active && props.meta.validating

    return <InputFieldFF {...props} loading={props.loading || validating} />
}

InputFieldFFWrapper.propTypes = {
    loading: PropTypes.bool,
    meta: PropTypes.object,
}

export const TextField = (props) => (
    <ReactFinalForm.Field
        {...props}
        className={styles.textField}
        component={InputFieldFFWrapper}
    />
)

export const EmailField = (props) => (
    <ReactFinalForm.Field
        {...props}
        className={styles.textField}
        component={InputFieldFF}
        type="email"
    />
)

export const PasswordField = (props) => (
    <ReactFinalForm.Field
        {...props}
        className={styles.passwordField}
        component={InputFieldFF}
        type="password"
    />
)

export const DateField = (props) => (
    <ReactFinalForm.Field
        {...props}
        className={styles.dateField}
        component={InputFieldFF}
        type="date"
    />
)

export const TextAreaField = (props) => (
    <ReactFinalForm.Field
        {...props}
        className={styles.textField}
        component={TextAreaFieldFF}
    />
)

export const SingleSelectField = (props) => (
    <ReactFinalForm.Field
        {...props}
        className={styles.singleSelectField}
        component={SingleSelectFieldFF}
    />
)

export const CheckboxField = (props) => (
    <ReactFinalForm.Field
        {...props}
        className={styles.field}
        component={CheckboxFieldFF}
        type="checkbox"
    />
)

const SearchableOrgUnitTreeFF = ({ input, meta, ...props }) => {
    const error = meta.touched && meta.invalid ? meta.error : undefined

    return (
        <div>
            <SearchableOrgUnitTree
                {...props}
                error={!!error}
                onChange={input.onChange}
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
    const [memoedInitialValue] = useState(initialValue.map((ou) => ou.id))

    return (
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
    )
}

SearchableOrgUnitTreeField.propTypes = {
    headerText: PropTypes.node.isRequired,
    initialValue: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
    required: PropTypes.bool,
}

const MemoedTransfer = React.memo(Transfer)

const TransferFF = ({ input, meta, className, ...props }) => {
    const handleChange = useCallback(
        ({ selected }) => {
            input.onChange(selected)
            input.onBlur()
        },
        [input.onChange, input.onBlur]
    )
    const error = meta.touched && meta.invalid ? meta.error : undefined

    return (
        <div>
            <div className={styles.flexCenter}>
                <div
                    className={cx(className, {
                        [styles.transferWrapperError]: error,
                    })}
                >
                    <MemoedTransfer
                        {...props}
                        selected={input.value}
                        onChange={handleChange}
                    />
                </div>
                {error && (
                    <div className={styles.errorIcon}>
                        <IconErrorFilled24 color={theme.error} />
                    </div>
                )}
            </div>
            {error && <Help error>{error}</Help>}
        </div>
    )
}

TransferFF.propTypes = {
    input: PropTypes.shape({
        value: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        onBlur: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
    }).isRequired,
    meta: PropTypes.object.isRequired,
    className: PropTypes.string,
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
    const memoedLeftHeader = useMemo(
        () => <h3 className={styles.transferFieldHeader}>{leftHeader}</h3>,
        [leftHeader]
    )
    const memoedRightHeader = useMemo(
        () => (
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
        ),
        [rightHeader, props.required]
    )

    return (
        <ReactFinalForm.Field
            {...props}
            height="320px"
            leftHeader={memoedLeftHeader}
            rightHeader={memoedRightHeader}
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

const Form = ({ loading, error, children, submitButtonLabel, onSubmit }) => {
    const history = useHistory()
    const handleCancel = () => history.goBack()

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (error) {
        return (
            <NoticeBox
                error
                title={i18n.t('Error fetching form')}
                className={styles.errorNoticeBox}
            >
                {i18n.t('There was an error fetching this form.')}
            </NoticeBox>
        )
    }

    return (
        <ReactFinalForm.Form onSubmit={onSubmit}>
            {({
                handleSubmit,
                hasValidationErrors,
                pristine,
                values,
                submitting,
                submitError,
                validating,
            }) => (
                <form className={styles.form} onSubmit={handleSubmit}>
                    {children({ values, submitError })}
                    <ButtonStrip>
                        <Button
                            primary
                            type="submit"
                            onClick={handleSubmit}
                            disabled={
                                validating || hasValidationErrors || pristine
                            }
                            loading={submitting}
                        >
                            {submitButtonLabel}
                        </Button>
                        <Button onClick={handleCancel} disabled={submitting}>
                            {i18n.t('Cancel without saving')}
                        </Button>
                    </ButtonStrip>
                </form>
            )}
        </ReactFinalForm.Form>
    )
}

Form.propTypes = {
    children: PropTypes.func.isRequired,
    submitButtonLabel: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error),
    loading: PropTypes.bool,
}

export default Form
