import React from 'react'
import { Segment, Container, Grid, Icon } from 'semantic-ui-react'

export default function Footer() {
    return (
        <Segment style={{bottom:0}}>
            <Container>
                <Grid stackable
                    centered >
                    <Grid.Row centered>
                        <Icon name = 'facebook official' size = 'large'/>
                        <Icon name = 'github' size = 'large'/>
                        <Icon name = 'instagram' size = 'large'/>
                        <Icon name = 'linkedin' size = 'large'/>
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
