import React from 'react';
import { Link } from 'react-router-dom';
import UserNavbar from '../general/UserNavbar'
class NotFound extends React.Component{
  render() {
      return (
        <>
        <UserNavbar></UserNavbar>
        <h1 style={{textAlign: "center"}}>404 Page Not Found</h1>
        </>
        
      )
  }
}
export default NotFound;