import thunk from "redux-thunk"
import { createStore, applyMiddleware, compose } from "redux"
import rootReducer from './reducers/index'

const initialState = {}

const middleware = [thunk]

const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
    )
)

export default store