import React, { Fragment } from 'react'
import { Header, Image, Container, Label, Segment } from 'semantic-ui-react'
import { CLIENT_ID, REDIRECT_URL, GET_ACCESS_CODE_URL } from '../Const'
import authenticate_home from '../authenticate_home'
import '../css/login.css'

const Login = () => {
    authenticate_home()
    return (
        <Fragment>
            <Segment
                textAlign = 'center'
                inverted
                vertical
                className = 'head'
            >
                <Header as = 'h1' inverted className = 'large_header'>
                    <Header.Content >
                        Bug-Tracker
                    </Header.Content>
                    <Image
                        centered
                        className = 'image_head'
                        src = {require('../images/logo_inverted.png')}
                    />
                </Header>
                <Header as = 'h2'
                    inverted
                    content = 'Say NO to messy testing phase'
                    className = 'medium_header'
                    />
                <Label as = 'a'
                        basic
                        size = 'large'
                        href = {GET_ACCESS_CODE_URL+'?client_id='+CLIENT_ID+'&redirect_url='+REDIRECT_URL}
                        className = 'login_btn'
                        >
                        <Image spaced = 'right' src = {require('../images/omniport.ico')}/>
                        Login with omni:port
                </Label>
            </Segment>
        </Fragment>
    )
}
 export default Login