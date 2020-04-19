import React from "react"
import { Container, Row, Col, Button, Alert } from 'react-bootstrap'
import UserNavbar from '../general/UserNavbar'
import Loading from '../general/Loading'
import BasicTable from './general/BasicTable'
import { usersDirectory, deleteUser } from './apis/privateApis'
import { corsOptionsGET, corsOptionsPOST } from '../config/config'

class Home extends React.Component {

    constructor() {
        super()
        this.state = {
            users: [],
            isLoading: true
        }
        this.onDeleteClick = this.onDeleteClick.bind(this)
    }

    callAPI() {

        fetch(usersDirectory(), {
            method: corsOptionsGET.method, 
            mode: corsOptionsGET.mode,
            credentials: corsOptionsGET.credentials,
            headers: { 
                "Content-Type": corsOptionsGET.headers["Content-Type"],
                "Access-Control-Allow-Origin": corsOptionsGET.headers["Access-Control-Allow-Origin"],
                "Access-Control-Allow-Methods": corsOptionsGET.headers["Access-Control-Allow-Methods"],
                "Access-Control-Allow-Credentials": corsOptionsGET.headers["Access-Control-Allow-Credentials"]
            }
        })
        .then(res => this.processResponse(res))
        .then(res => {
            const { statusCode, data } = res;
            this.processData(statusCode, data)
        })
        .catch(error => {
            console.error(error);
        })
    }

    componentDidMount() {
      this.callAPI();
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
        switch(statusCode) {
            case 200:
                var users = []
                for (var i = 0; i < data.users.length; i++) {
                    users.push(data.users[i])
                }
                this.setState({
                    users: users,
                    isLoading: false
                })
                break;
            case 401:
                this.props.history.push('/login')
                break;
            default:
                console.log("Unregistered status code")

        }
    }

    onDeleteClick(userID) {
    
        // send the response to the server 
        fetch(deleteUser(), {
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
                userID: userID
            })
        })
        .then(res => this.processResponse(res))
        .then(res => {
            const { statusCode, data } = res;
            this.processDeleteAssignment(statusCode, data)
        })
        .catch(error => {
            console.error(error);
        });

    }

    processDeleteAssignment(statusCode, data) {

        var message;

        switch(statusCode) {
            case 200: 
                message = data.message
                var users = []
                for (var i = 0; i < data.users.length; i++) {
                    users.push(data.users[i])
                }
                this.setState({
                    users: users,
                    message: message,
                    isErrorMessage: false
                })
                break;
            case 401:
                this.props.history.push('/login')
                break;

            case 500:
                message = data.message
                this.setState({
                    message: message,
                    isErrorMessage: true
                })
                break;
            default: 
                console.log("unregistered status code")
        }

    }
    
    render() {

        if (!this.state.isLoading) {
            if (this.state.users.length) {

                var alert;

                if (this.state.isErrorMessage == true) {
                    alert = <Alert variant="danger">
                                {`${this.state.message}`}
                            </Alert>
                } else if (this.state.isErrorMessage == false) {
                    alert = <Alert variant="success">
                                {`${this.state.message}`}
                            </Alert>
                }

                let title = "Users"
                let tableHeaders = ["Username", "Full Name", "Options"]
                var tableData = []
                var rowData = {}

                {this.state.users.map((user, i) => (

                    rowData = <>
                                <td>
                                    {user.username}
                                </td>
                                <td>
                                    {`${user.firstName} ${user.lastName}`}
                                </td>
                                <td>
                                    <Button variant="danger" onClick={this.onDeleteClick.bind(this, user._id)}>Delete</Button>
                                </td>
                              </>,

                    tableData.push(rowData)

                ))}

                return (
                    <>
                    <UserNavbar></UserNavbar>
                    <Container>
                        {alert}
                        <BasicTable title={title} tableHeaders={tableHeaders} tableData={tableData}/>
                    </Container>
                    </>
                )

            } else {

                let title = "Users"
                let tableHeaders = ["First Name", "Last Name", "Options"]
                var tableData = []
                var rowData = {}

                return (
                    <>
                    <UserNavbar></UserNavbar>
                    <Container>
                        <BasicTable title={title} tableHeaders={tableHeaders} tableData={tableData}/>
                    </Container>
                    </>
                )

            }
        } else {
            return (
                <Loading></Loading>
            )
        }
    }

}

export default Home