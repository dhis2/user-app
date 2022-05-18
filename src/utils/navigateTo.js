import history from './history.js'
/**
 * Pushed new routes to the hashHistory object.
 * Can be used to imperatively trigger route changes in the Router.
 * @param {String} path - Route path to navigate to
 * @memberof module:utils
 * @function
 */
const navigateTo = (path) => {
    history.push(path)
}

export default navigateTo
