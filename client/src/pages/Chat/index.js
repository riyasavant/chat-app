/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { useSnackbar } from 'react-simple-snackbar';
import { io } from "socket.io-client";
import jwt from 'jwt-decode';
import axios from 'axios';
import UserChat from '../../components/UserChat';
import HeaderIcon from '../../components/Icon';
import Messenger from '../../components/Messenger';
import "./index.css";

export default function Chat() {

    // Snackbar position
    const options = {
        position: 'bottom-left'
    };

    const history = useHistory();
    const [openSnackbar, closeSnackbar] = useSnackbar(options);

    // Stores all conversations
    const [conversations, setConversations] = useState([]);
    const [selectedConvo, setSelectedConvo] = useState(null);

    // Stores the messages of current selected conversation
    const [chatMessages, setChatMessages] = useState(null);

    // Stores details of the current user -> decoding token
    const [currentUser, setCurrentUser] = useState(null);

    // Stores the details of current convo friend
    const [friendSelected, setFriendSelected] = useState('');

    // Creates a reference to socket connection
    const socket = useRef();

    // Runs when socket fns are called
    useEffect(() => {
      socket.current = io("ws://localhost:8900");
    }, []);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if(token) {
        const data = jwt(token);
        socket.current.emit("addUser", data?.id)
      }
      socket.current.on("getUsers", (users) => console.log(users));
    }, []);

    // Initially checks if user is logged in
    useEffect(() => {
      
      fetch(process.env.REACT_APP_API_URL + "/auth/verifyAuth", {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
      })
      .then(res => res.json())
      .then(data => {
          if(!data.isLoggedIn) {
              openSnackbar('Please Login');
              history.push('/');
          }
          else {
            const user = jwt(localStorage.getItem("token"));
            setCurrentUser(user);
          }
      })
      .catch(err => console.log(err));
      
    }, []);

    // Fetches all conversations on page load
    useEffect(() => {
      const getConversations = async () => {
        try {
          const convData = await axios.get(process.env.REACT_APP_API_URL + "/conversations/" + currentUser.id);
          openSnackbar('Fetched Conversations')
          setConversations(convData.data);
        } catch(err) {
          console.log(err);
        }
      }
      getConversations();
    }, [currentUser]);

    // Fetches all messages from selected conversation
    const showMessages = async (convo, friendData) => {
      setSelectedConvo(convo);
      try {
        const messagesData = await axios.get(process.env.REACT_APP_API_URL + "/messages/" + convo._id);
        openSnackbar('Messages Fetched Successfully');
        setChatMessages(messagesData.data);
        setFriendSelected(friendData);
      } catch(err) {
        openSnackbar('Could not fetch messages');
      }
    }

    return (
        <div className="chat">
          <HeaderIcon />
          <div className="container">
            <div className="chat-header">
              {/* <div className="profile-btn"></div> */}
            </div>
            <div className="chat-body">
              <div className="chat-list">
                <input type="text" placeholder="&#xF002;  Search User" id="search-user" />
                <div className="user-list">
                  {conversations.map(convo => 
                    <UserChat 
                      data={convo} 
                      currentUser={currentUser} 
                      onClick={(friendData) => showMessages(convo, friendData)}
                    />
                  )}
                </div>
              </div>
              {chatMessages ? 
                <Messenger 
                  data={chatMessages} 
                  currentUser={currentUser} 
                  convoData={selectedConvo} 
                  friendData={friendSelected} 
                  socket={socket}
                  setChatData={setChatMessages}
                /> : 
                <div className="default-txt">
                  <div className="txt">Select a chat to see the messages...</div>
                </div>
              }
            </div>
          </div>
        </div>
    )
}