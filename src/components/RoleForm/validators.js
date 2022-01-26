import i18n from '@dhis2/d2-i18n'
import pDebounce from 'p-debounce'
import { useCallback } from 'react'

export const useDebouncedUniqueRoleNameValidator = ({ engine, roleName }) => {
    const currentRoleName = roleName
    const validator = async roleName => {
        if (roleName === currentRoleName) {
            return
        }

        try {
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
            if (roles.length > 0) {
                return i18n.t('Name is already taken')
            }
        } catch (error) {
            return i18n.t(
                'There was a problem whilst checking the availability of this role name'
            )
        }
    }
    const debouncedValidator = pDebounce(validator, 350)
    return useCallback(debouncedValidator, [])
}
