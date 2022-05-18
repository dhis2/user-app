import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import pDebounce from 'p-debounce'
import { useValidator } from '../../hooks/useValidator.js'

const DEBOUNCE_DELAY_MS = 350

export const useDebouncedUniqueGroupNameValidator = ({
    groupName: currentGroupName,
}) => {
    const engine = useDataEngine()
    const findGroupByName = pDebounce(async (groupName) => {
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
    const validator = async (groupName) => {
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
    return useValidator(validator)
}

export const useDebouncedUniqueGroupCodeValidator = ({
    groupCode: currentGroupCode,
}) => {
    const engine = useDataEngine()
    const findGroupByCode = pDebounce(async (groupCode) => {
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
    const validator = async (groupCode) => {
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
    return useValidator(validator)
}
