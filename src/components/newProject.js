import React, { Component, Fragment } from 'react'
import axios from 'axios'
import authenticate from '../authenticate'
import { Header, Form, Container, Menu, Breadcrumb, Loader, Message } from 'semantic-ui-react'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { connect } from 'react-redux'
import { withRouter } from "react-router";
import { Link } from 'react-router-dom'
import {GET_USER_URL} from '../Const'
import '../css/newProject.css'
import Error from './error'

class NewProject extends Component {
    constructor(props){
        super(props)
        this.state = {
            name : '',
            wiki : '',
            media : [],
            team_member : [],
            userList: [],
            isLoading: true,
            loadError: false,
            error_code: '',
            name_error : false, 
        }
    }
    componentDidMount(){
        authenticate()
        axios.get(GET_USER_URL)
        .then(response => {
            this.setState({userList: response.data,
                isLoading: false,
                loadError: false,
            })
        })
        .catch(err =>{
            const err_code = err.response? err.response.status: ''
            this.setState({
                isLoading:false,
                loadError:true,
                error_code: err_code
            })
        })
    }

    handleChange = (event) => {
        this.setState({[event.target.name] : event.target.value})
    }

    handleImageChange = (e) => {
        this.setState({media:[...e.target.files]})
    }

    handleEditorChange = (event, editor) => {
        this.setState({wiki : editor.getData()})
    }

    handleTeamChange = (event, {value}) => {
        this.setState({team_member:value})
    }

    handleSubmit = (event) => {
        
        event.preventDefault()

        if(this.state.name === "" || this.state.name.length > 50){
            this.setState({name_error:true})
        }

        else{
            let formData = new FormData()

            formData.append(
                'name',
                this.state.name
            )

            formData.append(
                'wiki',
                this.state.wiki
            )

            for(let i = 0; i < (this.state.team_member).length; i++){
                formData.append(
                    'team_member',
                    this.state.team_member[i]
                )
            }

            for(let i = 0; i < (this.state.media).length; i++){
                formData.append(
                    'media'+i,
                    this.state.media[i]
                )
            }
            
            this.setState({isLoading: true})

            axios.post('http://localhost:8000/tracker/project/', formData )
            .then(res => {
                this.props.history.push('/projects/'+res.data.id)
            })
            .catch(err =>{
                const err_code = err.response? err.response.status: ''
                this.setState({
                    isLoading: false,
                    loadError: true,
                    error_code: err_code
                })
            })
        }
        
    }

    render() {
        var options = []
        if(this.state.userList[0]){
            options = this.state.userList.map((user) =>({
                key: user.id,
                text: user.name + ' '+ user.enrollmentNumber,
                value: user.id
            }))
        }
            

        const ckeditor = (
            <CKEditor
                editor={ ClassicEditor }
                onChange = {this.handleEditorChange}
                config={{  
                    placeholder:'Tell something about your project....',       
                    toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'insertTable',
                        'tableColumn', 'tableRow', 'mergeTableCells', '|', 'undo', 'redo']
                }}   
            />
        )

        const form = (
            <Form onSubmit = {this.handleSubmit} encType='multipart/form-data'>
                <Form.Input 
                    name = 'name' 
                    placeholder = {'your project\'s name'}
                    label='Project Name:' 
                    type = 'text' 
                    onChange={this.handleChange}
                    className = 'input_small'
                     />
                <Form.Field>
                    <label>Description:</label>
                    {ckeditor}
                </Form.Field>
                <Form.Field>
                    <label>Upload images:</label>
                    <input 
                        name = 'media'
                        type = 'file' 
                        multiple 
                        onChange = {this.handleImageChange}
                        className = 'input_small'
                        />
                </Form.Field>
                <Form.Dropdown
                    name = 'team_member'
                    label = 'Add team members:'
                    placeholder='Add team members'
                    multiple
                    search
                    selection
                    options={options}
                    className = 'input_small'
                    onChange={this.handleTeamChange}
                />
                <Form.Button positive>Create now</Form.Button>
            </Form>

        )

        const loading = this.state.isLoading
        const loadError = this.state.loadError

        return (
            <Fragment>
                {loading?<Loader active size='large'>Loading</Loader>:
                (loadError)?<Error err_code = {this.state.error_code}/>:
                    <Container>
                        <Menu borderless className='projectMenu' >
                            <Menu.Item>
                                <Breadcrumb size='large'>
                                    <Breadcrumb.Section as = {Link} to='/projects'>Projects</Breadcrumb.Section>
                                    <Breadcrumb.Divider icon='right arrow' />
                                    <Breadcrumb.Section>New Project</Breadcrumb.Section>
                                </Breadcrumb>                        
                            </Menu.Item>
                        </Menu>
                        <Header as = 'h2'>Create a new Project</Header>
                        {form}
                        <Message 
                            negative 
                            content = "Please enter a valid name for your project" 
                            hidden = {!this.state.name_error}/>
                    </Container>
                }
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    user : state.user.item
})

withRouter(NewProject)

export default connect(mapStateToProps)(NewProject)
