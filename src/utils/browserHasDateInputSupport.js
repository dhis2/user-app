const notADateValue = 'not-a-date'
let hasDateInputSupport

export default function browserHasDateInputSupport() {
    // Return cached result if available
    if (typeof hasDateInputSupport !== 'undefined') {
        return hasDateInputSupport
    }

    let input = document.createElement('input')
    input.setAttribute('type', 'date')
    input.setAttribute('value', notADateValue)
    // Cache result
    hasDateInputSupport = input.value !== notADateValue
    input = null
    return hasDateInputSupport
}
