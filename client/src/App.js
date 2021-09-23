import { Switch, BrowserRouter, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/Chat';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={Login} exact path="/" />
        <Route component={Register} exact path="/register" />
        <Route component={Chat} exact path="/chat"/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;