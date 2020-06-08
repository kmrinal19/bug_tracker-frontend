import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Table, Breadcrumb, Container, Menu } from 'semantic-ui-react'
import { withRouter } from "react-router"

import authenticate from '../authenticate'
import { Link } from 'react-router-dom'
import { ALL_PROJECTS_URL, LOGIN_HOME_URL } from '../Const'
import '../css/projects.css'

class ProjectTable extends Component{
    constructor(props){
        super(props)
        this.state={
            table_data : [],
            isLoading: true
        }
    }

    componentDidMount(){
        axios.get(ALL_PROJECTS_URL)
        .then(response => {
            if(response.status === 200){
                this.setState({table_data:response.data,isLoading:false})
            }
        })
        .catch(err =>{
            if(err.response && err.response.status === 401){
                window.location.href = LOGIN_HOME_URL
            }
            this.setState({loadError:true,isLoading:false })
        })
    }

    render(){
        const table =this.state.table_data.map(project => (
            <Table.Row key = {project.id}>
                <Table.Cell><Link to ={'/projects/'+project.id}>{project.name}</Link></Table.Cell>
                <Table.Cell>{project.created_by_name}</Table.Cell>
                <Table.Cell>{(new Date(project.created_on)).toDateString()}</Table.Cell>
            </Table.Row>
        ))
        return(
            <Fragment>
                <Table padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Project</Table.HeaderCell>
                            <Table.HeaderCell>Created by</Table.HeaderCell>
                            <Table.HeaderCell>Created on</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {table}
                    </Table.Body>
                </Table>  
            </Fragment>
  
        )
    }
}

class Projects extends Component {

    componentDidMount(){
        authenticate()
    }
    render() {

        return(
            <Container>
                <Menu borderless className='projectMenu' >
                    <Menu.Item>
                        <Breadcrumb size='large'>
                            <Breadcrumb.Section as = {Link} to='/projects'>Projects</Breadcrumb.Section>
                        </Breadcrumb>                        
                    </Menu.Item>
                    <Menu.Menu position = 'right'>
                        <Menu.Item
                                content='Create Project' 
                                icon='add' 
                                onClick = {() => {this.props.history.push('/newproject')}}
                            />
                    </Menu.Menu>
                </Menu>
                <ProjectTable/>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    user : state.user.item
})

withRouter(Projects)

export default connect(mapStateToProps)(Projects)