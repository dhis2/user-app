import i18n from '@dhis2/d2-i18n'
import pDebounce from 'p-debounce'
import { useValidator } from '../../hooks/useValidator.js'

export const useDebouncedUniqueRoleNameValidator = ({
    engine,
    roleName: currentRoleName,
}) => {
    const findRolebyName = pDebounce(async (roleName) => {
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
        return roles[0]
    }, 350)
    const validator = async (roleName) => {
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
    return useValidator(validator)
}
