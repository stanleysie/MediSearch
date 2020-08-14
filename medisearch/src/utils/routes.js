import Home from '../modules/Home'
import StoresNearMe from '../modules/StoresNearMe'
import MyStore from '../modules/MyStore'
import SignUp from '../modules/SignUp'
import Login from '../modules/Login'

export default [
    {
        key: '/',
        path: '/',
        component: Home,
        exact: true
    },
    {
        key: '/stores-near-me',
        path: '/stores-near-me',
        component: StoresNearMe,
        exact: false
    },
    {
        key: '/profile',
        path: '/profile',
        component: MyStore,
        exact: false
    },
    {
        key: '/register',
        path: '/register',
        component: SignUp,
        exact: false
    },
    {
        key: '/login',
        path: '/login',
        component: Login,
        exact: false
    },
]