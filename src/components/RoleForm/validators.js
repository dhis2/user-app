import i18n from '@dhis2/d2-i18n'
import memoizeOne from 'memoize-one'
import pDebounce from 'p-debounce'
import { useCallback } from 'react'

export const useDebouncedUniqueRoleNameValidator = ({
    engine,
    roleName: currentRoleName,
}) => {
    const findRolebyName = pDebounce(async roleName => {
        const {
            roles: { userRoles: roles },
        } = await engine.query({
            roles: {
                resource: 'userRoles',
                params: {
                    filter: `name:eq:${roleName}`,
                    fields: 'id',
                },
            },
        })
        console.log({ roleName, roles })
        return roles[0]
    }, 350)
    const validator = async roleName => {
        if (roleName === currentRoleName) {
            return
        }

        try {
            const role = await findRolebyName(roleName)
            if (role) {
                return i18n.t('Name is already taken')
            }
        } catch (error) {
            return i18n.t(
                'There was a problem whilst checking the availability of this role name'
            )
        }
    }
    // Memoize validator as react final form reruns all validators when any field changes
    // See https://github.com/final-form/react-final-form/issues/292
    return useCallback(memoizeOne(validator), [])
}
