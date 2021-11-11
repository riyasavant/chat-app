import { useState, useRef, useEffect, useContext } from 'react';
import Message from "../Message/index";
import {ThemeContext} from "../../config/context/themeContext";
import axios from 'axios';
import "./index.css";

export default function Messenger({ data, currentUser, convoData, friendData, socket, setChatData }) {

  const [message, setMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const {theme, setTheme} = useContext(ThemeContext);

  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviour: "smooth"});
  }, [data])

  useEffect(() => {
    socket.current.on("getMessage", newMsgData => {
      setArrivalMessage({
        conversationId: newMsgData.conversationId,
        sender: newMsgData.senderId,
        text: newMsgData.text,
        createdAt: Date.now()
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage && convoData?.members.includes(arrivalMessage.sender) && 
    setChatData(prev => [...prev, {...arrivalMessage}]);
  }, [arrivalMessage, convoData])

  const handleChange = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  }

  const sendMessage = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/messages/", {
        conversationId: convoData._id,
        sender: currentUser.id,
        text: message
      });

      socket.current.emit("sendMessage", {
        senderId: currentUser.id,
        receiverId: friendData["_id"],
        text: message,
        conversationId: convoData["_id"]
      });

      setChatData([...data, response.data]);
      setMessage('');
    } catch(e) {
      console.log(e);
    }
  }

    return(
        <div className="chat-messages" style={{background: theme==="dark" ? "#464649" : "#F1F1F1"}}>
            <div className="user-header" style={{background: theme==="dark" ? "#464649" : "#d7d7d7"}}>
              <div id="hamburger">
                <svg viewBox="0 0 100 50" width="35" height="30">
                  <rect width="80" height="10"></rect>
                  <rect y="20" width="80" height="10"></rect>
                  <rect y="40" width="80" height="10"></rect>
                </svg>
              </div>
              <hr></hr>
              <div className="profile-btn" style={{background: theme==="dark" ? "#eeece0" : "#d7d7d7"}}></div>
              <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px', color: theme==="dark" ? "white" : "#d7d7d7"}} className="user-name">{friendData.username}</div>
            </div>
            <div className="msgs">
              {data.map(chat => 
                <div ref={scrollRef}>
                  <Message 
                    text={chat.text} 
                    sender={chat.sender} 
                    time={chat.createdAt} 
                    currentUser={currentUser.id}
                  />
                </div>
              )}
            </div>
            <div className="flex-container" style = {{background: theme === "dark" ? "#848486" : "#d7d7d7"}}>
              <input type="text" placeholder="Type a message..." className="flex-item-left" value={message} onChange={handleChange}/>
              <button className="flex-item-right" onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}