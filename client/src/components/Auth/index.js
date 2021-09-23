import HeaderIcon from '../Icon';
import Wave from '../Wave';
import Typewriter from "../WordAnimation";

import './index.css';

function Auth({ isLogin, doSubmit, errorMsg }) {  
    return (
      <div id="login">
        <HeaderIcon />
        <div id="msg">
          <p id="desc">
            <Typewriter />
          </p> 
          <span id="messenger">Messenger</span> 
        </div>
        {/* User details */}
        <div id="credentials">  
          <form onSubmit={event => doSubmit(event)}>
            <div id="usr-opt">
              <p id="new-user">{`${isLogin ? 'New' : 'Existing'} User?`} <span id="reg">{`${isLogin ? 'Register' : 'Login'}`}</span></p>
            </div>
            <input type="text" placeholder="Username"/>
            <input type="password" placeholder="Password"/>
            <p className="error">{errorMsg}</p>
            <div>
              <p id="sign-in">{`Sign ${isLogin ? 'in' : 'up'}`} </p>
              <button type="submit"><svg className="arrow" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                <path fill="#fff" d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
              </svg>
              </button>
            </div>
          </form>
        </div>
        {/* Footer */}
        <Wave />
      </div>
    );
}

export default Auth;