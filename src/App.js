import React, { useEffect, useState } from 'react';
import { withRouter } from "react-router-dom";

import './App.css';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ChangePasswordPage from './components/ChangePasswordPage';
import ViewProfilePage from './components/ViewProfilePage';
import TweetReplyPage from './components/TweetReplyPage';
import HomePage from './components/HomePage';
import AysncSelect from 'react-select/async'
import { createBrowserHistory } from "history";


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import authService from './services/auth.service';
import userService from './services/user.service';

function App() {

  const [currentUser, setCurrentUser] = useState(null)
  
  const history = createBrowserHistory();

  

  useEffect(() => {
    const user = authService.getCurrentUser();
    if(user){
      setCurrentUser(user)
    }
  }, [])
  const logOut = ()=> {
    authService.logout();
    history.push('/login')
  }
  
  return (
    <Router history={history}>
      <div>
        <nav style={{
          width:'100%',
        }}>
          <ul>
                 {
              !currentUser ? (
                <>
            <b><li>
              <Link to="/login">Login</Link>
            </li>
            </b>
            <b>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
            </b>
              </>
                ):(
                    <>
            <b><li >
              <Link to="/home">Home</Link>
            </li>
            </b>
            
            <b> <li>
              <Link to="/login" onClick={logOut}>Logout</Link>
                    </li></b>
                   
            </>
                )
              
}
          </ul>
          

        </nav>
              <Switch>
            {
              !currentUser ? (
                <>
              <Route exact path={["/","/login"]} component={LoginPage} />
              <Route path="/signup" component={SignupPage} />

              <Route path="/home" component={LoginPage} />
              <Route path="/">
                  <Redirect to="/login" />
                </Route>
              </>
              ):(
                <>
                
                <Route exact path="/" component={HomePage} /> 
                <Route path="/home" component={HomePage} />
                <Route path="/login" component={HomePage} />
                <Route path="/change-password" component={ChangePasswordPage} />
                  
                <Route path="/tweet-reply" component={TweetReplyPage} />
                 
                <Route path="/view-profile/:id" component={ViewProfilePage} />
                  
                <Redirect to="/home" />
                </>
              )
            }
        </Switch>
        </div>
    </Router>
  );
}
export default App;
