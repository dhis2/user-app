import { USERNAME } from './config';
import {
    asyncValidateAttributeUniqueness,
    asyncValidateUsername,
} from '../../utils/validatorsAsync';

export function asyncValidatorSwitch(values, _, props, blurredField) {
    // Skip aSync validation when submitting the form because all fields have been
    // validated on blur anyway, and the server will reject them
    if (!blurredField) {
        return Promise.resolve({});
    }

    if (blurredField === USERNAME) {
        return asyncValidateUsername(values, _, props);
    }

    return asyncValidateAttributeUniqueness(values, _, props, blurredField);
}
