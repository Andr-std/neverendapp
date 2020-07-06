import React from "react";
import UserContext from '../../contexts/UserContext';
import { apiBaseUrl } from '../../config';
import { Link } from "react-router-dom";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      email: "",
      password: "",
      authToken: null,
      currentUserId: null,
      firstName: "",
    };
  }

  loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    try {

      const res = await fetch(`${apiBaseUrl}/session/`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) throw res;

      const {
        token,
        user: { id, firstName },
      } = await res.json();

      this.setState(
        { authToken: token, currentUserId: id, firstName },
        () => {
          const { authToken, currentUserId, firstName } = this.state;
          this.props.updateContext(authToken, currentUserId, firstName);
        },
      );
    } catch (err) {
      console.error(err);
    }
  };

  update = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { email, password } = this.state;

    return (
      <div className="login-form-page">
        <form className="loginForm" onSubmit={this.loginUser}>
          <h1 id='header'>Welcome to the world of neverending stories!</h1>
          <img src="quill-175980_960_720.webp" id="bg" alt="" />
          <input id='input1'
            type="email"
            value={email}
            onChange={this.update}
            name="email"
            placeholder="Enter Email"
          />
          <input id='input2'
            type="password"
            value={password}
            onChange={this.update}
            name="password"
            placeholder="Enter Password"
          />

          <button id='input3' type="submit">Log In</button>
          <Link id='input4' to="/register">
            <button id='input5' type="button">Register</button>
          </Link>

          <h2>...to make the short story long</h2>

        </form>
      </div>
    )
  }
}

const LoginFormWithContext = (props) => {
  return (
    <UserContext.Consumer>
      {value => <LoginForm {...props} updateContext={value.updateContext} />}
    </UserContext.Consumer>
  );
}

export default LoginFormWithContext;
