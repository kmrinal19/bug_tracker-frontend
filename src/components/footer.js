import React from 'react'
import { Segment, Container, Icon, Image } from 'semantic-ui-react'
import '../css/footer.css'

export default function Footer() {
    return (
        <Segment style={{bottom:0, width: '100%'}}>
            <Container fluid className='footer_container'>
                        <div className='footer_left'>
                            <Image src = {require('../images/icons/fb.svg')} className = 'footer_icon' as='a' href='https://www.facebook.com/mrinal.kumar.77964201/'/>
                            <Image src = {require('../images/icons/github.svg')} className = 'footer_icon' as='a' href='https://github.com/kmrinal19'/>
                            <Image src = {require('../images/icons/insta.svg')} className = 'footer_icon'as='a' href='https://www.instagram.com/kmrinal19/'/>
                            <Image src = {require('../images/icons/linkedin.svg')} className = 'footer_icon'as='a' href='https://www.linkedin.com/in/mrinal-kumar-b48664192/'/>
                        </div>
                        <p className='footer_right'>
                            Made with <Icon name='heart' color='red'/> by Mrinal
                        </p>
            </Container>
        </Segment>
    )
}
