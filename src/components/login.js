import React from 'react'
import { Header, Image, Container, Label, Segment } from 'semantic-ui-react'
import { CLIENT_ID, REDIRECT_URL, GET_ACCESS_CODE_URL } from '../Const'

const Login = () => {
    return (
        <Segment
            textAlign = 'center'
            basic
            vertical
            style = {{padding:'5em'}}
        >
            <Image
                centered
                size = 'small'
                src = {require('../images/logo.png')}
            />
            <Header as = 'h1'>
                <Header.Content>
                    Bug Tracker
                </Header.Content>
            </Header>
            <Container
                textAlign = 'left' 
                text
            >
                <p>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
                    ligula eget dolor. Aenean massa strong. Cum sociis natoque penatibus et
                    magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,
                    ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
                    quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
                    arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
                    Nullam dictum felis eu pede link mollis pretium. Integer tincidunt. Cras
                    dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
                    Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
                    Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
                    viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
                    Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
                </p>
                <br/>
            </Container>
            <Label as = 'a'
                    basic
                    size = 'large'
                    href = {GET_ACCESS_CODE_URL+'?client_id='+CLIENT_ID+'&redirect_url='+REDIRECT_URL}
                    >
                    <Image spaced = 'right' src = {require('../images/omniport.ico')}/>
                    Login with omni:port
                </Label>
        </Segment>
    )
}
 export default Login