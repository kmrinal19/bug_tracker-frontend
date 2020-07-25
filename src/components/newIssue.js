import React, { Component, Fragment } from 'react'
import axios from 'axios'
import authenticate from '../authenticate'
import { Header, Form, Dropdown, Container, Menu, Breadcrumb, Loader, Message } from 'semantic-ui-react'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { connect } from 'react-redux'
import { withRouter } from "react-router";
import {Link} from 'react-router-dom'
import {TAG_URL} from '../Const'
import '../css/newIssue.css'
import Error from './error'

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
            tag:[],
            tagList:[],
            loadError:false,
            isLoading:true,
            error_code: '',
            heading_error: false,
        }
    }
    componentDidMount(){
        authenticate()

        const { id } = this.props.match.params

        this.setState({project:id})

        axios.get('http://localhost:8000/tracker/project/'+id)
        .then(response =>{
            if(response.status === 200 && response.data.name){
                this.setState({project_name:response.data.name,
                    isLoading:false,
                    loadError : false
                })
            }
        })
        .catch(err =>{
            const err_code = err.response? err.response.status: ''
            this.setState({
                loadError:true,
                isLoading:false, 
                error_code: err_code})
        })

        axios.get(TAG_URL)
        .then(response =>{
            if(response.status === 200){
                this.setState({tagList: response.data})
            }
        })
        .catch(err =>{
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

    handleImageChange = (event) => {
        this.setState({media:[...event.target.files]})
    }

    handleEditorChange = (event, editor) => {
        this.setState({description : editor.getData()})
    }

    handleDropdownChange = (event, data) => {
        this.setState({issue_type: data.value})
    }

    handleTagChange = (event, {value}) => {
        this.setState({tag: value})
    }

    handleSubmit = (event) => {
        
        event.preventDefault()

        if(this.state.heading === ""){
            this.setState({heading_error:true})
        }

        else{
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

            for(let i = 0; i < (this.state.tag).length; i++){
                formData.append(
                    'tag',
                    this.state.tag[i]
                )
            }
            
            this.setState({isLoading:true})
            axios.post('http://localhost:8000/tracker/issue/', formData )
            .then(res => {
                this.props.history.push('/issue/'+res.data.id)
            })
            .catch(err =>{
                const err_code = err.response? err.response.status: ''
                this.setState({
                    loadError:true,
                    isLoading:false, 
                    error_code: err_code})
            })
        }
        
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

        var tags = []
        if(this.state.tagList[0]){
            tags = this.state.tagList.map(tag => ({
                key : tag.id,
                text : tag.tag_name,
                value : tag.id
            }))
        }

        const head = (
            <Menu borderless className='projectMenu' >
                <Menu.Item>
                    <Breadcrumb size = 'large'>
                        <Breadcrumb.Section as = {Link} to='/projects'>Projects</Breadcrumb.Section>
                        <Breadcrumb.Divider icon = 'right angle'/>
                        <Breadcrumb.Section as = {Link} to={'/projects/'+this.state.project}>{this.state.project_name}</Breadcrumb.Section>
                        <Breadcrumb.Divider icon = 'right angle'/>
                        <Breadcrumb.Section>Report Issue</Breadcrumb.Section>
                    </Breadcrumb>
                </Menu.Item>
            </Menu>
        )

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
                <Form.Input name = 'heading' label='Issue Heading:' type = 'text' onChange={this.handleChange} className='input_medium'/>
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
                        className='input_small'
                    />
                </Form.Field>
                <Form.Field>
                    <label>Upload images:</label>
                    <input name = 'media'type = 'file' multiple onChange = {this.handleImageChange} className='input_small'/>
                </Form.Field>
                <Form.Dropdown
                    name = 'tag'
                    label = 'Tags:'
                    placeholder='Add tags'
                    multiple
                    search
                    selection
                    options={tags}
                    className = 'input_small'
                    onChange = {this.handleTagChange}
                />
                <Form.Button>Create now</Form.Button>
            </Form>

        )

        const loading = this.state.isLoading
        const loadError = this.state.loadError

        return (
            <Fragment>
                {loading? <Loader active size='large'>Loading</Loader>:
                    (loadError)?
                        <Error err_code = {this.state.error_code}/>
                        :
                        <Container>
                            {head}
                            <Header as = 'h2'>Project: {this.state.project_name}</Header>
                            <br/>
                            <Header as = 'h2'>Create a new Issue</Header>
                            {form}
                            <Message 
                                negative 
                                content = "Please enter a valid heading for this issue" 
                                hidden = {!this.state.heading_error}/>
                        </Container>
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
