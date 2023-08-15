import { combineReducers } from "redux"
import counterReducer from "./counterReducer.js"
const rootReducer = combineReducers({
  counter: counterReducer
})

export default rootReducer