import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Table } from 'semantic-ui-react'

import authenticate from '../authenticate'
import { Link } from 'react-router-dom'
import { ALL_PROJECTS_URL, LOGIN_HOME_URL } from '../Const'

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
                <Table.Cell>{project.created_on}</Table.Cell>
            </Table.Row>
        ))
        return(
            <Table striped>
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
        )
    }
}

class Projects extends Component {

    componentDidMount(){
        authenticate()
    }
    render() {

        return(
            <Fragment>
                <ProjectTable/>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    user : state.user.item
})

export default connect(mapStateToProps)(Projects)