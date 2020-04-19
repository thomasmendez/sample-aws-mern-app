import React from "react"
import { 
    Form, 
    Button,
    Container, 
    Row, 
    Col, 
    Jumbotron,
    Alert
} from 'react-bootstrap'
import { 
    validateUsername,
    validatePassword,
    validateConfirmedPassword,
    validateFirstName,
    validateLastName,
} from '../general/validator'
import UserNavbar from '../../components/general/UserNavbar'
import { signup } from '../public/apis/publicApis'
import { corsOptionsPOST } from '../config/config'

class Signup extends React.Component {

    constructor() {
        super()
        this.state = {
            username: "",
            usernameInfoText: "",
            isUsernameValid: null,
            password: "",
            passwordInfoText: "Requires 1 lower, 1 upper, 1 digit, 1 special character, and must be at least 6 characters long",
            isPasswordValid: null,
            confirmedPassword: "",
            confirmedPasswordInfoText: "",
            isConfirmedPasswordValid: null,
            firstName: "",
            firstNameInfoText: "",
            isFirstNameValid: null,
            lastName: "",
            lastNameInfoText: "",
            isLastNameValid: null,
            isFormValid: false,
            errorMessage: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);

        // on change updates state
        // on blur provides good UI/UX

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleUsernameBlur = this.handleUsernameBlur.bind(this);

        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordBlur = this.handlePasswordBlur.bind(this);

        this.handleConfirmedPasswordChange = this.handleConfirmedPasswordChange.bind(this);
        this.handleConfirmedPasswordBlur = this.handleConfirmedPasswordBlur.bind(this);

        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleFirstNameBlur = this.handleFirstNameBlur.bind(this);

        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleLastNameBlur = this.handleLastNameBlur.bind(this);

        this.isFormValid = this.isFormValid.bind(this);
    }

    handleSubmit(event) {

        event.preventDefault()

        fetch(signup(), {
            method: corsOptionsPOST.method, 
            mode: corsOptionsPOST.mode,
            credentials: corsOptionsPOST.credentials,
            headers: { 
                "Content-Type": corsOptionsPOST.headers["Content-Type"],
                "Access-Control-Allow-Origin": corsOptionsPOST.headers["Access-Control-Allow-Origin"],
                "Access-Control-Allow-Methods": corsOptionsPOST.headers["Access-Control-Allow-Methods"],
                "Access-Control-Allow-Credentials": corsOptionsPOST.headers["Access-Control-Allow-Credentials"]
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                confirmedPassword: this.state.confirmedPassword,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
            })
        })
        .then(res => this.processResponse(res))
        .then(res => {
            const { statusCode, data } = res;
            this.processData(statusCode, data)
        })
        .catch(error => {
            console.error("error: " + error);
        });

    }

    processResponse(response) {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]).then(res => ({
          statusCode: res[0],
          data: res[1]
        }));
    }

    processData(statusCode, data) {

        if (statusCode === 200) {
            this.props.history.push('/users')
        }

        else if (statusCode === 409) {
            let formData = data.formData;
            let errorMessage = data.errors.errorMessage
            this.setState({
                username: formData.username,
                password: formData.password,
                confirmedPassword: formData.confirmedPassword,
                firstName: formData.firstName,
                lastName: formData.lastName,
                errorMessage: errorMessage
            }, function () {
                this.isFormValid()
            })

        } else if (statusCode === 422) {
            let formData = data.formData;
            let formErrors = data.formErrors;
            let errorMessage = data.errors.errorMessage;
            this.setState({
                username: formData.username,
                usernameInfoText: formErrors.firstName,
                password: formData.password,
                passwordInfoText: formErrors.password,
                confirmedPassword: formData.confirmedPassword,
                confirmedPasswordInfoText: formErrors.confirmedPassword,
                firstName: formData.firstName,
                firstNameInfoText: formErrors.firstName,
                lastName: formData.lastName,
                lastNameInfoText: formErrors.lastName,
                errorMessage: errorMessage
            }, function () {
                this.isFormValid()
            })

        } else if (statusCode === 500) {
            let formData = data.formData;
            let errorMessage = data.errors.errorMessage
            this.setState({
                username: formData.username,
                password: formData.password,
                confirmedPassword: formData.confirmedPassword,
                firstName: formData.firstName,
                lastName: formData.lastName,
                errorMessage: errorMessage
            }, function () {
                this.isFormValid()
            })
        }
    }

    handleUsernameChange(event) {
        let enteredUsername = event.target.value
        if (enteredUsername === "") {
            this.setState({
                usernameInfoText: "",
                isUsernameValid: false
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validateUsername(enteredUsername)
        if (result.isValid) {
            this.setState({
                username: enteredUsername,
                isUsernameValid: true
            }, function() {
                this.isFormValid()
            })
        } else {
            this.setState({
                username: enteredUsername,
                isUsernameValid: false
            }, function() {
                this.isFormValid()
            })
        }
    }

    handleUsernameBlur(event) {
        let enteredUsername = event.target.value
        if (enteredUsername === "") {
            this.setState({
                usernameInfoText: "",
                isUsernameValid: false
            }, function () {
                this.isFormValid()
            })
            return  
        }
        let result = validateUsername(enteredUsername)
        if (result.isValid) {
            this.setState({
                username: enteredUsername,
                usernameInfoText: result.infoText,
                isUsernameValid: true
            }, function() {
                this.isFormValid()
            })
        } else {
            this.setState({
                username: enteredUsername,
                usernameInfoText: result.infoText,
                isUsernameValid: false
            }, function() {
                this.isFormValid()
            })
        }
    }

    handlePasswordChange(event) {
        let enteredPassword = event.target.value
        if (enteredPassword === "") {
            this.setState({
                passwordInfoText: "Requires 1 lower, 1 upper, 1 digit, 1 special character, and must be at least 6 characters long",
                isPasswordValid: null
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validatePassword(enteredPassword)
        if (result.isValid) {
            this.setState({
                password: enteredPassword,
                passwordInfoText: result.infoText,
                isPasswordValid: true
            }, function() {
                this.isFormValid()
            })
        } else {
            this.setState({
                password: enteredPassword,
                passwordInfoText: "Requires 1 lower, 1 upper, 1 digit, 1 special character, and must be at least 6 characters long",
                isPasswordValid: null
            }, function() {
                this.isFormValid()
            })
        }
    }

    handlePasswordBlur(event) {
        let enteredPassword = event.target.value
        if (enteredPassword === "") {
            this.setState({
                passwordInfoText: "Requires 1 lower, 1 upper, 1 digit, 1 special character, and must be at least 6 characters long",
                isPasswordValid: null
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validatePassword(enteredPassword)
        if (result.isValid) {
            this.setState({
                password: enteredPassword,
                passwordInfoText: result.infoText,
                isPasswordValid: true
            }, function() {
                this.isFormValid()
            })
        } else {
            this.setState({
                password: enteredPassword,
                passwordInfoText: result.infoText,
                isPasswordValid: false
            }, function() {
                this.isFormValid()
            })
        }
    }

    handleConfirmedPasswordChange(event) {
        let enteredConfirmedPassword = event.target.value
        if (enteredConfirmedPassword === "") {
            this.setState({
                confirmedPasswordInfoText: "",
                isConfirmedPasswordValid: false
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validateConfirmedPassword(this.state.password, enteredConfirmedPassword)
        if (result.isValid) {
            this.setState({
                confirmedPassword: enteredConfirmedPassword,
                isConfirmedPasswordValid: true
            }, function() {
                this.isFormValid()
            })
        } else {
            this.setState({
                confirmedPassword: enteredConfirmedPassword,
                isConfirmedPasswordValid: false
            }, function() {
                this.isFormValid()
            })
        }
    }

    handleConfirmedPasswordBlur(event) {
        let enteredConfirmedPassword = event.target.value
        if (enteredConfirmedPassword === "") {
            this.setState({
                confirmedPasswordInfoText: "",
                passwordInfoText: false
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validateConfirmedPassword(this.state.password, enteredConfirmedPassword)
        if (result.isValid) {
            this.setState({
                confirmedPassword: enteredConfirmedPassword,
                confirmedPasswordInfoText: result.infoText,
                isConfirmedPasswordValid: true
            }, function() {
                this.isFormValid()
            })
        } else {
            this.setState({
                confirmedPassword: enteredConfirmedPassword,
                confirmedPasswordInfoText: result.infoText,
                isConfirmedPasswordValid: false
            }, function() {
                this.isFormValid()
            })
        }
    }

    handleFirstNameChange(event) {
        let enteredFirstName = event.target.value
        if (enteredFirstName === "") {
            this.setState({
                firstNameInfoText: "",
                isFirstNameValid: false
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validateFirstName(enteredFirstName)
        if (result.isValid) {
            this.setState({
                firstName: enteredFirstName,
                isFirstNameValid: true
            }, function() {
                this.isFormValid()
            })
        } else {
            this.setState({
                firstName: enteredFirstName,
                isFirstNameValid: false
            }, function() {
                this.isFormValid()
            })
        }
    }

    handleFirstNameBlur(event) {
        let enteredFirstName = event.target.value
        if (enteredFirstName === "") {
            this.setState({
                firstNameInfoText: "",
                isSemesterValid: false
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validateFirstName(enteredFirstName)
        if (result.isValid) {
            this.setState({
                firstName: enteredFirstName,
                firstNameInfoText: result.infoText,
                isFirstNameValid: true
            }, function() {
                this.isFormValid()
            })
        } else {
            this.setState({
                firstName: enteredFirstName,
                firstNameInfoText: result.infoText,
                isFirstNameValid: false
            }, function() {
                this.isFormValid()
            })
        }
    }

    handleLastNameChange(event) {
        let enteredLastName = event.target.value
        if (enteredLastName === "") {
            this.setState({
                enteredLastNameInfoText: "",
                isLastNameValid: false
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validateLastName(enteredLastName)
        if (result.isValid) {
            this.setState({
                lastName: enteredLastName,
                isLastNameValid: true
            }, function() {
                this.isFormValid()
            })
        } else {
            this.setState({
                lastName: enteredLastName,
                isLastNameValid: false
            }, function() {
                this.isFormValid()
            })
        }
    }

    handleLastNameBlur(event) {
        let enteredLastName = event.target.value
        if (enteredLastName === "") {
            this.setState({
                enteredLastNameInfoText: "",
                isLastNameValid: false
            }, function () {
                this.isFormValid()
            })
            return 
        }
        let result = validateLastName(enteredLastName)
        if (result.isValid) {
            this.setState({
                lastName: enteredLastName,
                lastNameInfoText: result.infoText,
                isLastNameValid: true
            }, function() {
                this.isFormValid()
            })
        } else {
            this.setState({
                lastName: enteredLastName,
                lastNameInfoText: result.infoText,
                isLastNameValid: false
            }, function() {
                this.isFormValid()
            })
        }
    }

    isFormValid() {

        if (this.state.isUsernameValid &&
            this.state.isPasswordValid && 
            this.state.isConfirmedPasswordValid &&
            this.state.isFirstNameValid &&
            this.state.isLastNameValid) {
                this.setState({
                    isFormValid: true
                })
        } else {
            this.setState({
                isFormValid: false
            })
        }
    }

    
    render() {

        let headerStyle = {"textAlign":"center"}

        var passwordFormInfoText
        if (this.state.isPasswordValid === false) {
            passwordFormInfoText =  <Form.Text className="text-danger">
                                    {this.state.passwordInfoText}
                                </Form.Text>
        } else {
            passwordFormInfoText =  <Form.Text className="text-muted">
                                    {this.state.passwordInfoText}
                                </Form.Text>
        }

        var alert;

        if (this.state.errorMessage) {
            alert = <Alert variant="danger">
                        {`${this.state.errorMessage}`}
                    </Alert>
        }

        let errorInputStyle = {'borderColor': 'red'}
        let defaultInputStyle = {'borderColor': '#ced4da'}

        var usernameInputStyle;
        var passwordInputStyle;
        var confirmedPasswordInputStyle;
        var firstNameInputStyle;
        var lastNameInputStyle;

        if (this.state.usernameInfoText) {
            usernameInputStyle = errorInputStyle
        } else {
            usernameInputStyle = defaultInputStyle
        }

        if (this.state.passwordInfoText && (this.state.isPasswordValid === false)) {
            passwordInputStyle = errorInputStyle
        } else {
            passwordInputStyle = defaultInputStyle
        }

        if (this.state.confirmedPasswordInfoText) {
            confirmedPasswordInputStyle = errorInputStyle
        } else {
            confirmedPasswordInputStyle = defaultInputStyle
        }

        if (this.state.firstNameInfoText) {
            firstNameInputStyle = errorInputStyle
        } else {
            firstNameInputStyle = defaultInputStyle
        }

        if (this.state.lastNameInfoText) {
            lastNameInputStyle = errorInputStyle
        } else {
            lastNameInputStyle = defaultInputStyle
        }

        return (
            <>
            <UserNavbar></UserNavbar>
            <Container fluid>
                <Row>
                    <Col sm={12}>
                        <Row>
                            <Col md={2}></Col>
                            <Col md={8}>
                                <Jumbotron>
                                      <h2 style={headerStyle}>Sign Up</h2>
                                      {alert}
                                      <Form onSubmit={this.handleSubmit}>
                                        <Col xs={12}>
                                            <Row>
                                                  <Col sm={{span: 6, offset: 3}}>
                                                      <Form.Group controlId="formUsername">
                                                          <Form.Label>Username:</Form.Label>
                                                          <Form.Control 
                                                              required 
                                                              type="text" 
                                                              name="username"
                                                              defaultValue={this.state.username}
                                                              placeholder="Please enter a username"
                                                              onChange={this.handleUsernameChange.bind(this)} 
                                                              onBlur={this.handleUsernameBlur.bind(this)}
                                                              style={usernameInputStyle}
                                                          />
                                                          <Form.Text className="text-danger">
                                                            {this.state.usernameInfoText}
                                                          </Form.Text>
                                                      </Form.Group>
                                                  </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={{span: 6, offset: 3}}>
                                                    <Form.Group controlId="formPassword">
                                                        <Form.Label>Password:</Form.Label>
                                                        <Form.Control 
                                                            required 
                                                            type="password" 
                                                            name="password"
                                                            defaultValue={this.state.password}
                                                            placeholder="Please enter a password"
                                                            onChange={this.handlePasswordChange} 
                                                            onBlur={this.handlePasswordBlur.bind(this)}
                                                            style={passwordInputStyle}
                                                        />
                                                        {passwordFormInfoText}
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={{span: 6, offset: 3}}>
                                                    <Form.Group controlId="formConfirmedPassword">
                                                        <Form.Label>Confirm Password:</Form.Label>
                                                        <Form.Control 
                                                            required 
                                                            type="password" 
                                                            name="confirmedPassword"
                                                            defaultValue={this.state.confirmedPassword}
                                                            placeholder="Please confirm password"
                                                            onChange={this.handleConfirmedPasswordChange} 
                                                            onBlur={this.handleConfirmedPasswordBlur.bind(this)}
                                                            style={confirmedPasswordInputStyle}
                                                        />
                                                        <Form.Text className="text-danger">
                                                            {this.state.confirmedPasswordInfoText}
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={{span: 6, offset: 3}}>
                                                    <Form.Group controlId="formFirstName">
                                                        <Form.Label>First Name:</Form.Label>
                                                        <Form.Control 
                                                            required 
                                                            type="text" 
                                                            name="firstName"
                                                            defaultValue={this.state.firstName}
                                                            placeholder="First name"
                                                            onChange={this.handleFirstNameChange} 
                                                            onBlur={this.handleFirstNameBlur.bind(this)}
                                                            style={firstNameInputStyle}
                                                        />
                                                        <Form.Text className="text-danger">
                                                            {this.state.firstNameInfoText}
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={{span: 6, offset: 3}}>
                                                    <Form.Group controlId="formLastName">
                                                        <Form.Label>Last Name:</Form.Label>
                                                        <Form.Control 
                                                            required 
                                                            type="text" 
                                                            name="lastName"
                                                            defaultValue={this.state.lastName}
                                                            placeholder="Last name"
                                                            onChange={this.handleLastNameChange} 
                                                            onBlur={this.handleLastNameBlur.bind(this)}
                                                            style={lastNameInputStyle}
                                                        />
                                                        <Form.Text className="text-danger">
                                                            {this.state.lastNameInfoText}
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={{span: 6, offset: 3}}>
                                                <Button variant="primary" type="submit" disabled={!this.state.isFormValid}>
                                                    Sign Up
                                                </Button>
                                                    <p className="mt-2 mb-0">Already have an account? <a href="/login">Login here</a></p>
                                                </Col>
                                            </Row>
                                        </Col>
                                      </Form>
                                </Jumbotron>
                            </Col>
                        </Row>
                    </Col>
                </Row>
          </Container>
          </>
        )
    }
}

export default Signup