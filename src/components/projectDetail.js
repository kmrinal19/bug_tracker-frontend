import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { Table, Header, Message, Loader } from 'semantic-ui-react'
import { connect } from 'react-redux'

import authenticate from '../authenticate'
import { Link } from 'react-router-dom'
import { ALL_PROJECTS_URL, LOGIN_HOME_URL } from '../Const'

class ProjectDetail extends Component {

    constructor(props){
        super(props)
        this.state={
            projectDetail : {projectIssues:[]},
            isLoading: true,
            loadError: false
        }
    }

    componentDidMount(){

        authenticate()

        const { id } = this.props.match.params
        let get_project_details_url = ALL_PROJECTS_URL+id

        axios.get(get_project_details_url)
        .then(response => {
            if(response.status === 200 && response.data.id){
                this.setState({projectDetail:response.data, isLoading:false})
            }
            else{
                this.setState({loadError:true})
            }
        })
        .catch(err =>{
            if(err.response && err.response.status === 401){
                window.location.href = LOGIN_HOME_URL
            }
            this.setState({loadError:true,isLoading:false })
        })
    }

    render() {


        const head= (
            <Fragment>
                <Header as = 'h2'>Project: {this.state.projectDetail.name}</Header>
                <br/>
                <Message>
                    <Message.Header>Wiki</Message.Header>
                    {this.state.projectDetail.wiki}
                </Message>
            </Fragment>
        )

        const table = this.state.projectDetail.projectIssues.map(issue => (
            <Table.Row key = {issue.id}>
                <Table.Cell><Link to = {'/issue/'+issue.id}>{issue.heading}</Link></Table.Cell>
                <Table.Cell>{issue.created_by_name}</Table.Cell>
                <Table.Cell>{issue.created_on}</Table.Cell>
                <Table.Cell>{issue.assigned_to_name}</Table.Cell>
                <Table.Cell>{issue.status}</Table.Cell>
            </Table.Row>
        ))

        const loading = this.state.isLoading
        const loadError = this.state.loadError

        return(
            <div>
                {loading?<Loader active size='large'>Loading</Loader>:''}
                {(loadError)?'Someting went wrong':(
                                    <Fragment>
                                    {head}
                                    <Table striped>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>Issue</Table.HeaderCell>
                                                <Table.HeaderCell>Created by</Table.HeaderCell>
                                                <Table.HeaderCell>Created on</Table.HeaderCell>
                                                <Table.HeaderCell>Assigned to</Table.HeaderCell>
                                                <Table.HeaderCell>Status</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {table}
                                        </Table.Body>
                                    </Table> 
                                </Fragment> 
                                )}
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    user : state.user.item
})

export default connect(mapStateToProps)(ProjectDetail)