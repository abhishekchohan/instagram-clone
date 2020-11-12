import { combineReducers } from "redux";
import loggedReducer from "./loggedReducer";
import homePostReducer from "./homePostReducer";
import loggedUserReducer from "./loggedUserReducer";
import updateReducer from "./updateReducer";

const allReducers = combineReducers({
    isLogged: loggedReducer,
    ishposts: homePostReducer,
    loggedUser: loggedUserReducer,
    isUpdate: updateReducer
})

export default allReducers;