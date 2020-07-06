import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import authenticate from '../authenticate'
import {GET_USER_URL} from '../Const'
import { Container, Table, Dropdown, Menu, Breadcrumb } from 'semantic-ui-react'
import { Redirect, Link } from 'react-router-dom'

class AdminPanel extends Component {

    _is_mounted = false

    constructor(props){
        super(props)
        this.state = {
            users:[]
        }
    }

    signal = axios.CancelToken.source();

    componentDidMount(){

        authenticate()

        this._is_mounted = true

        axios.get(GET_USER_URL)
        .then(response => {
            if(this._is_mounted){
                this.setState({
                    users : response.data 
                })
            }
        })
        .catch(err => {
            console.log(err)
        })

    }

    componentWillUnmount(){
        this._is_mounted = false
        this.signal.cancel()
    }

    handleStatusChange = (event, {value},user) => {

        let data = JSON.stringify({is_active:value})
        axios.patch(GET_USER_URL+user+'/', data, {headers : {'Content-Type':'application/json'}})
        .then(response => {
            console.log(response.data)
        })
        .catch(err =>{
            console.log(err)
        })
    }

    handleRoleChange = (event, {value},user) => {

        let data = JSON.stringify({is_superuser:value})
        axios.patch(GET_USER_URL+user+'/', data, {headers : {'Content-Type':'application/json'}})
        .then(response => {
            console.log(response.data)
        })
        .catch(err =>{
            console.log(err)
        })
    }

    render() {
        const table = this.state.users.map(user => (
            <Table.Row key = {user.id}>
                <Table.Cell><Link to = {'/user/'+user.id+'/'}>{user.name}</Link></Table.Cell>
                <Table.Cell>
                    <Dropdown
                        options = {[
                            {key:'active',text:'Active',value:true},
                            {key:'disabled',text:'Disabled',value:false},
                        ]}
                        defaultValue = {user.is_active}
                        onChange = {(event, {value}) => this.handleStatusChange(event, {value}, user.id)}
                    />
                </Table.Cell>
                <Table.Cell>
                <Dropdown
                        options = {[
                            {key:'admin',text:'Admin',value:true},
                            {key:'user',text:'User',value:false},
                        ]}
                        defaultValue = {user.is_superuser}
                        onChange = {(event, {value}) => this.handleRoleChange(event, {value}, user.id)}
                    />
                </Table.Cell>
            </Table.Row>
        ))
        if(this.props.user.user){
            if(this.props.user.user.is_superuser === false){
                return(
                    <Redirect to = '/projects'/> 
                )
            }
        }

        return (
            <Container>
                <Menu borderless className='projectMenu' >
                    <Menu.Item>
                        <Breadcrumb size='large'>
                            <Breadcrumb.Section >Users</Breadcrumb.Section>
                        </Breadcrumb>                        
                    </Menu.Item>
                </Menu>
                <Table padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>User</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Role</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {table}
                    </Table.Body>
                </Table>  
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    user : state.user.item
})

export default connect (mapStateToProps)(AdminPanel)