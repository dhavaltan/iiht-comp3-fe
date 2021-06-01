import React, { useState, useEffect } from "react";
import TweetComponent from "./TweetComponent";
import userService from '../services/user.service'
import { useParams } from "react-router";

function ViewProfilePage() {

  
  const [userTweets, setUserTweets] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [userId, setUserId] = useState();
  const [firstName, setFirstName] = useState()
  const [lastName, setLastName] = useState();

  let { id } = useParams();
    

  useEffect(() => {
    callAPI();
   // getUserDetails();
    }, [])

    // const getUserDetails = () => {
    //   if(id) {
    //     userService.getUserDetails(id).then(res => {
    //       console.log("yo yoy"+res.data)
    //     }).catch(err => console.log(err))
    //   }
    // }

  const callAPI = () => {
    if (id) {
      setUserId(id);
      userService.getUserTweets(id).then(response => {
        setUserTweets(response.data)
        userService.getUserDetails(response.data[0].userId).then(res => {
          setFirstName(res.data.firstName);
          setLastName(res.data.lastName);
        }).catch(err => console.log(err))
          console.log(response)
        })
          .catch(error => {
            console.log(error);
        })
    }
  }

  return (
      <div className="container" style={{
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <h1 className="text-center w-100 my-3">{firstName} {lastName} </h1>
      <h3 className="text-center w-100 my-3">@{userId}</h3>        

        {firstName ? <p>User Tweets</p> : <p>No Tweets yet</p>}
        {
          userTweets.length > 0 ? (userTweets?.map((ele , index) => <TweetComponent key={index} callAPI={callAPI} tweet = {ele} />)) : null
        }
      </div>
  );
}

export default ViewProfilePage;
