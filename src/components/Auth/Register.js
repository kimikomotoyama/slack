import React from "react";
import _ from "lodash";
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formInputs: {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
      },
      errors: [],
    }
  }

  render() {
    const { username, email, password, passwordConfirmation } = this.state.formInputs;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              {this.createFormInput("username", "user", "Username", username, "text")}
              {this.createFormInput("email", "mail", "Email Address", email, "email")}
              {this.createFormInput("password", "lock", "Password", password, "password")}
              {this.createFormInput("passwordConfirmation", "lock", "Password confirmation", passwordConfirmation, "password")}
              <Button color="orange" fluid size="large">Submit</Button>
            </Segment>
          </Form>
          {!_.isEmpty(this.state.errors) ? this.displayErrors() : null}
          <Message>Already a user? <Link to="/login">Login</Link></Message>
        </Grid.Column>
      </Grid>
    );
  }

  createFormInput = (name, icon, placeholder, value, type) => {
    return (
      <Form.Input
        fluid
        name={name}
        icon={icon}
        iconPosition="left"
        placeholder={placeholder}
        onChange={this.handleChange}
        value={value}
        type={type}
      />
    );
  }

  isFormValid = () => {
    const errors = [];
    let error = {};

    if (this.isFormEmpty()) {
      error = { message: "Fill in all fields" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid()) {
      error = { message: "Password is invalid" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      this.setState({ errors: [] });
      return true;
    }
  };

  displayErrors = () => _.map(this.state.errors, (error, i) => <p key={i}>{error.message}</p>);

  isFormEmpty = () => {
    return _.every(this.state.formInputs && this.state.formInputs, formInput => {
      return _.isEmpty(formInput);
    });
  };

  isPasswordValid = () => {
    return (this.state.formInputs.password && this.state.formInputs.passwordConfirmation) &&
      (this.state.formInputs.password === this.state.formInputs.passwordConfirmation) &&
      (this.state.formInputs.password.length > 6 && this.state.formInputs.passwordConfirmation.length > 6);
  };

  handleChange = (event) => {
    this.setState({
      formInputs: {
        ...this.state.formInputs,
        [event.target.name]: event.target.value
      }
    },
      () => console.log(this.state)
    );
  };

  handleSubmit = (event) => {
    if (this.isFormValid()) {
      event.preventDefault();
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.formInputs.email, this.state.formInputs.password)
        .then(createdUser => {
          console.log(createdUser);
        })
        .catch(err => {
          console.log(err);
          this.setState({ errors: [{ message: err.message }] });
        });
    }
  };

}

export default Register;