import i18n from '@dhis2/d2-i18n'
import { PAGE_SIZE } from './constants.js'

const getRefineSearchLabel = (totalSearchResultCount) =>
    i18n.t(
        'Showing {{visibleItemsCount}} of {{totalSearchResultCount}} search results, please refine your search to see more.',
        {
            visibleItemsCount: PAGE_SIZE,
            totalSearchResultCount,
        }
    )

export default getRefineSearchLabel
