import React from 'react';
import { Switch, NavLink } from 'react-router-dom';
import { ProtectedRoute, AuthRoute } from './Routes';
import RegistrationForm from './components/session/RegistrationForm';
import LoginForm from './components/session/LoginForm';
import Story from './components/Story';
import Home from './components/Home';
import StoryCreate from './components/StoryCreate';


const App = ({ currentUserId, firstName }) => {

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("currentUserId")
    localStorage.removeItem("firstName")
    window.location.href = `/`
  }
  return (
    <div className='main-app'>


      {/* HEADER */}
      <nav className='header'>
        <h1 id='logo'>NeverEnd</h1>
        {currentUserId ? <h1 id='welcome'>Welcome {`${firstName}`}!</h1> : null}
        {currentUserId ? <h1><NavLink className='link' to='/' id='home'>Home</NavLink></h1> : null}
        {currentUserId ? <h1><NavLink to='/' className='link' id='log' onClick={logout}>Log out</NavLink></h1> : null}
        {currentUserId ? <h1><NavLink className='link' to='/story/create' id='newStory'>New Story</NavLink></h1> : null}
      </nav>
      {/* HEADER END */}

      < Switch >
        <AuthRoute path="/register" component={RegistrationForm} currentUserId={currentUserId} />
        <AuthRoute path="/login" component={LoginForm} currentUserId={currentUserId} />
        <ProtectedRoute path="/story/create" component={StoryCreate} currentUserId={currentUserId} />
        <ProtectedRoute path="/story/:storyId" component={Story} currentUserId={currentUserId} />
        <ProtectedRoute exact path="/" component={Home} currentUserId={currentUserId} />
      </Switch >

      {/* FOOTER */}

      {/* FOOTER END */}
    </div >
  );
};

export default App;
