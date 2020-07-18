import React from 'react'
import { Segment, Container, Grid, Icon, Image } from 'semantic-ui-react'
import '../css/footer.css'

export default function Footer() {
    return (
        <Segment style={{bottom:0}}>
            <Container>
                <Grid stackable
                    centered >
                    <Grid.Row centered>
                        <Image src = {require('../images/icons/fb.svg')} className = 'footer_icon'/>
                        <Image src = {require('../images/icons/github.svg')} className = 'footer_icon'/>
                        <Image src = {require('../images/icons/insta.svg')} className = 'footer_icon'/>
                        <Image src = {require('../images/icons/linkedin.svg')} className = 'footer_icon'/>
                    </Grid.Row>
                    <Grid.Row centered>
                        <p>
                            Made with <Icon name='heart' color='red'/> by Mrinal
                        </p>
                    </Grid.Row>
                </Grid>
            </Container>
        </Segment>
    )
}
