import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useSnackbar } from 'react-simple-snackbar'

export default function Chat() {

    // Snackbar position
    const options = {
        position: 'bottom-left'
    };

    const history = useHistory();
    const [openSnackbar, closeSnackbar] = useSnackbar(options);

    useEffect(() => {
      
        fetch(process.env.REACT_APP_API_URL + "/auth/verifyAuth", {
          headers: {
            "x-access-token": localStorage.getItem("token")
          }
        })
        .then(res => res.json())
        .then(data => {
            if(!data.isLoggedIn) {
                openSnackbar('Please Login')
                history.push('/');
            }
        })
        .catch(err => console.log(err));
        
      }, []);

    return (
        <div>Chat Page</div>
    )
}