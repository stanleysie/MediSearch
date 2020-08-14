/* REACT AND CSS */
import React from 'react'
import { Grid } from 'semantic-ui-react'

/**
 * <Footer />
 */
function Footer() {
    return (
        <div className='footer-wrapper'>
            <Grid
                className='footer-grid'
                relaxed
                columns='equal'
                stretched
                verticalAlign='bottom'>
                <Grid.Row>
                    <Grid.Column textAlign='right' className='footer-text-wrapper'>
                        <span>Developed by The Green Dragons.</span>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    )
}

export default Footer;