import { createHashHistory } from 'history'

/**
 * Creates and exports an empty hash history object that will be used by the Router
 * This history object can be imported and addressed directly outside of components
 * For example, it is used by navigateTo in ../utils/index
 * @name history
 * @memberof module:utils
 */

export default createHashHistory()
