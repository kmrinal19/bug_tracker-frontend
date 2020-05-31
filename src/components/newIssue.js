import React, { Component, Fragment } from 'react'
import axios from 'axios'
import authenticate from '../authenticate'
import { Header, Form, Dropdown } from 'semantic-ui-react'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { connect } from 'react-redux'
import { withRouter } from "react-router";

class NewIssue extends Component {
    constructor(props){
        super(props)
        this.state = {
            heading: '',
            description : '',
            project : null,
            issue_type:'',
            media:[],
            project_name : '',
            loadError:false
        }
    }
    componentDidMount(){
        authenticate()

        const { id } = this.props.match.params

        this.setState({project:id})

        axios.get('http://localhost:8000/tracker/project/'+id)
        .then(response =>{
            if(response.status === 200 && response.data.name){
                this.setState({project_name:response.data.name})
            }
        })
        .catch(err =>{
            this.setState({loadError:true})
        })
    }
    
    handleChange = (event) => {
        this.setState({[event.target.name] : event.target.value})
    }

    handleImageChange = (event) => {
        this.setState({media:[...event.target.files]})
    }

    handleEditorChange = (event, editor) => {
        this.setState({description : editor.getData()})
    }

    handleDropdownChange = (event, data) => {
        this.setState({issue_type: data.value})
    }

    handleSubmit = (event) => {
        
        event.preventDefault()

        let formData = new FormData()

        formData.append(
            'heading',
            this.state.heading
        )

        formData.append(
            'issue_type',
            this.state.issue_type
        )

        formData.append(
            'description',
            this.state.description
        )

        formData.append(
            'project',
            this.state.project
        )

        for(let i = 0; i < (this.state.media).length; i++){
            formData.append(
                'media'+i,
                this.state.media[i]
            )
        }
        

        axios.post('http://localhost:8000/tracker/issue/', formData )
        .then(res => {
            this.props.history.push('/issue/'+res.data.id)
        })
        .catch(err =>{
            console.log(err)
        })
        
    }

    render() {

        const issue_type = [
            {
                key:'0',
                text:'Bug',
                value:'Bug'
            },
            {
                key:'1',
                text:'Feature Request',
                value:'Feature Request'
            }
        ]

        const ckeditor = (
            <CKEditor
                editor={ ClassicEditor }
                onChange = {this.handleEditorChange}
                config={{  
                    placeholder:'Describe the issue',       
                    toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'insertTable',
                        'tableColumn', 'tableRow', 'mergeTableCells', '|', 'undo', 'redo']
                }}     
            />
        )

        const form = (
            <Form onSubmit = {this.handleSubmit} encType='multipart/form-data'>
                <Form.Input name = 'heading' label='Issue Heading:' type = 'text' onChange={this.handleChange} />
                <Form.Field>
                    <label>Description:</label>
                    {ckeditor}
                </Form.Field>
                <Form.Field>
                    <Dropdown
                        name = 'issue_type'
                        placeholder = 'Issue Type'
                        selection
                        options = {issue_type}
                        onChange={this.handleDropdownChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Upload images:</label>
                    <input name = 'media'type = 'file' multiple onChange = {this.handleImageChange}/>
                </Form.Field>
                <Form.Button>Create now</Form.Button>
            </Form>

        )

        return (
            <Fragment>
                {this.state.loadError?
                    <div>Something went wrong</div>
                    :
                    <Fragment>
                    <Header as = 'h2'>Project: {this.state.project_name}</Header>
                    <br/>
                    <Header as = 'h2'>Create a new Issue</Header>
                    {form}
                </Fragment>
                }
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    user : state.user.item
})

withRouter(NewIssue)

export default connect(mapStateToProps)(NewIssue)
