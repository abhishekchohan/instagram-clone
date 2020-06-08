import loggedReducer from "./loggedReducer";
import { combineReducers } from "redux";
import loadedReducer from "./loadedReducer";
import homePostReducer from "./homePostReducer";

const allReducers = combineReducers({
    isLogged: loggedReducer,
    isLoaded: loadedReducer,
    ishposts: homePostReducer,
})

export default allReducers;