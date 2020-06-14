import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { Header,Loader, Divider, Comment, Form, Message} from 'semantic-ui-react'
import { connect } from 'react-redux'

import authenticate from '../authenticate'
// import { Redirect } from 'react-router-dom'
import { ISSUE_URL, LOGIN_HOME_URL } from '../Const'

class IssueDetails extends Component {

    constructor(props){
        super(props)
        this.state={
            issueDetail : {issueComments:[]},
            comments : [],
            isLoading: true,
            comment:'',
            ws : null
        }
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
            this.setState({loadError:true,isLoading:false })
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

    render() {


        const head = (
            <Fragment>
                <Header as = 'h2'>Project: {this.state.issueDetail.project_name}</Header>
                <br/>
                <Header as = 'h2'>Issue: {this.state.issueDetail.heading}</Header>
                <br/>
                <strong>Issue type: </strong><span>{this.state.issueDetail.issue_type}</span>
                <br/>
                <strong>Issue status: </strong><span>{this.state.issueDetail.status}</span>
                <br/>
                <span>{this.state.issueDetail.created_by_name} reported this issue on {this.state.issueDetail.created_on}</span>
                <br/>
                <Message>
                    <Message.Header>Description</Message.Header>
                    {this.state.issueDetail.description}
                </Message>
                <Divider/>
           </Fragment>
        )

        const comments = (
            this.state.comments.map(comment => (
                <Comment key = {comment.id}>
                    <Comment.Avatar src = {require('../images/user.svg')}/>
                    <Comment.Content>
                        <Comment.Author>{comment.user_name}</Comment.Author>
                        <Comment.Metadata>
                            <div>{comment.commented_on}</div>
                        </Comment.Metadata>
                        <Comment.Text>{comment.commentBody}</Comment.Text>
                        <Comment.Actions>
                            <Comment.Action>Like</Comment.Action>
                            {this.props.user.user?
                                this.props.user.user.id===comment.user? <Comment.Action>Delete</Comment.Action>:''
                                :''
                            }
                        </Comment.Actions>
                    </Comment.Content>
                </Comment>                
            ))
        )

        const loading = this.state.isLoading
        const loadError = this.state.loadError

        return(
            <div>
                {loading?<Loader active size='large'>Loading</Loader>:
                    loadError?'Someting went wrong':
                        <Fragment>
                            {head}
                            <Comment.Group>
                                {comments}
                            </Comment.Group>
                            <Form onSubmit = {this.handleSubmit} encType='multipart/form-data'>
                                <Form.TextArea label='Add a comment' 
                                    placeholder='Comment..' 
                                    name='comment' 
                                    onChange={this.handleChange} 
                                    value = {this.state.comment}/>
                                <Form.Button>Add comment</Form.Button>
                            </Form>
                        </Fragment>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user : state.user.item
})

export default connect(mapStateToProps)(IssueDetails)