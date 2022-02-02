import i18n from '@dhis2/d2-i18n'
import { memoize } from 'lodash-es'
import pDebounce from 'p-debounce'
import { useCallback } from 'react'

const DEBOUNCE_DELAY_MS = 350

export const useDebouncedUniqueGroupNameValidator = ({
    engine,
    groupName: currentGroupName,
}) => {
    const findGroupByName = pDebounce(async groupName => {
        const {
            groups: { userGroups: groups },
        } = await engine.query({
            groups: {
                resource: 'userGroups',
                params: {
                    filter: `name:eq:${groupName}`,
                    fields: 'id',
                },
            },
        })
        return groups[0]
    }, DEBOUNCE_DELAY_MS)
    const validator = async groupName => {
        if (groupName === currentGroupName) {
            return
        }

        try {
            const group = await findGroupByName(groupName)
            if (group) {
                return i18n.t('Name is already taken')
            }
        } catch (error) {
            return i18n.t(
                'There was a problem whilst checking the availability of this group name'
            )
        }
    }
    // Memoize validator as react final form reruns all validators when any field changes
    // See https://github.com/final-form/react-final-form/issues/292
    return useCallback(memoize(validator), [])
}

export const useDebouncedUniqueGroupCodeValidator = ({
    engine,
    groupCode: currentGroupCode,
}) => {
    const findGroupByCode = pDebounce(async groupCode => {
        const {
            groups: { userGroups: groups },
        } = await engine.query({
            groups: {
                resource: 'userGroups',
                params: {
                    filter: `code:eq:${groupCode}`,
                    fields: 'id',
                },
            },
        })
        return groups[0]
    }, DEBOUNCE_DELAY_MS)
    const validator = async groupCode => {
        if (!groupCode || groupCode === currentGroupCode) {
            return
        }

        try {
            const group = await findGroupByCode(groupCode)
            if (group) {
                return i18n.t('Code is already taken')
            }
        } catch (error) {
            return i18n.t(
                'There was a problem whilst checking the availability of this group code'
            )
        }
    }
    // Memoize validator as react final form reruns all validators when any field changes
    // See https://github.com/final-form/react-final-form/issues/292
    return useCallback(memoize(validator), [])
}
