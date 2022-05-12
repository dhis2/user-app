import { useAlert } from '@dhis2/app-runtime'

export const useFetchAlert = () => {
    const { show } = useAlert(
        ({ message }) => message,
        ({ isError }) => (isError ? { critical: true } : { success: true })
    )
    return {
        showSuccess: (message) => show({ message }),
        showError: (message) => show({ message, isError: true }),
    }
}
