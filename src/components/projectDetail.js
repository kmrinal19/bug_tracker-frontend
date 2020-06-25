import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { Table, Header, Message, Loader, Breadcrumb, Container, Menu, Grid, Button, Image, Dropdown, Label, Icon, Confirm} from 'semantic-ui-react'
import { connect } from 'react-redux'
import parse from 'html-react-parser'
import authenticate from '../authenticate'
import { Link } from 'react-router-dom'
import { ALL_PROJECTS_URL, LOGIN_HOME_URL } from '../Const'
import '../css/projects.css'
import '../css/projectDetail.css'

function IssueTable (props){

    const table = props.projectIssues.map(issue => (
        <Table.Row key = {issue.id}>
            <Table.Cell>
                <Link to = {'/issue/'+issue.id}>{issue.heading}</Link>&nbsp;
                {issue.tag_name.map(tag =>(<Label color = 'teal' horizontal  key = {tag}>{tag}</Label>))}
            </Table.Cell>
            <Table.Cell>{issue.created_by_name}</Table.Cell>
            <Table.Cell>{(new Date(issue.created_on)).toDateString()}</Table.Cell>
            <Table.Cell>{issue.assigned_to_name.map(assigned => (<span key={assigned.id}>{assigned.name}  </span>))}</Table.Cell>
            <Table.Cell>{issue.status === 'O'? 'Open' : 'Close'}</Table.Cell>
        </Table.Row>
    ))

    return(
        <Table fixed padded>
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
    )

}

class Issues extends Component{
    constructor(props){
        super(props)
        this.state={
            displayIssues:this.props.projectDetail.projectIssues,
        }
    }

    handleChage = (event, {value}) => {
        switch(value){
            case 'ALL':
                this.setState({
                    displayIssues:this.props.projectDetail.projectIssues
                })
                break

            case 'OPEN':
                let openIssue = []
                for (let i = 0; i < this.props.projectDetail.projectIssues.length; i++){
                    let issue = this.props.projectDetail.projectIssues[i]
                    if(issue.status === 'O'){
                        openIssue = [...openIssue, issue]
                    }
                }
                this.setState({
                    displayIssues: openIssue
                })
                break

            case 'CLOSE':
                let closeIssue = []
                for (let i = 0; i < this.props.projectDetail.projectIssues.length; i++){
                    let issue = this.props.projectDetail.projectIssues[i]
                    if(issue.status === 'C'){
                        closeIssue = [...closeIssue, issue]
                    }
                }
                this.setState({
                    displayIssues: closeIssue
                })
                break

            default:
                this.setState({
                    displayIssues:this.props.projectDetail.projectIssues
                })  
        }
        
    }

    render(){
        const issueOptions = [
            {
                key : 'all',
                text : 'All',
                value : 'ALL'
            },
            {
                key : 'open',
                text : 'Open',
                value : 'OPEN'
            },
            {
                key : 'close',
                text : 'Close',
                value : 'CLOSE'
            }

        ]
        
        return(
            <Fragment>
                <Menu borderless className='projectMenu' >
                    <Menu.Item>
                        <span>Issues:&nbsp;</span>
                        <Dropdown inline
                            options = {issueOptions}
                            defaultValue = {issueOptions[0].value}
                            onChange = {this.handleChage}
                        />
                        <span> :{this.state.displayIssues.length}</span>
                    </Menu.Item>
                    <Menu.Menu position = 'right'>
                        <Menu.Item
                                as = {Link}
                                to={'/projects/'+this.props.projectDetail.id+'/newissue/'}
                                content='Report Issue' 
                                icon='add' 
                            />
                    </Menu.Menu>
                </Menu>
                <IssueTable projectIssues = {this.state.displayIssues}/>
            </Fragment>
        )
    }
}

class Wiki extends Component{
    constructor(props){
        super(props)
        this.state={
            isHidden:true
        }
    }

    handleClick = () => {
        this.setState({
            isHidden: !this.state.isHidden
        })
    }

    render(){

        var media = this.props.media.map(image =>(
            <Image src = {image.media} size = 'medium' key = {image.id}/>
        ))

        return(
            <Fragment>
                {this.state.isHidden?(
                        <Button basic color='blue' size = 'small' onClick = {this.handleClick}>Show wiki</Button>
                    ):(
                        <Fragment>
                            <Message>
                                <Message.Header>Wiki</Message.Header>
                                {this.props.wiki? parse(this.props.wiki):''}
                                {media}
                            </Message>
                            <Button basic color='blue' size = 'small' onClick = {this.handleClick}>Hide wiki</Button>
                        </Fragment>
                        )
                }
            </Fragment>

        )
    }
}

class ProjectDetail extends Component {

    constructor(props){
        super(props)
        this.state={
            projectDetail : {
                    projectIssues:[],
                    project_media: []
                },
            isLoading: true,
            loadError: false,
            showDelete : false,
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

    showDelete  = () => {
        this.setState({showDelete:true})
    }

    handleCancel = () => {
        this.setState({showDelete:false})
    }

    handleConfirm = () => {
        this.setState({showDelete:false})
        axios.delete(ALL_PROJECTS_URL+this.state.projectDetail.id)
        .then(response => {
            window.location.href = '/projects'
        })
        .catch(err =>{
            console.log(err)
        })
    }

    render() {

        const head= (
            <Fragment>
                <Menu borderless className='projectMenu' >
                    <Menu.Item>
                        <Breadcrumb size = 'large'>
                            <Breadcrumb.Section as = {Link} to='/projects'>Projects</Breadcrumb.Section>
                            <Breadcrumb.Divider icon = 'right angle'/>
                            <Breadcrumb.Section>{this.state.projectDetail.name}</Breadcrumb.Section>
                        </Breadcrumb>
                    </Menu.Item>
                </Menu>
                <Header as = 'h2'>{this.state.projectDetail.name}</Header>
                {/* currently only project creator is allowed to edit */}
                {this.props.user.user? (this.props.user.user.id === this.state.projectDetail.created_by ? (
                    <Fragment>
                        <Icon name = 'edit'/>
                        <Link to = {'/projects/'+this.state.projectDetail.id+'/editProject'}> Edit Project</Link>
                        <Icon name = 'trash' style = {{marginLeft:20}}/>
                        <span onClick = {this.showDelete} className = 'spanPointer'> Delete Project</span>
                        <br/><br/>
                        <Confirm
                            open = {this.state.showDelete}
                            content = {this.state.projectDetail.name+' will be deleted. Are you sure?'}
                            cancelButton = 'No'
                            confirmButton = 'Yes'
                            onCancel = {this.handleCancel}
                            onConfirm = {this.handleConfirm}
                        />
                    </Fragment>
                    ) : '')
                    : ''
                }
                <Grid columns='three'>
                    <Grid.Row>
                        <Grid.Column>
                            <strong>Created by: </strong>{this.state.projectDetail.created_by_name}
                        </Grid.Column>
                        <Grid.Column>
                            <strong>Created on: </strong>{(new Date(this.state.projectDetail.created_on)).toDateString()}
                        </Grid.Column>
                        <Grid.Column>
                            <strong> Issues: </strong>{(this.state.projectDetail.projectIssues).length}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <strong> Team members: </strong>{this.state.projectDetail.team_member_name?(this.state.projectDetail.team_member_name).join(', '):''}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <br/>
                <Wiki wiki = {this.state.projectDetail.wiki} media = {this.state.projectDetail.project_media}/>
                <br/>
            </Fragment>
        )

        const loading = this.state.isLoading
        const loadError = this.state.loadError

        return(
            <Container>
                {loading?<Loader active size='large'>Loading</Loader>:
                (loadError)?'Someting went wrong':
                    <Fragment>
                        {head}
                        <Issues projectDetail = {this.state.projectDetail}/>
                    </Fragment> 
                }
            </Container>
        )
    }

}

const mapStateToProps = (state) => ({
    user : state.user.item
})


export default connect(mapStateToProps)(ProjectDetail)