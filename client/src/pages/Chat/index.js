import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSnackbar } from 'react-simple-snackbar'
import jwt from 'jwt-decode';
import axios from 'axios';
import { dummyChats } from '../../config/constants';
import UserChat from '../../components/UserChat';
import Message from "../../components/Message";
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
          <div className="container">
            <div className="chat-header">
              <span>
                <svg width="30" height="30" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-labelledby="title" aria-describedby="desc" role="img" xmlns="http://www.w3.org/1999/ xlink">
                  <path d="M23.688 5.469h21.999l-11.084 20h13.084L22.094 58.531l6.053-23.062H16.313l7.375-30z" fill="#fb5454" data-name="layer2"></path>
                  <path d="M34.603 25.469l11.084-20h-7.003l-11.083 20h7.002zm6.081 0L25.687 44.844l-3.593 13.687 25.593-33.062h-7.003z" opacity=".25" fill="#fb5454" data-name="layer1"></path>
                  <path d="M23.688 5.469h21.999l-11.084 20h13.084L22.094 58.531l6.053-23.062H16.313l7.375-30z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="#fb5454" fill="#fb5454" data-name="stroke"></path>
                </svg>
              </span>
              <div className="profile-btn"></div>
            </div>
            <div className="chat-body">
              <div className="chat-list">
                <input type="text" placeholder="Search User"/>
                <div className="user-list">
                  {conversations.map(u => <UserChat data={u} currentUser={user}/>)}
                </div>
              </div>
              <div className="chat-messages">
                <div className="user-header">
                  <div className="profile-btn"></div>
                  <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px'}}>Jane Doe</div>
                </div>
                <div className="msgs">
                  {dummyChats.map(chat => <Message text={chat.text} sender={chat.sender}/>)}
                </div>
                <div className="msg-input">
                  <input type="text" placeholder="Type a message..." className="msg-i"/>
                  <span className="send-btn">Send</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}