
import React from 'react';
import './index.css';

export default function ToggleTheme({theme, setTheme}){

    function changeTheme() {
        theme === 'dark' ? setTheme('light') : setTheme('dark');
    }

      return(
        <div id="toggle-pos">
            <label className="switch">
                <input id="check" type="checkbox" checked={theme === 'light' ? true : false}/>
                <span className="slider" onClick={changeTheme}></span>
            </label>
        </div>
    )
}