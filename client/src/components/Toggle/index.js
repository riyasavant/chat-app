
import React from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../../config/context/themeContext';
import './index.css';

export default function ToggleTheme({theme, setTheme}){
      return(
        <div id="toggle-pos">
            <label className="switch">
            <input id="check" type="checkbox" />
            <span className={theme === 'dark' ? 'slider-left':'slider'} onClick={() => {
                if(theme === 'dark')
                setTheme('light')
                else
                setTheme('dark')
                }}></span>
            </label>
        </div>
    )
}