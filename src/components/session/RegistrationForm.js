import React from 'react';
import UserContext from '../../contexts/UserContext';
import { apiBaseUrl } from '../../config';

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      email: "",
      password: "",
      confPassword: "",
      authToken: null,
      currentUserId: null,
    };
  }

  registerUser = async (e) => {
    e.preventDefault();
    const { userName, confPassword, password, firstName, lastName, email, bio } = this.state;

    try {
      const res = await fetch(`${apiBaseUrl}/user/`, {
        method: "POST",
        body: JSON.stringify({ userName, confPassword, password, firstName, lastName, email, bio }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw res;

      const {
        token,
        user: { id },
      } = await res.json();

      this.setState(
        { authToken: token, currentUserId: id },
        () => {
          const { authToken, currentUserId } = this.state;
          this.props.updateContext(authToken, currentUserId, firstName);
        },
      );
    } catch (err) {
      console.error(err);
    }
    window.location.href = `/`
  };

  update = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { userName, password, confPassword, firstName, lastName, email, bio } = this.state;

    return (
      <div className="reg-form-page">
        <h1 id='header2'>Register</h1>
        <form className="regForm" onSubmit={this.registerUser}>

          <img src="quill-175980_960_720.webp" id="bg" alt="" />

          <input id="input7"
            type="text"
            value={userName}
            onChange={this.update}
            name="userName"
            placeholder="Enter Username"
          />
          <input id="input8"
            type="password"
            value={password}
            onChange={this.update}
            name="password"
            placeholder="Enter Password"
          />
          <input id="input9"
            type="password"
            value={confPassword}
            onChange={this.update}
            name="confPassword"
            placeholder="Confirm Password"
          />
          <input id="input10"
            type="text"
            value={firstName}
            onChange={this.update}
            name="firstName"
            placeholder="Enter First Name"
          />
          <input id="input11"
            type="text"
            value={lastName}
            onChange={this.update}
            name="lastName"
            placeholder="Enter Last Name"
          />
          <input id="input12"
            type="email"
            value={email}
            onChange={this.update}
            name="email"
            placeholder="Enter Email"
          />
          <input id="input13"
            type="text"
            value={bio}
            onChange={this.update}
            name="bio"
            placeholder="Enter Biography"
          />

          <button id="input14" type="submit">Sign Up</button>

        </form>
        <h2 className="subHeading">...to make the short story long</h2>
      </div>
    );
  }
}

const RegistrationFormWithContext = (props) => {
  return (
    <UserContext.Consumer>
      {value => <RegistrationForm {...props} updateContext={value.updateContext} />}
    </UserContext.Consumer>
  );
}

export default RegistrationFormWithContext;
