import axios from 'axios'

import { LOGIN_USER, SET_USER, LOGOUT_USER } from './types'
import { LOGIN_URL } from '../Const'

export const loginUser = (code) => dispatch => {
    let url = LOGIN_URL+code
    axios.get(url)
    .then(res => res.data)
    .then(userDetail =>{
            axios.defaults.headers.common['Authorization'] = 'token '+userDetail.token
            return (
                dispatch({
                    type: LOGIN_USER,
                    payload: userDetail
                })
            )
        }
    )
}

export const setUser = (userData) => dispatch => {
    dispatch({
        type: SET_USER,
        payload: userData
    })
}

export const logoutUser = () => dispatch => {
    dispatch({
        type: LOGOUT_USER
    })
}
