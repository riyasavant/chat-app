import { format } from "timeago.js";

export default function Message({ text, sender, time, currentUser }) {

    // console.log(sender, currentUser);

    return (
        <div 
            style={{
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: sender === currentUser ? 'flex-end' : 'flex-start',
                margin: '10px'
            }}>
            <span
                style={{
                    backgroundColor: sender === currentUser ? '#D7D7D7' : '#FB5454',
                    padding: '12px',
                    borderRadius: '20px',
                    color: sender === currentUser ? 'black' : 'white'
                }}
            >{text}</span>
            <p
                style={{
                    color: "grey",
                    marginBottom: '8px',
                    marginTop: '2px'
                }}
            >{format(time)}</p>
        </div>
    )
}