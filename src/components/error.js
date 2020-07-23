import React, { Fragment, Component }  from 'react'
import { Header, Image, Segment } from 'semantic-ui-react'
import authenticate from '../authenticate'

class Error extends Component {

    componentDidMount(){
        authenticate()
    }

    render(){
        return (
            <Fragment>
                <Segment
                    textAlign = 'center'
                    inverted
                    vertical
                    className = 'head'
                >
                    <Header as = 'h4' inverted className = 'large_header'>
                        <Header.Content >
                            Oops! We encountered an error.
                        </Header.Content>
                    </Header>
                    <Image
                        centered
                        src = {require('../images/logo_inverted.png')}
                    />
                    <Header as = 'h3'
                        inverted
                        content = 'Please try again after some time.'
                        className = 'medium_header'
                        />
                    <Header as = 'h3'
                        inverted
                        content = {'Error code: '+(this.props.err_code? this.props.err_code : '')}
                        className = 'medium_header'
                    />
                </Segment>
            </Fragment>
        )
    }
}

export default Error