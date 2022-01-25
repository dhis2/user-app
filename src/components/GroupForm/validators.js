import i18n from '@dhis2/d2-i18n'
import pDebounce from 'p-debounce'
import { useCallback } from 'react'

export const useDebouncedUniqueGroupNameValidator = ({ engine, groupName }) => {
    const currentGroupName = groupName
    const validator = async groupName => {
        if (groupName === currentGroupName) {
            return
        }

        try {
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
            if (groups.length > 0) {
                return i18n.t('Name is already taken')
            }
        } catch (error) {
            return i18n.t(
                'There was a problem whilst checking the availability of this group name'
            )
        }
    }
    const debouncedValidator = pDebounce(validator, 350)
    return useCallback(debouncedValidator, [])
}
