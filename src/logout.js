import axios from 'axios'
import store from './store'
import {LOGOUT_URL, LOGIN_HOME_URL} from './Const'

import { logoutUser } from './actions/userActions'

const logout = () => {
    axios.post(LOGOUT_URL)
    store.dispatch(logoutUser)
    localStorage.removeItem('token')
    window.location.href = LOGIN_HOME_URL
}

export default logout