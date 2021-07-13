import '@fontsource/roboto';
import React, {useEffect} from 'react';
import { 
    Typography, 
    Container, 
    Grid, 
    Button
} from '@material-ui/core';
import DrsObjectForm from '../DrsObjectForm';
import {
    Link
} from "react-router-dom";

const NewDrs = (props) => {
    let activeDrsObject = props.activeDrsObject;
    console.log(activeDrsObject);
    let baseUrl = process.env.REACT_APP_DRS_ADMIN_ENDPOINT;
    let requestUrl=(baseUrl+'objects');

    /* Upon rendering the NewDrs page, reset the activeDrsObject with useEffect hook */
    useEffect(() => {
        props.drsObjectFunctions.resetActiveDrsObject();
    }, [])

    /* Render NewDrs page */
    return (
        <div>
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width"
            />
            <Container maxWidth='lg'>
                <Grid container justify='space-between' alignItems='center'>
                    <Grid item xs={2} align='left'>
                        <Button variant='contained' component={Link} to='/drs' color='primary' size='large'>
                            <Typography variant='button'>DRS Index</Typography>
                        </Button>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography align='center' variant="h3" gutterBottom>Create New DRS Object</Typography>
                    </Grid>
                    <Grid item xs={2} />
                </Grid>
                <DrsObjectForm 
                    activeDrsObject={activeDrsObject} 
                    readOnlyId={false}
                    readOnlyForm={false}
                    disabledBundleBlobSelector={false}
                    drsObjectFunctions={props.drsObjectFunctions}
                    drsObjectProperties={props.drsObjectProperties}
                    submitRequestUrl={requestUrl}
                    submitRequestMethod={'POST'}
                    updateSubmitDrsRedirect={props.updateSubmitDrsRedirect}
                    apiRequest={props.apiRequest}
                />
            </Container>
        </div>
    );  
    
}

export default NewDrs;