import { LOGIN_USER, SET_USER, LOGOUT_USER } from '../actions/types'

const initialState = {
    item: [],
}

export default function (state = initialState, action){
    switch(action.type) {
        case LOGIN_USER:
            if (action.payload.token){
                return {
                    item: action.payload
                }
            }
            else{
                action.payload = {
                    err : true
                }
                return {
                    item: action.payload
                }
            }
        case SET_USER:
            if (action.payload.token){
                return {
                    item: action.payload
                }
            }
            else{
                action.payload = {
                    err : true
                }
                return {
                    item: action.payload
                }
            }
        case LOGOUT_USER:
            return{
                item:[],
            }
        
        default:
            return state
    }
}