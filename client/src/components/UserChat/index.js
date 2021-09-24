import "./index.css";

export default function UserChat({ username }) {
    return(
        <div className="flex mb-10 ctr">
            <div className="profile-btn"></div>
            <div style={{marginLeft: '20px', display: 'flex', alignItems: 'center'}}>{username}</div>
        </div>
    )
}