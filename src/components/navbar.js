import React, { Component} from 'react'
// import authenticate from '../authenticate'
import { Menu, Image, Container, Input, Dropdown} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import '../css/navbar.css';

class Navbar extends Component {


    render() {
        
        const options = [
            { key: 'user', as: Link, to:'/projects',text: 'My page', icon: 'user' },
            { key: 'sign-out', as: Link, to:'/logout', text: 'Sign Out', icon: 'sign out', },
          ]

        if(this.props.user.token){
            return (
                <Menu
                    className = 'navbar'
                    attached = 'top'
                    stackable
                    borderless
                    style = {{width:'100%'}}
                >
                    <Container>
                        <Menu.Item>
                            <Image
                                size = 'mini'
                                src = {require('../images/logo.png')}
                            />
                        </Menu.Item>
                        <Menu.Item>
                            <Input icon='search' placeholder='Search...' />
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item
                                as = {Link}
                                to = '/projects'
                                name = 'home'
                            />
                            <Menu.Item
                                name = 'about'
                            />
                            <Dropdown
                                item
                                trigger = {(
                                    <span>
                                        <Image avatar src = {require('../images/user.svg')}/>
                                        {this.props.user.user.name}
                                    </span>
                                )}
                                options = {options}
                                pointing='top left'
                            />                           
                        </Menu.Menu>
                    </Container>
    
                </Menu>
            )
        }

        return('')
    }   
}

const mapStateToProps = (state) => ({
    user : state.user.item
})


export default connect(mapStateToProps)(Navbar)