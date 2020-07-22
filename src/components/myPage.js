import React, { Component } from 'react'
import { connect } from 'react-redux'
import Avatar from 'react-avatar'

import authenticate from '../authenticate'
import { Container, Header, Divider, List } from 'semantic-ui-react'
import '../css/myPage.css'
import { Link } from 'react-router-dom'

class MyPage extends Component {
    
    componentDidMount(){
        authenticate()
    }

    render() {
        const user = this.props.user.user
        return (
            <Container>
                <Container textAlign = 'center' className = 'myPageHead'>
                    {/* <Image 
                        src = {require('../images/user.svg')} 
                        size = 'small'
                        centered
                    /> */}
                    <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])} size = "120" round name = {user? user.name :""}/>
                    <Header as = 'h3'>{user?user.name : ''}</Header>
                </Container>
                <Header as = 'h2'>Projects: {user? user.teamMember_of.length :''}</Header>
                <List size = 'big'>
                    {user? user.teamMember_of_name.map(project => (
                                <List.Item key = {project.id}> 
                                    <List.Icon name = 'file code'/>
                                    <List.Content>
                                    <Link to = {'projects/'+project.id}>{project.name}</Link>
                                    </List.Content>
                                </List.Item>
                                ))
                            : ''}
                </List>
                <Divider/>
                <Header as = 'h2'>Reported issue: {user? user.issue_created.length :''}</Header>
                <List size = 'big'>
                    {user? user.issue_created_name.map(issue => (
                                <List.Item key = {issue.id}> 
                                    <List.Icon name = 'file code'/>
                                    <List.Content>
                                    <Link to = {'issue/'+issue.id}>{issue.heading}</Link>
                                    </List.Content>
                                </List.Item>
                                ))
                            : ''}
                </List>
                <Divider/>
                <Header as = 'h2'>Assigned issues: {user? user.assigned_issue.length :''}</Header>
                <List size = 'big'>
                    {user? user.assigned_issue_name.map(issue => (
                                <List.Item key = {issue.id}> 
                                    <List.Icon name = 'file code'/>
                                    <List.Content>
                                    <Link to = {'issue/'+issue.id}>{issue.heading}</Link>
                                    </List.Content>
                                </List.Item>
                                ))
                            : ''}
                </List>
                <Divider/>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    user : state.user.item
})

export default connect(mapStateToProps)(MyPage)