import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

export default function UserChat({ data, currentUser }) {

    const [userData, setUserData] = useState();

    useEffect(() => {
        const getUserData = async () => {
            const friendId = data.members.find(m => m !== currentUser.id)
            const response = await axios.get(process.env.REACT_APP_API_URL + "/user/" + friendId);
            setUserData(response.data);
        };
        getUserData();
    }, [])

    return(
        <div className="flex mb-10 ctr" style={{height: '60px'}}>
            <div className="profile-btn" style={{marginTop: '15px'}}></div>
            <div style={{marginLeft: '20px', display: 'flex', alignItems: 'center'}}>{userData? userData.username : 'Loading...'}</div>
        </div>
    )
}