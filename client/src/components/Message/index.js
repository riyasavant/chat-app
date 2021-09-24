import "./index.css";

export default function Message({ text, sender }) {
    return (
        <div 
            style={{
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: sender === 'me' ? 'flex-end' : 'flex-start',
                margin: '10px'
            }}>
            <span
                style={{
                    backgroundColor: sender === 'me' ? '#D7D7D7' : '#FB5454',
                    padding: '12px',
                    borderRadius: '20px',
                    color: sender === 'me' ? 'black' : 'white'
                }}
            >{text}</span>
        </div>
    )
}