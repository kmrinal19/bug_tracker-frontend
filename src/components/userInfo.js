import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Container, Header, Divider, List, Menu, Breadcrumb, Loader } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import Avatar from 'react-avatar'

import {GET_USER_URL} from '../Const'
import authenticate from '../authenticate'
import Error from './error'

class UserInfo extends Component {

    constructor(props){
        super(props)
        this.state = {
            userDetails : {},
            isLoading: true,
            loadError: false,
            error_code: '',
        }
    }

    componentDidMount(){
        authenticate()
        const { id } = this.props.match.params
        axios.get(GET_USER_URL+id+'/')
        .then(response => {
            this.setState({
                userDetails:response.data,
                isLoading: false,
                loadError:false
            })
        })
        .catch(err => {
            const err_code = err.response? err.response.status: ''
            this.setState({
                loadError:true,
                isLoading:false, 
                error_code: err_code})
        })
    }

    render() {

        const user = this.state.userDetails

        const loading = this.state.isLoading
        const loadError = this.state.loadError

        return (
            <Fragment>
                {loading?<Loader active size='large'>Loading</Loader>:
                    loadError?<Error err_code = {this.state.error_code}/>:
                    <Container>
                        <Menu borderless className='projectMenu' >
                            <Menu.Item>
                                <Breadcrumb size='large'>
                                    <Breadcrumb.Section as = {Link} to = {'/adminPanel'}>Users</Breadcrumb.Section>
                                    <Breadcrumb.Divider icon = 'right angle'/>
                                    <Breadcrumb.Section>{user.name}</Breadcrumb.Section>
                                </Breadcrumb>                        
                            </Menu.Item>
                        </Menu>
                        <Container textAlign = 'center' className = 'myPageHead'>
                            {/* <Image 
                                src = {require('../images/user.svg')} 
                                size = 'small'
                                centered
                            /> */}
                            <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])} size = "120" round name = {user? user.name :""}/>
                            <Header as = 'h3'>{user.name?user.name : ''}</Header>
                        </Container>
                        <Header as = 'h2'>Projects: {user.teamMember_of? user.teamMember_of.length :''}</Header>
                        <List size = 'big'>
                            {user.teamMember_of_name? user.teamMember_of_name.map(project => (
                                        <List.Item key = {project.id}> 
                                            <List.Icon name = 'file code'/>
                                            <List.Content>
                                            <Link to = {'/projects/'+project.id}>{project.name}</Link>
                                            </List.Content>
                                        </List.Item>
                                        ))
                                    : ''}
                        </List>
                        <Divider/>
                        <Header as = 'h2'>Reported issue: {user.issue_created? user.issue_created.length :''}</Header>
                        <List size = 'big'>
                            {user.issue_created_name? user.issue_created_name.map(issue => (
                                        <List.Item key = {issue.id}> 
                                            <List.Icon name = 'file code'/>
                                            <List.Content>
                                            <Link to = {'/issue/'+issue.id}>{issue.heading}</Link>
                                            </List.Content>
                                        </List.Item>
                                        ))
                                    : ''}
                        </List>
                        <Divider/>
                        <Header as = 'h2'>Assigned issues: {user.assigned_issue? user.assigned_issue.length :''}</Header>
                        <List size = 'big'>
                            {user.assigned_issue_name? user.assigned_issue_name.map(issue => (
                                        <List.Item key = {issue.id}> 
                                            <List.Icon name = 'file code'/>
                                            <List.Content>
                                            <Link to = {'/issue/'+issue.id}>{issue.heading}</Link>
                                            </List.Content>
                                        </List.Item>
                                        ))
                                    : ''}
                        </List>
                        <Divider/>
                    </Container>
                }
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    user : state.user.item
})

export default connect(mapStateToProps)(UserInfo)