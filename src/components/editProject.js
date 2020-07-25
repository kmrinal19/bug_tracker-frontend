import React, { Component , Fragment } from 'react'
import { connect} from 'react-redux'
import { Container, Menu, Breadcrumb, Loader, Icon, Confirm, Header, Form, Image, Button } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import { withRouter } from "react-router";
import axios from 'axios'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ALL_PROJECTS_URL, LOGIN_HOME_URL, GET_USER_URL, PROJECT_MEDIA_URL } from '../Const'
import authenticate from '../authenticate'
import '../css/projects.css'
import Error from './error'

class UploadedImages extends Component{
    constructor(props){
        super(props)
        this.state = {
            isHidden : true,
            media: this.props.media
        }
    }

    handleClick = () => {
        this.setState({isHidden: !this.state.isHidden})
    }

    handleDelete = (event, id) => {
        event.preventDefault()
        let index = -1
        for(let i =0 ; i< this.state.media.length; i++){
            if(this.state.media[i].id === id){
                index = i
                break
            }
        }
        axios.delete(PROJECT_MEDIA_URL+id+'/')
        .then(response =>{
            if(response.status === 204){
                this.setState({
                    media: [...this.state.media.slice(0,index),...this.state.media.slice(index+1)]
                })
                this.props.setLoadError(false, '')
            }
        })
        .catch(err => {
            const err_code = err.response? err.response.status: ''
            this.props.setLoadError(true, err_code)
        })
    }

    render(){

        return(
            <Fragment>
                {this.state.isHidden?(
                    <Fragment>
                        <Button basic color='blue' size = 'small' onClick = {this.handleClick}>Show uploaded images</Button>
                        <br/><br/>
                    </Fragment>
                    ):(
                        <Fragment>
                            {this.state.media.map(image =>(
                                <Fragment key = {image.id}>
                                    <Image src = {image.media} size = 'small' inline/>
                                    <Button 
                                        onClick = {(event) => (this.handleDelete(event,image.id))}
                                        style = {{marginLeft:10}}
                                        negative
                                    >
                                        Delete
                                    </Button>
                                    <br/>
                                </Fragment>
                            ))}
                            <Button basic color='blue' size = 'small' onClick = {this.handleClick}>Hide images</Button>
                            <br/><br/>
                        </Fragment>
                        )
                }
            </Fragment>

        )
    }
}

class EditProject extends Component {

    constructor(props){
        super(props)
        this.state={
            projectDetail : {
                    projectIssues:[],
                    project_media: [],
                    team_member:[]
                },
            isLoading: true,
            loadError: false,
            error_code: '',
            showDelete : false,
            userList: [],
            wiki: [],
            media : [],
            media_upload : [],
            team_member : []
        }
    }

    setLoadError = (val, err_code)=>{
        this.setState({loadError:val, error_code: err_code})
    }

    componentDidMount(){

        authenticate()

        const { id } = this.props.match.params
        let get_project_details_url = ALL_PROJECTS_URL+id

        axios.get(get_project_details_url)
        .then(response => {
            if(response.status === 200 && response.data.id){
                this.setState({projectDetail:response.data,
                    isLoading:false,
                    loadError: false,
                    wiki : response.data.wiki,
                    team_member : response.data.team_member,
                    media: response.data.project_media
                })
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
                error_code: err_code,
                isLoading:false 
            })
        })

        axios.get(GET_USER_URL)
        .then(response => {
            this.setState({userList: response.data})
        })
        .catch(err =>{
            if(err.response && err.response.status === 401){
                window.location.href = LOGIN_HOME_URL
            }
            const err_code = err.response? err.response.status: ''
            this.setState({
                loadError:true,
                error_code: err_code,
                isLoading:false 
            })
        })
    }

    showDelete  = () => {
        this.setState({showDelete:true})
    }

    handleCancel = () => {
        this.setState({showDelete:false})
    }

    handleConfirm = () => {
        this.setState({
            showDelete:false,
            isLoading: true
        })
        axios.delete(ALL_PROJECTS_URL+this.state.projectDetail.id)
        .then(response => {
            window.location.href = '/projects'
        })
        .catch(err =>{
            const err_code = err.response? err.response.status: ''
            this.setState({
                loadError:true,
                error_code: err_code,
                isLoading:false 
            })
        })
    }

    handleImageChange = (e) => {
        this.setState({media_upload:[...e.target.files]})
    }

    handleEditorChange = (event, editor) => {
        this.setState({wiki : editor.getData()})
    }

    handleTeamChange = (event, {value}) => {
        this.setState({team_member:value})
    }

    handleSubmit = (event) => {
        
        event.preventDefault()

        let formData = new FormData()

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

        for(let i = 0; i < (this.state.media_upload).length; i++){
            formData.append(
                'media'+i,
                this.state.media_upload[i]
            )
        }

        this.setState({
            isLoading:true
        })
        

        axios.patch('http://localhost:8000/tracker/project/'+this.state.projectDetail.id+'/', formData )
        .then(res => {
            this.props.history.push('/projects/'+res.data.id)
        })
        .catch(err =>{
            const err_code = err.response? err.response.status: ''
            this.setState({
                loadError:true,
                error_code: err_code,
                isLoading:false 
            })
        })
        
    }

    render() {
        var options = []
        var defaultVal = []
        defaultVal = this.state.team_member
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
                data = {this.state.wiki}  
            />
        )

        const form = (
            <Form onSubmit = {this.handleSubmit} encType='multipart/form-data'>
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
                <UploadedImages media = {this.state.media} setLoadError = {this.setLoadError}/>
                <Form.Dropdown
                    name = 'team_member'
                    label = 'Add team members:'
                    placeholder='Add team members'
                    multiple
                    search
                    selection
                    options={options}
                    className = 'input_small'
                    defaultValue = {defaultVal}
                    onChange={this.handleTeamChange}
                />
                <Form.Button positive>Update</Form.Button>
            </Form>

        )

        const head = (
            <Fragment>
                <Menu borderless className='projectMenu' >
                    <Menu.Item>
                        <Breadcrumb size = 'large'>
                            <Breadcrumb.Section as = {Link} to='/projects'>Projects</Breadcrumb.Section>
                            <Breadcrumb.Divider icon = 'right angle'/>
                            <Breadcrumb.Section as = {Link} to = {'/projects/'+this.state.projectDetail.id}>{this.state.projectDetail.name}</Breadcrumb.Section>
                            <Breadcrumb.Divider icon='right arrow' />
                            <Breadcrumb.Section>Edit Project</Breadcrumb.Section>
                        </Breadcrumb>
                    </Menu.Item>
                </Menu>
                <Header as = 'h2'>{this.state.projectDetail.name}</Header>
                {/* only project creator, team_members and admin is allowed to edit */}
                {this.props.user.user? ((this.props.user.user.id === this.state.projectDetail.created_by) || 
                (this.props.user.user.is_superuser) || (this.state.projectDetail.team_member.includes(this.props.user.user.id))? (
                    <Fragment>
                        <Icon name = 'trash'/>
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
                    ) : <Redirect to = '/projects'/>)
                    : ''
                }
            </Fragment>
        )

        const loading = this.state.isLoading
        const loadError = this.state.loadError

        return(
            <Fragment>
                {loading?<Loader active size='large'>Loading</Loader>:
                (loadError)?<Error err_code = {this.state.error_code}/>:
                    <Container>
                        {head}
                        {form}
                    </Container> 
                }
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    user : state.user.item
})

withRouter(EditProject)

export default connect(mapStateToProps)(EditProject)