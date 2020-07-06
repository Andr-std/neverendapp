import React from 'react';
import UserContext from './contexts/UserContext';
import App from './App';

class AppWithContext extends React.Component {
  constructor() {
    super();
    this.state = {
      authToken: localStorage.getItem('authToken'),
      currentUserId: localStorage.getItem('currentUserId'),
      firstName: localStorage.getItem('firstName'),
      updateContext: this.updateContext,
    };
  }

  updateContext = (authToken, currentUserId, firstName) => {
    this.setState(
      { authToken, currentUserId, firstName },
      () => {
        localStorage.setItem('authToken', authToken)
        localStorage.setItem('currentUserId', currentUserId)
        localStorage.setItem('firstName', firstName)
      },
    );
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        <App currentUserId={this.state.currentUserId} firstName={this.state.firstName} />
      </UserContext.Provider>
    );
  }
}

export default AppWithContext;
