import { useState, useRef, useEffect } from 'react';
import Message from "../Message/index";
import axios from 'axios';
import "./index.css";

export default function Messenger({ data, currentUser, convoData, friendData, socket, setChatData }) {

  const [message, setMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);

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

      console.log('current id: ', currentUser.id);
      console.log('friend id: ', friendData["_id"]);
      console.log('convo id: ', convoData["_id"]);

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
        <div className="chat-messages">
            <div className="user-header">
              <div className="profile-btn"></div>
              <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px'}}>{friendData.username}</div>
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
            <div className="flex-container">
            <input type="text" placeholder="Type a message..." className="flex-item-left" value={message} onChange={handleChange}/>
            <button className="flex-item-right" onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}