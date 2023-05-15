import {configureStore} from '@reduxjs/toolkit'
import editUserReducer from "../features/userSlice"

export default configureStore({
    reducer:{
        user:editUserReducer
    }
})