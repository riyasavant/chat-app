import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSnackbar } from 'react-simple-snackbar'
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
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [openSnackbar, closeSnackbar] = useSnackbar(options);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentConversationId, setConversationId] = useState(null);
    const [friendNameSelected, setFriendName] = useState('');

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
            else {
              const user = jwt(localStorage.getItem("token"));
              setCurrentUser(user);
            }
        })
        .catch(err => console.log(err));
        
      }, []);

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

    const showMessages = async (conversationId, fName) => {
      setConversationId(conversationId);
      try {
        const messagesData = await axios.get(process.env.REACT_APP_API_URL + "/messages/" + conversationId);
        // console.log(messagesData);
        openSnackbar('Messages Fetched Successfully');
        setSelectedChat(messagesData.data);
        setFriendName(fName);
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
                  {conversations.map(u => <UserChat data={u} currentUser={currentUser} onClick={(friendName) => showMessages(u["_id"], friendName)}/>)}
                </div>
              </div>
              {selectedChat ? <Messenger data={selectedChat} currentUser={currentUser} id={currentConversationId} fName={friendNameSelected}/> : <div className="default-txt"><div className="txt">Select a chat to see the messages...</div></div>}
            </div>
          </div>
        </div>
    )
}