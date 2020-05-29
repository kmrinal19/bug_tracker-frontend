import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import queryString from 'query-string'

import { loginUser } from '../actions/userActions'

class Auth extends Component{
    componentDidMount(){
        let values = queryString.parse(this.props.location.search)
        this.props.loginUser(values.code)
    }
    render(){
        localStorage.setItem('token', this.props.user.token )
        let auth_data = this.props.user.err ? <Redirect to = '/'/> : this.props.user.token 
        return (
            <div>
                {auth_data}
                {/* <Redirect to = '/home'>Home</Redirect> */}
                <Link to = '/projects'>Projcts</Link>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user : state.user.item
})

export default connect(mapStateToProps, { loginUser })(Auth)