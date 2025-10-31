import { useConfig } from '@dhis2/app-runtime'

export const useFeatureToggle = () => {
    const config = useConfig()
    const minorVersion = config?.serverVersion?.minor
    const emailConfigured = config?.systemInfo?.emailConfigured
    return {
        displayEmailVerifiedStatus: Boolean(
            emailConfigured && Number(minorVersion) >= 42
        ),
        showUserGroupDescription: Number(minorVersion) >= 43,
    }
}
