import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderIcon from '../Icon';
import Wave from '../Wave';
import Typewriter from "../WordAnimation";
import { ThemeContext } from '../../config/context/themeContext';
import './index.css';
import ToggleTheme from '../Toggle';

function Auth({ isLogin, doSubmit, errorMsg }) {  
  const { theme, setTheme } = useContext(ThemeContext);
  const [passwordError, setPasswordError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(e.target[0].value !== '' && e.target[1].value.length >= 6 && e.target[1].value.length <= 12) {
      doSubmit(e);
    } else {
      if(e.target[1].value.length < 6 || e.target[1].value.length > 12) {
        setPasswordError('Length of Password should be between 6 to 12');
      }
    }
  }

    return (
      <div className={theme === 'dark' ? 'darkTheme' : 'lightTheme'}>
        <ToggleTheme theme={theme} setTheme={setTheme}/>

        <div id="login">
          <HeaderIcon />

          <div id="msg">
            <p id="desc">
              <Typewriter />
            </p> 
            <span id="messenger">Messenger</span> 
          </div>

          <div id="credentials">  
            <form onSubmit={handleSubmit}>
              <div id="usr-opt">
                <p  id={theme === 'dark' ? 'new-user-dark' : 'new-user'}>{`${isLogin ? 'New' : 'Existing'} User? `} 
                  <span>
                    <Link to={`${isLogin ? '/register' : '/'}`} className="lnk">{`${isLogin ? 'Register' : 'Login'}`}</Link>
                  </span>
                </p>
              </div>
              <input type="text" placeholder="Username" className="pos" required/>
              <input type="password" placeholder="Password" className="pos" required/>
              {passwordError && <p className="error">{passwordError}</p>}
              <p className="error">{errorMsg}</p>
              <div>
                <p id="sign-in" className={theme === 'dark' ? 'sign-in-dark' : 'sign-in-light'}>{`Sign ${isLogin ? 'in' : 'up'}`} </p>
                <button type="submit"><svg className="arrow" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                  <path fill="#fff" d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
                </svg>
                </button>
              </div>
            </form>
          </div>
          <div style={{position: 'absolute', bottom: '0'}}><Wave /></div>
        </div>
      </div>
    );
}

export default Auth;