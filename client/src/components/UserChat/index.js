import "./index.css";

export default function UserChat({ username }) {
    return(
        <div className="flex mb-10 ctr" style={{height: '70px'}}>
            <div className="profile-btn" style={{marginTop: '10px'}}></div>
            <div style={{marginLeft: '20px', display: 'flex', alignItems: 'center'}}>{username}</div>
        </div>
    )
}