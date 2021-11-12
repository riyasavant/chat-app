/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router';
import { useSnackbar } from 'react-simple-snackbar';
import { io } from "socket.io-client";
import {ThemeContext} from "../../config/context/themeContext";
import { useMediaQuery } from "../../utilities/mediaQuery";
import jwt from 'jwt-decode';
import axios from 'axios';
import UserChat from '../../components/UserChat';
import HeaderIcon from '../../components/Icon';
import Messenger from '../../components/Messenger';
import "./index.css";

export default function Chat() {

  const { theme, setTheme } = useContext(ThemeContext);

    // Snackbar position
    const options = {
        position: 'bottom-left'
    };

    const history = useHistory();
    const [openSnackbar, closeSnackbar] = useSnackbar(options);

    let isSmallScreen = useMediaQuery('(max-width: 1100px)');

    // Search for a user
    const [isSearching, setIsSearching] = useState(false);
    const [searchUser, setSearchUser] = useState('');

    // Stores all conversations
    const [conversations, setConversations] = useState([]);
    const [selectedConvo, setSelectedConvo] = useState(null);

    // Stores the messages of current selected conversation
    const [chatMessages, setChatMessages] = useState(null);
    const [isChatSelected, setIsChatSelected] = useState(false);

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
        setIsChatSelected(true);
      } catch(err) {
        openSnackbar('Could not fetch messages');
      }
    }

    const handleSearch = async () => {
      setIsSearching(true);
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + "/user/" + searchUser);
        if(response.data) {
          setSearchUser('');
          openSnackbar('User found');
          const newConvoResponse = await axios.post(process.env.REACT_APP_API_URL + "/conversations/", { senderId: currentUser.id, receiverId: response.data["_id"]});
          console.log(newConvoResponse);
          setConversations(prev => [...prev, newConvoResponse.data]);
        } else { openSnackbar('Username not found'); setSearchUser('');}
        setIsSearching(false);
      } catch(err) {
        console.log(err);
      }
    }

    const clearSelectedConvo = () => {
      setIsChatSelected(false);
    }

    return (
      <div style={{background: theme === 'dark' ? '#202124' : 'white'}}>
        {!isSmallScreen ? <div className="chat" style={{background: theme === 'dark' ? '#202124' : '#ffffff'}}>
          <HeaderIcon />
          <div className="container">
            <span className="settings">&#9881;</span>
            <div className="chat-body">
              <div className="chat-list" style={{background: theme === 'dark' ? '#464649' : '#f1f1f1'}}>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    placeholder={isSearching ? "Searching..." : "Search User" }
                    id="search-user" 
                    value={searchUser} 
                    onChange={(e) => setSearchUser(e.target.value)}
                  />
                  {!isSearching && <div className="search-icon" onClick={handleSearch}>&#xF002;</div>}
                </div>
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
        </div> : 
        <div className="chat">
            {!isChatSelected ? <><div className="header-m"><HeaderIcon /></div>
            <span className="settings">&#9881;</span>
            <div className="container-m">
                <div className="input-wrapper-m">
                  <input 
                    type="text" 
                    placeholder={isSearching ? "Searching..." : "Search User" }
                    id="search-user-m" 
                    value={searchUser} 
                    onChange={(e) => setSearchUser(e.target.value)}
                  />
                  {!isSearching && <div className="search-icon-m" onClick={handleSearch}>&#xF002;</div>}
                </div>
                <div className="chat-list-m" style={{background: theme === 'dark' ? '#212024' : '#f1f1f1'}}>
                  
                <div className="user-list-m">
                  {conversations.map(convo => 
                    <UserChat 
                      data={convo} 
                      currentUser={currentUser} 
                      onClick={(friendData) => showMessages(convo, friendData)}
                    />
                  )}
                </div>
              </div>
            </div></> : 
            <>
              <Messenger 
                data={chatMessages} 
                currentUser={currentUser} 
                convoData={selectedConvo} 
                friendData={friendSelected} 
                socket={socket}
                setChatData={setChatMessages}
                clearSelection={clearSelectedConvo}
              />
            </>}
        </div>}
      </div>
    )
}