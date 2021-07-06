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
import UseDrsStarterKit from '../UseDrsStarterKit';

const EditDrs = (props) => {
    console.log('edit page');
    console.log(props.activeDrsObject);

    let baseUrl = 'http://localhost:8080/admin/ga4gh/drs/v1/';
    let requestUrl=(baseUrl+'objects/'+props.activeDrsObject.id);

    useEffect(() => {
        console.log('editable drs object');
        let activeDrsObject = {...props.activeDrsObject}
        const scalarProperties = ['description', 'created_time', 'name', 'updated_time', 'version'] 
        const blobScalarProperties = ['mime_type', 'size']
        const blobListProperties = ['aliases', 'checksums', 'drs_object_parents', 'file_access_objects', 'aws_s3_access_objects'];
        const bundleListProperties = ['aliases', 'drs_object_parents', 'drs_object_children'];

        if(activeDrsObject.id) {
            activeDrsObject.validId = true;
        }
        else {
            activeDrsObject.validId = false;
        }

        if(activeDrsObject.drs_object_children) {
            activeDrsObject.drs_object_children.forEach((drsObjectChild) => {
                drsObjectChild.isValid = true;
            }) 
        }
        if(activeDrsObject.drs_object_parents) {
            activeDrsObject.drs_object_parents.forEach((drsObjectParent) => {
                drsObjectParent.isValid = true;
            })   
        }
        activeDrsObject.validRelatedDrsObjects = true;

        scalarProperties.forEach((scalarProperty) => {
          if(!activeDrsObject[scalarProperty]) {
            activeDrsObject[scalarProperty] = '';
          }
        })
        if(!activeDrsObject.is_bundle) {
          blobScalarProperties.forEach((blobScalarProperty) => {
            if(!activeDrsObject[blobScalarProperty]) {
              activeDrsObject[blobScalarProperty] = '';
            }
          })
          blobListProperties.forEach((blobListProperty) => {
            if(!activeDrsObject[blobListProperty]) {
              activeDrsObject[blobListProperty] = [];
            }
          })
        }
        if(activeDrsObject.is_bundle) {
          bundleListProperties.forEach((bundleListProperty) => {
            if(!activeDrsObject[bundleListProperty]) {
              activeDrsObject[bundleListProperty] = [];
            }
          })
        }
        console.log(activeDrsObject);
        props.drsObjectFunctions.setActiveDrsObject(activeDrsObject);
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
                        
                    </Grid>
                    <Grid item xs={8}>
                        <Typography align='center' variant="h3" gutterBottom>Edit DRS Object</Typography>
                    </Grid>
                    <Grid item xs={2} align='right'>
                        <Button variant='contained' component={Link} to={`/drs/${props.activeDrsObject.id}`} color='primary' size='large'>
                            <Typography variant='button'>Cancel</Typography>
                        </Button>
                    </Grid>
                </Grid>
                <DrsObjectForm 
                    activeDrsObject={props.activeDrsObject} 
                    readOnlyId={true}
                    readOnlyForm={false}
                    disabledBundleBlobSelector={true}
                    drsObjectFunctions={props.drsObjectFunctions}
                    drsObjectProperties={props.drsObjectProperties}
                    submitRequestUrl={requestUrl}
                    submitRequestMethod={'PUT'}
                />
            </Container>
        </div>
    ); 
}

export default EditDrs;