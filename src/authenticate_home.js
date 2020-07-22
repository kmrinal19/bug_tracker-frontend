import axios from 'axios'
import store from './store'

import { WHOAMI_URL, PROJECT_HOME_URL } from './Const'
import { setUser } from './actions/userActions'

const authenticate_home = () => {
    let state = store.getState()
    if (state.user.item.token){
        axios.defaults.headers.common['Authorization'] = 'token '+state.user.item.token
        axios.get(WHOAMI_URL)
        .then(response => {
            if(response.status === 200 && response.data[0].userId){
                window.location.href = PROJECT_HOME_URL
            }
        })
    }
    else if(localStorage.getItem('token')){
        axios.defaults.headers.common['Authorization'] = 'token '+localStorage.getItem('token')
        axios.get(WHOAMI_URL)
        .then(response => {
            if(response.status === 200 && response.data[0].userId){
                let user_data = {user:response.data[0], token: localStorage.getItem('token')}
                store.dispatch(setUser(user_data))
            }
        })
        .then(() => {
            window.location.href = PROJECT_HOME_URL
        })
    }
}

export default authenticate_home