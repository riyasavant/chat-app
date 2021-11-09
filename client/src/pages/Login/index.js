import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useSnackbar } from 'react-simple-snackbar'
import Auth from '../../components/Auth';
import axios from 'axios';

function LoginPage() { 

    // Snackbar position
    const options = {
      position: 'bottom-left'
    };

    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, closeSnackbar] = useSnackbar(options);
    const history = useHistory();
  
    function doLogin(e) {
      e.preventDefault();

      setErrorMessage('');

      const form = e.target;
      const user = {
        username: form[0].value,
        password: form[1].value
      };

      openSnackbar('Logging in...', 3000);

      axios.post(process.env.REACT_APP_API_URL + "/auth/login", user, {"Content-type": "application/json"})
      .then(response => {
        openSnackbar(response.data.message, 3000);
        localStorage.setItem("token", response.data.token);
        history.push('/chat');
      })
      .catch(err => {
        openSnackbar('Error Occured', 3000);
        if(err.response && err.response.data) {
          setErrorMessage(err.response.data.message);
        }
      });
    }

    useEffect(() => {
      
      fetch(process.env.REACT_APP_API_URL + "/auth/verifyAuth", {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
      })
      .then(res => res.json())
      .then(data => {
        if(data.isLoggedIn) {
          openSnackbar('Authentication successful');
          history.push('/chat');
        }
      })
      .catch(err => console.log(err));
      
    }, []);

    return (
      <Auth isLogin={true} doSubmit={doLogin} errorMsg={errorMessage}/>
    );
}

export default LoginPage;