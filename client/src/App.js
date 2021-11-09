import { useState } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import SnackbarProvider from 'react-simple-snackbar'
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/Chat';
import { ThemeContext } from "./config/context/themeContext";

function App() {

  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
        <SnackbarProvider>
          <BrowserRouter>
            <Switch>
              <Route component={Login} exact path="/" />
              <Route component={Register} exact path="/register" />
              <Route component={Chat} exact path="/chat"/>
            </Switch>
          </BrowserRouter>
        </SnackbarProvider>
    </ThemeContext.Provider>
  );
}

export default App;