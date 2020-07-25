import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { Header,Loader, Divider, Comment, Form, Message, Container, Menu, Breadcrumb, Grid, Label, Button, Image, Confirm, Icon, Dropdown} from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import parse from 'html-react-parser'
import Avatar from 'react-avatar'

import authenticate from '../authenticate'
import { ISSUE_URL, LOGIN_HOME_URL, GET_USER_URL, ALL_PROJECTS_URL, TAG_URL } from '../Const'
import '../css/projects.css'
import '../css/issueDetail.css'
import Error from './error'

class UpdateAssign extends Component{
    constructor(props){
        super(props)
        this.state = {
            userList : [],
            showEdit : false,
            assigned_to_name : [],
            update_assign : [],
        }
    }

    componentDidMount(){
        axios.get(GET_USER_URL)
        .then(response => {
            this.setState({userList: response.data})
            this.props.setLoadError(false, '')
        })
        .catch(err =>{
            const err_code = err.response? err.response.status: ''
            this.props.setLoadError(true, err_code)
        })
        this.setState({assigned_to_name : this.props.issueDetail.assigned_to_name, 
            update_assign : this.props.issueDetail.assigned_to})
    }

    handleAssignChange = (event, {value}) => {
        this.setState({update_assign: value})
    }

    toggleEdit = () => {
        this.setState({showEdit : !this.state.showEdit})
    }

    handleSubmit = (event) => {

        event.preventDefault()

        let data = JSON.stringify({assigned_to:this.state.update_assign})

        this.setState({showEdit:false})

        axios.patch(ISSUE_URL+this.props.issueDetail.id+'/',data, {headers : {'Content-Type':'application/json'}})
        .then(response => {
            this.setState({assigned_to_name:response.data.assigned_to_name})
            this.props.setLoadError(false, '')
        })
        .catch(err => {
            const err_code = err.response? err.response.status: ''
            this.props.setLoadError(true, err_code)
        })
    }

    render(){

        var options = []
        var defaultVal = []

        if(this.state.userList[0]){
            options = this.state.userList.map((user) =>({
                key: user.id,
                text: user.name + ' '+ user.enrollmentNumber,
                value: user.id
            }))
        }

        defaultVal = this.state.update_assign

        let is_team_or_admin = false
        // currently only checking for team_member
        if(this.props.projectDetail.id){
            is_team_or_admin = this.props.projectDetail.team_member.includes(this.props.user.id)
        }

        return(
            <Fragment>
                {is_team_or_admin?
                    <Fragment>
                            <p>
                                <Icon name = 'edit'/>
                                <span className = 'spanPointer' onClick = {this.toggleEdit}>
                                    <span>Add or remove</span>
                                    <Icon name = {this.state.showEdit? 'caret up': 'caret down'}/>
                                </span>

                            </p>
                        {this.state.showEdit? 
                            <Fragment>
                                <Form onSubmit = {this.handleSubmit} >
                                    <Form.Dropdown
                                        name = 'assigned_to'
                                        label = 'Assign issue:'
                                        placeholder='Assign this issue'
                                        multiple
                                        search
                                        selection
                                        options={options}
                                        className = 'input_small'
                                        defaultValue = {defaultVal}
                                        onChange={this.handleAssignChange}
                                    >

                                    </Form.Dropdown>
                                    <Form.Button>Update</Form.Button>
                                </Form>
                                <Divider/>
                            </Fragment>
                        
                            :
                            ''
                        }
                    </Fragment>
                    :
                    ''
                }
                {this.state.assigned_to_name.map((assigned,index) =>(<p key={assigned.id}>{assigned.name}</p>))}
                <Divider/>
            </Fragment>
        )
    }
}

class UpdateTags extends Component{

    constructor(props){
        super(props)
        this.state = {
            tagList : [],
            showEdit : false,
            tag_names : [],
            update_tags: [],
        }
    }

    componentDidMount(){
        axios.get(TAG_URL)
        .then(response => {
            this.setState({tagList: response.data})
            this.props.setLoadError(false, '')
        })
        .catch(err =>{
            const err_code = err.response? err.response.status: ''
            this.props.setLoadError(true, err_code)
        })
        this.setState({tag_names : this.props.issueDetail.tag_name, 
            update_tags : this.props.issueDetail.tag})
    }

    handleAssignChange = (event, {value}) => {
        this.setState({update_tags: value})
    }

    toggleEdit = () => {
        this.setState({showEdit : !this.state.showEdit})
    }

    handleSubmit = (event) => {

        event.preventDefault()

        let data = JSON.stringify({tag:this.state.update_tags})

        this.setState({showEdit:false})

        axios.patch(ISSUE_URL+this.props.issueDetail.id+'/',data, {headers : {'Content-Type':'application/json'}})
        .then(response => {
            this.setState({tag_names:response.data.tag_name})
            this.props.setLoadError(false, '')
        })
        .catch(err => {
            const err_code = err.response? err.response.status: ''
            this.props.setLoadError(true, err_code)
        })
    }

    render(){

        var options = []
        var defaultVal = []

        if(this.state.tagList[0]){
            options = this.state.tagList.map((tag) =>({
                key: tag.id,
                text: tag.tag_name,
                value: tag.id
            }))
        }

        defaultVal = this.state.update_tags

        let is_team_or_admin_or_reporter = false
        // currently only checking for team_member or issue reporter
        if(this.props.projectDetail.id){
            is_team_or_admin_or_reporter = this.props.projectDetail.team_member.includes(this.props.user.id) || this.props.issueDetail.created_by === this.props.user.id
        }

        return(
            <Fragment>
                {is_team_or_admin_or_reporter?
                    <Fragment>
                            <p>
                                <Icon name = 'edit'/>
                                <span className = 'spanPointer' onClick = {this.toggleEdit}>
                                    <span>Add or remove</span>
                                    <Icon name = {this.state.showEdit? 'caret up': 'caret down'}/>
                                </span>

                            </p>
                        {this.state.showEdit? 
                            <Fragment>
                                <Form onSubmit = {this.handleSubmit} >
                                    <Form.Dropdown
                                        name = 'tag'
                                        label = 'Add tags:'
                                        placeholder='Add tags'
                                        multiple
                                        search
                                        selection
                                        options={options}
                                        className = 'input_small'
                                        defaultValue = {defaultVal}
                                        onChange={this.handleAssignChange}
                                    >

                                    </Form.Dropdown>
                                    <Form.Button>Update</Form.Button>
                                </Form>
                                <Divider/>
                            </Fragment>
                        
                            :
                            ''
                        }
                    </Fragment>
                    :
                    ''
                }
                {this.state.tag_names.map(tag =>(<Label key = {tag} color = 'teal'>{tag}</Label>))}
                <Divider/>
            </Fragment>
        )
    }

}

class IssueDetails extends Component {

    constructor(props){
        super(props)
        this.state={
            issueDetail : {issueComments:[], assigned_to_name:[], tag_name:[], issue_media : []},
            comments : [],
            isLoading: true,
            loadError: false,
            error_code: '',
            comment:'',
            ws : null,
            showDelete: false,
            projectDetail : {},
        }
    }

    setLoadError = (val, err_code)=>{
        this.setState({loadError:val, error_code: err_code})
    }

    componentDidMount(){

        authenticate()
        const { id } = this.props.match.params
        let get_issue_details_url = ISSUE_URL+id
        

        axios.get(get_issue_details_url)
        .then(response => {
            if(response.status === 200 && response.data.id){
                this.setState({issueDetail:response.data, isLoading:false})
                this.setState({comments:this.state.issueDetail.issueComments})

                let get_project_details_url = ALL_PROJECTS_URL+response.data.project

                axios.get(get_project_details_url)
                .then(response => {
                    if(response.status === 200 && response.data.id){
                        this.setState({projectDetail: response.data})
                    }
                })
                
                const ws = new WebSocket('ws://localhost:8000/ws/chat/'+id+'/'+this.props.user.token)
                ws.onopen = () =>{
                    console.log('connected')
                }
                ws.onclose = () =>{
                    console.log('disconnected')
                }
                ws.onmessage = evt =>{
                    const message = JSON.parse(evt.data)
                    this.setState({comments: [...this.state.comments,message]})
                }
                this.setState({ws:ws})
            }
            else{
                this.setState({loadError:true})
            }
        })
        .catch(err =>{
            if(err.response && err.response.status === 401){
                window.location.href = LOGIN_HOME_URL
            }
            const err_code = err.response? err.response.status: ''
            this.setState({
                loadError:true,
                isLoading:false, 
                error_code: err_code})
        })

    }



    handleChange = (event) => {
        this.setState({[event.target.name] : event.target.value})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        let data = {
            message:this.state.comment
            }
        this.state.ws.send(JSON.stringify(data))
        this.setState({comment:''})
    }

    handleStatusChange = (event, {value}) => {
        this.setState({isLoading: true})
        let data = JSON.stringify({status:value})
        axios.patch(ISSUE_URL+this.state.issueDetail.id+'/', data, {headers : {'Content-Type':'application/json'}})
        .catch(err => {
            const err_code = err.response? err.response.status: ''
            this.setState({
                loadError:true,
                isLoading:false, 
                error_code: err_code})
        })
    }

    handleTypeChange = (event, {value}) => {
        this.setState({isLoading: true})
        let data = JSON.stringify({issue_type:value})
        axios.patch(ISSUE_URL+this.state.issueDetail.id+'/', data, {headers : {'Content-Type':'application/json'}})
        .catch(err => {
            const err_code = err.response? err.response.status: ''
            this.setState({
                loadError:true,
                isLoading:false, 
                error_code: err_code})
        })
    }

    showDelete  = () => {
        this.setState({showDelete:true})
    }

    handleCancel = () => {
        this.setState({showDelete:false})
    }

    handleConfirm = () => {
        this.setState({isLoading: true})
        this.setState({showDelete:false})
        axios.delete(ISSUE_URL+this.state.issueDetail.id+'/')
        .then(response => {
            window.location.href = '/projects/'+this.state.issueDetail.project
        })
        .catch(err =>{
            const err_code = err.response? err.response.status: ''
            this.setState({
                loadError:true,
                isLoading:false, 
                error_code: err_code})
        })
    }

    render() {

        const issue_type = [
            {
                key:'0',
                text:'Bug',
                value:'bug'
            },
            {
                key:'1',
                text:'Feature Request',
                value:'Feature Request'
            }
        ]

        const media = this.state.issueDetail.issue_media.map(media => (
            <Image src = {media.media} size = 'medium' key = {media.id}/>
        ))

        let is_team_or_admin_or_reporter = false
        // currently only checking for team_member or issue reporter or admin
        if(this.state.projectDetail.id && this.props.user.user){
            is_team_or_admin_or_reporter = this.state.projectDetail.team_member.includes(this.props.user.user.id) || this.state.issueDetail.created_by === this.props.user.user.id || this.props.user.user.is_superuser
        }

        const head = (
            <Fragment>
                <Menu borderless className='projectMenu' >
                    <Menu.Item>
                        <Breadcrumb size = 'large'>
                            <Breadcrumb.Section as = {Link} to='/projects'>Projects</Breadcrumb.Section>
                            <Breadcrumb.Divider icon = 'right angle'/>
                            <Breadcrumb.Section as = {Link} to={'/projects/'+this.state.issueDetail.project}>{this.state.issueDetail.project_name}</Breadcrumb.Section>
                            <Breadcrumb.Divider icon = 'right angle'/>
                            <Breadcrumb.Section>{this.state.issueDetail.heading}</Breadcrumb.Section>
                        </Breadcrumb>
                    </Menu.Item>
                </Menu>
                <Grid columns='two' className = 'projectNameGrid' stackable>
                    <Grid.Row>
                        <Grid.Column width={13}>
                            <Header as = 'h2'>Project: {this.state.issueDetail.project_name}</Header>
                        </Grid.Column>
                        <Grid.Column width = {3} textAlign = 'right' className = 'newIssueGrid'>
                            <Button 
                                className = 'positive_btn'
                                positive
                                as = {Link} 
                                to = {this.state.issueDetail.project? '/projects/'+this.state.issueDetail.project+'/newissue': '/projects'}
                            >
                                Report Issue
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                {/* currently only issue creator is allowed to edit */}
                <Header as = 'h2'>Issue: {this.state.issueDetail.heading}</Header>
                <br/>
                {this.props.user.user? (this.props.user.user.id === this.state.issueDetail.created_by ? (
                    <Fragment>
                        <Icon name = 'trash'/>
                        <span onClick = {this.showDelete} className = 'spanPointer'> Delete Issue</span>
                        <br/><br/>
                        <Confirm
                            open = {this.state.showDelete}
                            content = {'This issue will be deleted. Are you sure?'}
                            cancelButton = 'No'
                            confirmButton = 'Yes'
                            onCancel = {this.handleCancel}
                            onConfirm = {this.handleConfirm}
                        />
                    </Fragment>
                    ) : '')
                    : ''
                }
                <strong>Issue type: </strong>
                <span>
                    {is_team_or_admin_or_reporter?
                        <Dropdown
                            options = {issue_type}
                            defaultValue = {this.state.issueDetail.issue_type}
                            onChange = {this.handleTypeChange}
                        />
                        :
                    this.state.issueDetail.issue_type}
                </span>
                <br/>
                <strong>Issue status: </strong>
                <span>{is_team_or_admin_or_reporter? <Dropdown
                            options = {[
                                {key:'open',text:'Open',value:'O'},
                                {key:'close',text:'Close',value:'C'},
                            ]}
                            defaultValue = {this.state.issueDetail.status}
                            onChange = {this.handleStatusChange}
                        />
                    : this.state.issueDetail.status === 'O'? 'Open' :'Closed'}
                </span>
                <br/>
                <span>{this.state.issueDetail.created_by_name} reported this issue on {(new Date(this.state.issueDetail.created_on)).toDateString()}</span>
                <br/>
                <Message className = 'msg'>
                    <Message.Header>Description</Message.Header>
                    {this.state.issueDetail.description? parse(this.state.issueDetail.description):''}
                    {media}
                </Message>
                <Divider/>
           </Fragment>
        )

        const comments = (
            this.state.comments.map(comment => (
                <Comment key = {comment.id}>
                    <Comment.Avatar as={Avatar} color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])} size = "40" round name = {comment.user_name}/>
                    <Comment.Content>
                        <Comment.Author>{comment.user_name}</Comment.Author>
                        <Comment.Metadata>
                            <div>{(new Date(comment.commented_on)).toDateString()}</div>
                        </Comment.Metadata>
                        <Comment.Text>{comment.commentBody}</Comment.Text>
                        {/* <Comment.Actions>
                            {this.props.user.user?
                                this.props.user.user.id===comment.user? <Comment.Action>Delete</Comment.Action>:''
                                :''
                            }
                        </Comment.Actions> */}
                    </Comment.Content>
                </Comment>                
            ))
        )

        const loading = this.state.isLoading
        const loadError = this.state.loadError

        return(
            <Fragment>
                {loading?<Loader active size='large'>Loading</Loader>:
                    loadError?<Error err_code = {this.state.error_code}/>:
                        <Container>
                            {head}
                            <Grid columns = 'two'>
                                <Grid.Column width={12}>
                                    <Comment.Group>
                                        {comments}
                                    </Comment.Group>
                                    <Form onSubmit = {this.handleSubmit} encType='multipart/form-data'>
                                        <Form.TextArea label='Add a comment' 
                                            placeholder='Comment..' 
                                            name='comment' 
                                            onChange={this.handleChange} 
                                            value = {this.state.comment}/>
                                        <Form.Button as = {Button} className = 'posistive_button' positive>Add comment</Form.Button>
                                    </Form>
                                </Grid.Column>
                                <Grid.Column width = {4}>
                                    <div>
                                        <p><strong>Assigned to:</strong></p>
                                        <UpdateAssign 
                                            user = {this.props.user? this.props.user.user :''} 
                                            projectDetail = {this.state.projectDetail} 
                                            issueDetail = {this.state.issueDetail} 
                                            setLoadError = {this.setLoadError}/>
                                    </div>
                                    <div>
                                        <p><strong>Tags:</strong></p>
                                        <UpdateTags 
                                            user = {this.props.user? this.props.user.user :''} 
                                            projectDetail = {this.state.projectDetail} 
                                            issueDetail = {this.state.issueDetail}
                                            setLoadError = {this.setLoadError}/>
                                    </div>
                                </Grid.Column>
                            </Grid>

                        </Container>
                }
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    user : state.user.item
})

export default connect(mapStateToProps)(IssueDetails)