import React, { Component} from 'react'
import { Menu, Image, Container, Dropdown} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

import { ALL_PROJECTS_URL } from '../Const'
import '../css/navbar.css';

class Search extends Component{
    constructor(props){
        super(props)
        this.state = {
            projects : []
        }
    }
    componentDidMount(){
        axios.get(ALL_PROJECTS_URL)
        .then(response => {
            this.setState({projects:response.data})
        })
    }

    handleSearchChange = (event, {value}) => {
        window.location.href = '/projects/'+value
    }

    render(){

        var projects = []
        projects = this.state.projects.map(project => (
            {
                key : project.id,
                text : project.name,
                value : project.id
            }
        ))

        return(
            <Dropdown
                options = {projects}
                placeholder = 'Search...'
                icon = 'search'
                search
                selection
                onChange = {this.handleSearchChange}
                selectOnBlur = {false}
                />
        )

    }
}

class Navbar extends Component {

    render() {
        
        var options = []

        if(this.props.user.token){
            if(this.props.user.user.is_superuser){
                options = [
                    { key: 'user', as: Link, to:'/myPage',text: 'My page', icon: 'user' },
                    { key: 'admin', as: Link, to:'/adminPanel',text: 'Admin Panel', icon: 'settings'},
                    { key: 'sign-out', as: Link, to:'/logout', text: 'Sign Out', icon: 'sign out', },
                  ]
            }
            else{
                options = [
                    { key: 'user', as: Link, to:'/myPage',text: 'My page', icon: 'user' },
                    { key: 'sign-out', as: Link, to:'/logout', text: 'Sign Out', icon: 'sign out', },
                  ]
            }
            return (
                <Menu
                    className = 'navbar'
                    attached = 'top'
                    stackable
                    borderless
                    style = {{width:'100%'}}
                    inverted
                >
                    <Container>
                        <Menu.Item>
                            <Image
                                size = 'mini'
                                src = {require('../images/logo_inverted.png')}
                            />
                        </Menu.Item>
                        <Menu.Item>
                            <Search />
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item
                                as = {Link}
                                to = '/projects'
                                name = 'home'
                                className = 'inverted_link'
                            />
                            <Menu.Item
                                name = 'about'
                                className = 'inverted_link'
                            />
                            <Dropdown
                                item
                                trigger = {(
                                    <span>
                                        <Image avatar src = {require('../images/user_inverted.svg')}/>
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