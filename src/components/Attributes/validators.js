import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    hasValue,
    composeValidators,
    email,
    number,
    integer,
    createNumberRange,
} from '@dhis2/ui'
import pDebounce from 'p-debounce'
import { useValidator } from '../../hooks/useValidator.js'

export const useDebouncedUniqueAttributeValidator = ({
    attribute,
    currentValue,
    entity,
    entityType,
}) => {
    const engine = useDataEngine()
    const findAllByAttributeValue = pDebounce(async (value) => {
        const filters = [
            `attributeValues.attribute.id:eq:${attribute.id}`,
            `attributeValues.value:eq:${value}`,
        ]
        const { entities } = await engine.query({
            entities: {
                resource: entityType,
                params: {
                    filter: entity
                        ? [`id:ne:${entity.id}`, ...filters]
                        : filters,
                    fields: ['id', 'attributeValues[value, attribute[id]]'],
                    paging: false,
                },
            },
        })

        // If entities are returned, this can still include records with the
        // SAME value on ANOTHER attribute. So we have to filter on the current
        // value and attributeId
        return entities[entityType].filter(({ attributeValues }) =>
            attributeValues.some(
                (attributeValue) =>
                    attributeValue.attribute.id === attribute.id &&
                    attributeValue.value === value
            )
        )
    }, 350)
    const validator = async (value) => {
        if (value === currentValue) {
            return
        }

        try {
            const entities = await findAllByAttributeValue(value)
            if (entities.length > 0) {
                return i18n.t(
                    'Attribute value needs to be unique, value already taken.'
                )
            }
        } catch (error) {
            return i18n.t(
                'There was a problem whilst checking the availability of this attribute value'
            )
        }
    }
    return useValidator(validator)
}

const validatorsMap = {
    hasValue,
    email,
    number,
    integer,
    positiveInteger: composeValidators(
        integer,
        createNumberRange(
            0,
            Infinity,
            i18n.t('Value should be a positive integer')
        )
    ),
    negativeInteger: composeValidators(
        integer,
        createNumberRange(
            -Infinity,
            0,
            i18n.t('Value should be a negative integer')
        )
    ),
}

export const validators = (validatorConditionals, uniqueValidator) => {
    const validators = []
    for (const [validatorKey, condition] of Object.entries(
        validatorConditionals
    )) {
        if (condition) {
            const validator =
                validatorKey === 'unique'
                    ? uniqueValidator
                    : validatorsMap[validatorKey]
            validators.push(validator)
        }
    }
    return composeValidators(...validators)
}
