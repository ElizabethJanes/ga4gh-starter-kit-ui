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
import { format } from 'date-fns';

/* Render NewDrs page */
const NewDrs = (props) => {
    let activeDrsObject = props.activeDrsObject;
    console.log(activeDrsObject);

    let baseUrl = 'http://localhost:8080/admin/ga4gh/drs/v1/';
    let requestUrl=(baseUrl+'objects');

    useEffect(() => {
        console.log('new drs object effect');
        let newDate = new Date();
        newDate.setSeconds(0, 0);
        let year = newDate.getUTCFullYear();
        let month = newDate.getUTCMonth();
        let date = newDate.getUTCDate();
        let hours = newDate.getUTCHours();
        let minutes = newDate.getUTCMinutes();
        let seconds = newDate.getUTCSeconds();
        let newDrsObject = {
            id: '',
            description: '',
            created_time: format(new Date(year, month, date, hours, minutes, seconds), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
            mime_type: '',
            name: '',
            size: '',
            updated_time: format(new Date(year, month, date, hours, minutes, seconds), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
            version: '',
            aliases: [],
            checksums: [],
            drs_object_children: [],
            drs_object_parents: [],
            file_access_objects: [],
            aws_s3_access_objects: [],
            is_bundle: false,
            checksumTypes: {
            md5: {
                disabled: false
            },
            sha1: {
                disabled: false
            },
            sha256: {
                disabled: false
            }
            },
            validId: false,
            validRelatedDrsObjects: true
        }
        props.drsObjectFunctions.setActiveDrsObject(newDrsObject);
    }, [])

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
                    updateSubmitNewDrsRedirect={props.updateSubmitNewDrsRedirect}
                />
            </Container>
        </div>
    );  
    
}

export default NewDrs;