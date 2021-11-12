import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../config/context/themeContext";
import { images } from "../../config/constants/index";
import axios from "axios";
import "./index.css";

export default function UserChat({ data, currentUser, onClick }) {

    const [userData, setUserData] = useState();
    const { theme, setTheme } = useContext(ThemeContext);

    useEffect(() => {
        const getUserData = async () => {
            const friendId = data.members.find(m => m !== currentUser.id)
            const response = await axios.get(process.env.REACT_APP_API_URL + "/user/get/" + friendId);
            setUserData(response.data);
        };
        getUserData();
    }, [currentUser, data])

    return(
        <div className="flex mb-10 ctr" style={{height: '50px', background: theme === "dark" ? "#636365" : "#e6e6e6", boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px'}} onClick={() => onClick(userData ? userData : {username: 'Loading...', id: ''})}>
            <div className="profile-btn"><img src={images[userData ? userData.profileImage : 0]} height={30} width={30} alt="profile-pic"/></div>
            <div style={{marginLeft: '20px', display: 'flex', alignItems: 'center', color: theme==="dark" ? "white" : "#d7d7d7"}}>{userData ? userData.username : 'Loading'}</div>
        </div>
    )
}