import createHashHistory from 'history/createHashHistory';
// Creating and exporting an empty hash history here that will be used by the Router
// This history can be imported and adressed directly outside of components
// For example, it is used by navigateTo in ../utils/index
export default createHashHistory();
