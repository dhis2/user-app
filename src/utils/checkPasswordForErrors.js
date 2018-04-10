import i18n from 'd2-i18n';

const checkPasswordForErrors = password => {
    const upperCase = /^(?=.*[A-Z]).+$/;
    const digit = /^(?=.*[0-9]).+$/;
    const specialChar = /[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/;

    if (password.length < 8) {
        return i18n.t('Password should be at least 8 characters long');
    }
    if (password.length > 35) {
        return i18n.t('Password should be no longer than 34 characters');
    }
    if (!upperCase.test(password)) {
        return i18n.t('Password should contain at least one UPPERCASE letter');
    }
    if (!digit.test(password)) {
        return i18n.t('Password should contain at least one number');
    }
    if (!specialChar.test(password)) {
        return i18n.t('Password should have at least one special character');
    }

    return null;
};

export default checkPasswordForErrors;
