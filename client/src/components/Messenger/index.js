import { useState, useRef, useEffect, useContext } from 'react';
import Message from "../Message/index";
import {ThemeContext} from "../../config/context/themeContext";
import { useMediaQuery } from '../../utilities/mediaQuery';
import { arrows, images } from "../../config/constants/index";
import sendIcon from "../../icons/send.png";
import axios from 'axios';
import "./index.css";

export default function Messenger({ data, currentUser, convoData, friendData, socket, setChatData, clearSelection }) {

  const [message, setMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const {theme, setTheme} = useContext(ThemeContext);

  let isSmallScreen = useMediaQuery('(max-width: 1100px)');
  const randomImage = Math.floor(Math.random() * 8);

  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviour: "smooth"});
  }, [data])

  useEffect(() => {
    socket.on("getMessage", newMsgData => {
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

      socket.emit("sendMessage", {
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
      <>
        {!isSmallScreen ? <div className="chat-messages" style={{background: theme==="dark" ? "#464649" : "#F1F1F1"}}>
            <div className="user-header" style={{background: theme==="dark" ? "#464649" : "#e6e6e6"}}>
              <div className="profile-btn"><img src={images[friendData ? friendData.profileImage : 0]} height={20} width={20} alt="profile-pic"/></div>
              <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px', color: theme==="dark" ? "white" : "#202124"}} className="user-name">{friendData.username}</div>
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
        </div> : 
        <div className="chat-messages-m" style={{background: theme==="dark" ? "#202124" : "#F1F1F1"}}>
          <div className="user-header" style={{background: theme==="dark" ? "#464649" : "#d7d7d7"}}>
            <div onClick={clearSelection} style={{cursor: 'pointer'}}><img src={theme === 'dark' ? arrows["dark"] : arrows["light"]} alt="alt-icon" width="20px"/></div>
            <div className="profile-btn" style={{marginLeft: '12px'}}><img src={images[friendData ? friendData.profileImage : 0]} height={20} width={20} alt="profile-pic"/></div>
            <div style={{display: 'flex', alignItems: 'center', marginLeft: '10px', color: theme==="dark" ? "white" : "#d7d7d7"}} className="user-name">{friendData.username}</div>
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
          <div className="flex-container-m" style = {{background: theme === "dark" ? "#848486" : "#d7d7d7"}}>
            <input type="text" placeholder="Type a message..." className="flex-item-left-m" value={message} onChange={handleChange}/>
            <div className="flex-item-right-m" onClick={sendMessage}><img src={sendIcon} alt="send-icon" width="25px" height="25px"/></div>
          </div>
        </div>
        }
      </>
    )
}