import React, { useState, useEffect } from "react";
import userService from "../services/user.service";
import authService from "../services/auth.service"
import TweetComponent from "./TweetComponent";
import AysncSelect from 'react-select/async'

function HomePage( {history}) {

  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [allTweets, setAllTweets] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [searchuserText, setSearchUserText] = useState('')
  
  useEffect(() => {
    callAPI();
    }, [])

    const debounce = (fn, delay) => {
  
      let timeoutID;
      return (...args) => {
     
        if (timeoutID) {
          clearTimeout(timeoutID);
        }
        timeoutID = setTimeout(() => {
          fn(...args)
        }, delay )
     }
  }
 
   const loadUserSuggestions = (searchUserText, callback) => {
 
     debounce(() => {
       userService.searchUser(searchUserText).then(response => {
         response.data.length > 0 ? callback(response.data.map(i => ({ label: i.username, value: i.username }))) : callback([])
       });
     
      },100)()
   }
     
   const handleInputChange = (newValue) => {
     const inputValue = newValue.replace(/\W/g, '');
     setSearchUserText(inputValue)
     return inputValue;
   };
 
   const onSelect = (obj) => {
     history.push(`/view-profile/${obj.value}`)
     
     
   }

  const callAPI = () => {
    
    const user = authService.getCurrentUser();
      setCurrentUser(user)
    userService.getAllTweets().then(response => {
        setAllTweets(response.data)
        console.log(response);
      })
        .catch(error => {
          console.log(error);
      })
  }

  const handleSubmit = (e) => {
    setSuccessMessage('')
    setErrorMessage('')
    e.preventDefault();
    userService.saveTweet(currentUser.username,{ userId : currentUser.username, text : message, username : currentUser.username}).then(res => {
      setSuccessMessage("Request is successful")
      callAPI();
    }).catch(err => {
      let errMessage =
            (err.response &&
              err.response.data &&
              err.response.data.message) ||
              err.message ||
              err.toString();

      setErrorMessage(errMessage + "- Max length allowed is 144 characters");
    });
  }

  return (
    <div className="container">
            <AysncSelect
                        
                        onInputChange={handleInputChange}
                        placeholder={'Search User'}
            loadOptions={loadUserSuggestions}
            
              onChange={onSelect}
                      />
        {/* <h1 className="text-center w-100 my-3">Home</h1> */}
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card my-5">
            <div className="card-body">
              
            {
                  errorMessage.length > 0 ? (<div className="alert-danger p-2">
                  <small>{errorMessage}</small>
                </div>) : successMessage.length > 0 ? (<div className="alert-success p-2">
                  <small>{successMessage}</small>
                </div>) : null
                 }

                <form onSubmit={handleSubmit}>
                  <div className="form-label-group my-2">
                    <textarea
                      rows="3"
                      name="newtweet"
                      className="form-control"
                      placeholder="Enter message"
                      required
                      autofocus
                      value={message}
                      onChange={(e)=> setMessage(e.target.value)}
                    />
                  </div>
                  
                  <br />
                  <button
                    className="btn btn-md btn-primary btn-block"
                    style={{
                      width: '30%',
                      marginLeft: '70%'
                    }}
                    type="submit"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>


        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems:'center',
          justifyContent:'center'
        }}>
        <h2>All Tweets</h2>
        
        {
          allTweets.length > 0 ? (allTweets?.map((ele , index) => <TweetComponent callAPI={callAPI} key={index} tweet = {ele} />)) : null
        }
        </div>
      </div>
  );
}

export default HomePage;
