import React from "react"
import { Container, Row, Col } from 'react-bootstrap'
import { Redirect } from "react-router-dom"
import UserNavbar from '../general/UserNavbar'
import Loading from '../general/Loading'
import { usersDirectory } from './apis/publicApis'

class Home extends React.Component {

    constructor() {
        super()
        this.state = {
            users: null,
            message: "",
            isLoading: true
        }
    }

    callAPI() {
        
        fetch(usersDirectory())

            .then(res => this.processResponse(res))
            .then(res => {
                const { statusCode, data } = res;
                this.processData(statusCode, data)
            })
            .catch(error => {
            console.error(error);
        });
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
            case 500:
                this.setState({
                    message: data.message,
                    isLoading: false
                })
                break;
            default:
                console.log("Unregistered status code")
        }
    }
    
    render() {

        if (!this.state.isLoading) {
            if (this.state.users) {

                return (
                    <>
                    <UserNavbar></UserNavbar>
                    <Container fluid>
                        <Row>
                            <Col xs={12}>
                                <h4>Users</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                {this.state.users.map((user, i) => (
                                    <div key={`user-${user.username}`}>
                                        <div>{`${user.firstName} ${user.lastName}`}</div>
                                    </div>
                                ))}
                            </Col>
                        </Row>
                    </Container>
                    </>
                )

            } else {

                let alert;

                if (this.state.message) {
                    alert = <Alert variant="danger">
                                {`${this.state.message}`}
                            </Alert>
                }

                return (
                    <>
                    <UserNavbar></UserNavbar>
                    <Container fluid>
                        <Row>
                            <Col xs={12}>
                                <h4>Users</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                {alert}
                            </Col>
                        </Row>
                    </Container>
                    </>
                )

            }
        } else {
            return (
                <>
                <UserNavbar></UserNavbar>
                <Loading></Loading>
                </>
            )
        }
    }

}

export default Home