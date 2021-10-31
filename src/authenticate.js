import axios from 'axios'
import store from './store'

import { WHOAMI_URL, LOGIN_HOME_URL } from './Const'
import { setUser } from './actions/userActions'

const authenticate = () => {
    let state = store.getState()
    if (state.user.item.token){
        return true
    }
    else if(localStorage.getItem('token')){
        axios.defaults.headers.common['Authorization'] = 'token '+localStorage.getItem('token')
        axios.get(WHOAMI_URL)
        .then(response => {
            if(response.status === 200 && response.data[0].userId){
                let user_data = {user:response.data[0], token: localStorage.getItem('token')}
                store.dispatch(setUser(user_data))
                return true
            }
        })
        .catch(err =>{
            localStorage.removeItem('token')
            window.location.href=LOGIN_HOME_URL
        })
    }
    else{
        window.location.href=LOGIN_HOME_URL
    }
}

export default authenticate
