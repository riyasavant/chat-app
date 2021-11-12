/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router';
import { useSnackbar } from 'react-simple-snackbar';
import io from "socket.io-client";
import {ThemeContext} from "../../config/context/themeContext";
import { useMediaQuery } from "../../utilities/mediaQuery";
import { images } from '../../config/constants';
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
    const [showMenu, setShowMenu] = useState(false);

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
    // const socket = useRef();

    const [socket, setSocket] = useState(null);

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

    // Runs when socket fns are called
    useEffect(() => {
      const newSocket = io(`https://e2e-chat.herokuapp.com/`);
      setSocket(newSocket);
      return () => newSocket.close();
    }, []);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if(token) {
        const data = jwt(token);
        socket ? socket.emit("addUser", data.id) : console.log('Socket is Null');
      }
    }, [socket]);

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

    const handleLogout = () => {
      openSnackbar('Logging you out');
      localStorage.removeItem("token");
      history.push('/');
    }

    const handleThemeChange = () => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      setShowMenu(false);
    }

    return (
      <div style={{background: theme === 'dark' ? '#202124' : 'white'}}>
        {!isSmallScreen ? <div className="chat" style={{background: theme === 'dark' ? '#202124' : '#ffffff'}}>
          <div class="header-l"><HeaderIcon /></div>
          <div className="container">
            <div className="settings" onClick={() => setShowMenu(!showMenu)}><img src={images[currentUser ? currentUser.profileImage : 0]} alt="profile"/></div>
            {showMenu && <div className="menu">
              <div className="darkMenu" onClick={handleThemeChange}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</div>
              <div className="divider" style={{background: theme === 'dark' ? '#202124' : 'white'}}><hr /></div>
              <div className="logoutMenu" onClick={handleLogout}>Logout</div>
            </div>}
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
            <div className="settings" onClick={() => setShowMenu(!showMenu)}><img src={currentUser ? images[currentUser.profileImage] : images[0]} alt="profile" width="25px" height="25px"/></div>
            {showMenu && <div className="menu">
              <div className="darkMenu" onClick={handleThemeChange}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</div>
              <div className="divider" style={{background: theme === 'dark' ? '#202124' : 'white'}}><hr /></div>
              <div className="logoutMenu" onClick={handleLogout}>Logout</div>
            </div>}
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