import { useState, useRef, useEffect } from 'react';
import Message from "../Message/index";
import axios from 'axios';
import "./index.css";

export default function Messenger({ data, currentUser, id, fName }) {

  const [message, setMessage] = useState('');
  const [prevData, setPrevData] = useState(data);

  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviour: "smooth"});
  }, [prevData])

  const handleChange = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  }

  const sendMessage = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + "/messages/", {
        conversationId: id,
        sender: currentUser.id,
        text: message
      });
      setPrevData([...data, response.data]);
      setMessage('');
    } catch(e) {
      console.log(e);
    }
  }

  console.log(currentUser);
    return(
        <div className="chat-messages">
            <div className="user-header">
              <div className="profile-btn"></div>
              <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px'}}>{fName}</div>
            </div>
            <div className="msgs">
              {prevData.map(chat => <div ref={scrollRef}><Message text={chat.text} sender={chat.sender} time={chat.createdAt} currentUser={currentUser.id}/></div>)}
            </div>
            <div className="flex-container">
            <input type="text" placeholder="Type a message..." className="flex-item-left" value={message} onChange={handleChange}/>
            <input type="button" value="Send" className="flex-item-right" onClick={sendMessage}/>
            </div>
        </div>
    )
}