import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Table } from 'semantic-ui-react'

import authenticate from '../authenticate'
import { Redirect } from 'react-router-dom'
import { AUTHENTICATION_FAILED, ALL_PROJECTS_URL } from '../Const'

class ProjectTable extends Component{
    constructor(props){
        super(props)
        this.state={
            table_data : []
        }
    }

    componentDidMount(){
        axios.get(ALL_PROJECTS_URL)
        .then(response => {
            if(response.status === 200){
                this.setState({table_data:response.data})
            }
        })
    }


    render(){
        const td =this.state.table_data.map(project => (
            <Table.Row key = {project.id}>
                <Table.Cell>{project.name}</Table.Cell>
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
                    {td}
                </Table.Body>
            </Table>    
        )
    }
}

class Projects extends Component {
    render() {
        let token = authenticate()

        if(token){
            return(
                <Fragment>
                    <ProjectTable/>
                </Fragment>
            )
        }

        else if(token === AUTHENTICATION_FAILED){
            return <Redirect to = '/'/>
        }

        else{
            return <div>Loading...</div>
        }
    }
}

const mapStateToProps = (state) => ({
    user : state.user.item
})

export default connect(mapStateToProps)(Projects)