import React, { Component, Fragment } from 'react'
import axios from 'axios'
import authenticate from '../authenticate'
import { Header, Form } from 'semantic-ui-react'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class NewProject extends Component {
    constructor(props){
        super(props)
        this.state = {
            name : '',
            wiki : '',
            media : []
        }
    }
    componentDidMount(){
        authenticate()
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

    handleSubmit = (event) => {
        
        console.log(this.state)
        event.preventDefault()

        let formData = new FormData()

        formData.append(
            'name',
            this.state.name
        )

        formData.append(
            'wiki',
            this.state.wiki
        )

        for(let i = 0; i < (this.state.media).length; i++){
            formData.append(
                'media'+i,
                this.state.media[i]
            )
        }
        

        axios.post('http://localhost:8000/tracker/project/', formData )
        .then(res => {
            console.log(res.data)
        })
        .catch(err =>{
            console.log(err)
        })
        
    }

    render() {


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
                <Form.Input name = 'name' label='Project Name:' type = 'text' onChange={this.handleChange} />
                <Form.Field>
                    <label>Description:</label>
                    {ckeditor}
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
                <Header as = 'h2'>Create a new Project</Header>
                {form}
            </Fragment>
        )
    }
}

export default NewProject
