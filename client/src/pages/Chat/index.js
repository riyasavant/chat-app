import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSnackbar } from 'react-simple-snackbar'
import jwt from 'jwt-decode';
import axios from 'axios';
import { dummyChats } from '../../config/constants';
import UserChat from '../../components/UserChat';
import Message from "../../components/Message";
import HeaderIcon from '../../components/Icon';
import "./index.css";

export default function Chat() {

    // Snackbar position
    const options = {
        position: 'bottom-left'
    };

    const history = useHistory();
    const [conversations, setConversations] = useState([]);
    const [openSnackbar, closeSnackbar] = useSnackbar(options);

    const user = jwt(localStorage.getItem("token"));
    // console.log(user);

    useEffect(() => {
      
        fetch(process.env.REACT_APP_API_URL + "/auth/verifyAuth", {
          headers: {
            "x-access-token": localStorage.getItem("token")
          }
        })
        .then(res => res.json())
        .then(data => {
            if(!data.isLoggedIn) {
                openSnackbar('Please Login')
                history.push('/');
            }
        })
        .catch(err => console.log(err));
        
      }, []);

    useEffect(() => {
      const getConversations = async () => {
        try {
          const convData = await axios.get(process.env.REACT_APP_API_URL + "/conversations/" + user.id);
          // console.log(convData);
          setConversations(convData.data);
        } catch(err) {
          console.log(err);
        }
      }
      getConversations();
    }, []);

    return (
        <div className="chat">
          <HeaderIcon />
          <div className="container">
            <span className="settings">&#9881;</span>
            <div className="chat-body">
              <div className="chat-list">
              <div id="hamburger">
                  <svg viewBox="0 0 100 50" width="35" height="30" id="ham-tab">
                    <rect width="80" height="10"></rect>
                    <rect y="20" width="80" height="10"></rect>
                    <rect y="40" width="80" height="10"></rect>
                  </svg>
                </div>
                <input type="text" placeholder="&#xF002;  Search User" id="search-user" />
                <div className="user-list">
                  {conversations.map(u => <UserChat data={u} currentUser={user}/>)}
                </div>
              </div>
              <div className="chat-messages">
                <div className="user-header">
                <div id="hamburger">
                  <svg viewBox="0 0 100 50" width="35" height="30">
                    <rect width="80" height="10"></rect>
                    <rect y="20" width="80" height="10"></rect>
                    <rect y="40" width="80" height="10"></rect>
                  </svg>
                </div>
                <hr></hr>
                  <div className="profile-btn"></div>
                  <div className="user-name">Jane Doe</div>
                </div>
                <div className="msgs">
                  {dummyChats.map(chat => <Message text={chat.text} sender={chat.sender}/>)}
                </div>
                <div className="flex-container">
                <input type="text" placeholder="Type a message..." className="flex-item-left" />
                  <input type="button" value="Send" className="flex-item-right"/>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}