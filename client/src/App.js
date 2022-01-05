// components
import Navbar from "./components/Navbar";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import SignIn from "./components/screens/SignIn"
import SignUp from "./components/screens/SignUp"
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import SubscribedUserPosts from "./components/screens/SubscribedUserPosts";

// css
import "./App.css"

// packages import
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { createContext, useEffect, useReducer, useContext } from "react";

// reducer
import { reducer, initialState } from './reducers/userReducer'

// context logic
export const UserContext = createContext()

const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({ type: "USER", payload: user })
      // navigate('/')
    } else {
      navigate('/signin')
    }
  }, [])

  return (
    <Routes>
      <Route exact path='/' element={<Home />} />
      <Route exact path='/myfollowingposts' element={<SubscribedUserPosts />} />
      <Route exact path='/profile' element={<Profile />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/create' element={<CreatePost />} />
      <Route path='/profile/:userid' element={<UserProfile />} />
    </Routes>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
