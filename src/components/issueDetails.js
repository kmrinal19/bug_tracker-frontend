import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { Header,Loader, Divider, Comment} from 'semantic-ui-react'
import { connect } from 'react-redux'

import authenticate from '../authenticate'
// import { Redirect } from 'react-router-dom'
import { ISSUE_URL, LOGIN_HOME_URL } from '../Const'

class IssueDetails extends Component {

    constructor(props){
        super(props)
        this.state={
            issueDetail : {issueComments:[]},
            isLoading: true
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
                <Divider/>
           </Fragment>
        )

        const comments = (
            this.state.issueDetail.issueComments.map(comment => (
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
                        </Comment.Actions>
                    </Comment.Content>
                </Comment>                
            ))
        )

        const loading = this.state.isLoading
        const loadError = this.state.loadError

        return(
            <div>
                {loading?<Loader active size='large'>Loading</Loader>:''}
                {(loadError)?'Someting went wrong':(
                    <Fragment>
                        {head}
                        <Comment.Group>
                            {comments}
                        </Comment.Group>
                    </Fragment>
                )}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user : state.user.item
})

export default connect(mapStateToProps)(IssueDetails)