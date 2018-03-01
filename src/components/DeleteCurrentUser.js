import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { Paper } from 'material-ui';
import Heading from 'd2-ui/lib/headings/Heading.component';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import api from '../api';
import { checkPasswordForErrors } from '../utils/';
import { showDialog } from '../actions';

const FORM_NAME = 'deleteCurrentUserForm';
const USERNAME = 'username';
const PASSWORD = 'password';
const COUNTDOWN_TIME = 5;

const styles = {
    main: {
        width: '100%',
    },
    paper: {
        padding: '1.4rem',
    },
    heading: {
        paddingBottom: '1rem',
    },
};

const validate = (values, props) => {
    let errors = {};
    const passwordError = values[PASSWORD] && checkPasswordForErrors(values[PASSWORD]);
    if (passwordError) {
        errors[PASSWORD] = passwordError;
    }
    return errors;
};

class CountDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countDownTime: COUNTDOWN_TIME,
        };
        this.updateCountDownTime = this.updateCountDownTime.bind(this);
    }

    componentDidMount() {
        this.countDownInterval = setInterval(this.updateCountDownTime, 1000);
    }

    updateCountDownTime() {
        const { countDownTime } = this.state;
        const remainingTime = countDownTime - 1;

        this.setState({ countDownTime: remainingTime });

        if (remainingTime === 0) {
            clearInterval(this.countDownInterval);
            window.location.reload(true);
        }
    }

    render() {
        const { countDownTime } = this.state;
        const message = i18next.t(
            'Current user was sucessfully removed. You will be redirected to the login screen in {{countDownTime}} seconds.',
            { countDownTime }
        );
        return <p>{message}</p>;
    }
}

class DeleteCurrentUser extends Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        showDialog: PropTypes.func.isRequired,
        valid: PropTypes.bool.isRequired,
        pristine: PropTypes.bool.isRequired,
        submitting: PropTypes.bool.isRequired,
        userId: PropTypes.string.isRequired,
        initialValues: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.submitDeleteRequest = this.submitDeleteRequest.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.showCountDownDialog = this.showCountDownDialog.bind(this);
    }

    submitDeleteRequest = values => {
        return api
            .verifyPassword(values[PASSWORD])
            .then(({ isCorrectPassword }) => {
                if (!isCorrectPassword) {
                    throw new SubmissionError({
                        [PASSWORD]: i18next.t('Incorrect password provided'),
                        _error: 'WRONG CREDENTIALS',
                    });
                } else {
                    this.removeUser();
                }
            })
            .catch(error => {
                if (error instanceof SubmissionError) {
                    // Catch block triggered by working api call but incorrect password
                    throw error;
                } else {
                    // Server problem
                    throw new SubmissionError({
                        [PASSWORD]: i18next.t(
                            'There was a problem verifying your password.'
                        ),
                        _error: error,
                    });
                }
            });
    };

    removeUser() {
        const { userId } = this.props;
        api
            .deleteUser(userId)
            .then(() => this.showCountDownDialog)
            .catch(this.showDeletionErrorSnackBar);
    }

    showCountDownDialog() {
        const { showDialog } = this.props;
        const content = <CountDown />;
        const props = {
            onRequestClose: () => {},
            title: i18next.t('Removing current user'),
        };
        showDialog(content, props);
    }

    render() {
        const { handleSubmit, valid, pristine, submitting } = this.props;
        return (
            <main style={styles.main}>
                <Heading style={styles.heading}>
                    {i18next.t('Delete Current User')} id: {this.props.userId}
                </Heading>
                <Paper style={styles.paper}>
                    <form onSubmit={handleSubmit(this.submitDeleteRequest)}>
                        <Field
                            name={USERNAME}
                            component={TextField}
                            floatingLabelText={i18next.t('Username')}
                            hintText={i18next.t('Username for current user')}
                            fullWidth={true}
                            disabled={true}
                        />
                        <Field
                            name={PASSWORD}
                            component={TextField}
                            floatingLabelText={i18next.t('Password')}
                            hintText={i18next.t('Password for current user')}
                            fullWidth={true}
                            type="password"
                        />
                        <div style={{ marginTop: 16 }}>
                            <RaisedButton
                                label={i18next.t('Delete')}
                                type="submit"
                                primary={true}
                                disabled={!valid || pristine || submitting}
                            />
                        </div>
                    </form>
                </Paper>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    userId: state.currentUser.id,
    initialValues: {
        [USERNAME]: state.currentUser.username,
        [PASSWORD]: null,
    },
});

const ReduxFormWrapped = reduxForm({
    form: FORM_NAME,
    validate,
})(DeleteCurrentUser);

export default connect(mapStateToProps, {
    showDialog,
})(ReduxFormWrapped);
