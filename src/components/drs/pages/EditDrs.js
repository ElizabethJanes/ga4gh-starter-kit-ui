import '@fontsource/roboto';
import React, {useEffect, useState} from 'react';
import { 
    Typography, 
    Container, 
    Grid, 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    DialogActions
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  useParams,
  useLocation,
  Link
} from "react-router-dom";
import axios from 'axios';
import DrsObjectForm from '../DrsObjectForm';
import UseDrsStarterKit from '../UseDrsStarterKit';
import { format } from 'date-fns';

const EditDrs = (props) => {
  console.log(props.activeDrsObject);
  let { objectId } = useParams();
  let baseUrl = 'http://localhost:8080/admin/ga4gh/drs/v1/';
  let requestUrl=(baseUrl+'objects/'+objectId);
  const cancelToken = axios.CancelToken;
  const drsCancelToken = cancelToken.source();

  /* Restore scroll to top of page on navigation to a new page */
  const { pathname }  = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname])

  /* GET request to set the activeDrsObject and populate EditDrs page */
  let getRequestConfig = {
    url: requestUrl,
    method: 'GET',
    cancelToken: drsCancelToken.token
  };

  const handleResponse = (drsObject) => { 
    let editableDrsObject = props.drsObjectFunctions.getEditableDrsObject(drsObject);
    props.drsObjectFunctions.setActiveDrsObject(editableDrsObject);
  }

  /* UseDrsStarterKit hook makes GET request when path changes to EditDrs page */
  //UseDrsStarterKit(getRequestConfig, handleResponse, props.handleError, objectId, drsCancelToken);
  useEffect(() => {
    let newDate = new Date();
    newDate.setSeconds(0, 0);
    let year = newDate.getUTCFullYear();
    let month = newDate.getUTCMonth();
    let date = newDate.getUTCDate();
    let hours = newDate.getUTCHours();
    let minutes = newDate.getUTCMinutes();
    let seconds = newDate.getUTCSeconds();
    let temporaryDrs = {
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
      validRelatedDrsObjects: true
    }
    props.drsObjectFunctions.setActiveDrsObject(temporaryDrs);
    if(objectId){
      props.apiRequest(getRequestConfig, handleResponse, props.handleError);
    }
    return () => {
      drsCancelToken.cancel('Cleanup API Request');
    };
  }, []);

  /* DELETE request to remove activeDrsObject */
  const [objectIdToDelete, setObjectIdToDelete] = useState(null);

  let deleteRequestConfig = {
    url: requestUrl,
    method: 'DELETE',
    cancelToken: drsCancelToken.token
  }

  const handleDeleteResponse = (response)  => {
    setObjectIdToDelete(null);
    props.updateSubmitNewDrsRedirect(true);
  }

  /* Error dialog  */
  const [errorDialogIsOpen, setErrorDialogIsOpen] = useState(false);
  const closeErrorDialog = () => {
    setErrorDialogIsOpen(false);
  }
  const handleDeleteError = () => {
    setConfirmationDialogIsOpen(false);
    setErrorDialogIsOpen(true);
  }

  /* Confirmation dialog  */
  const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] = useState(false);
  const closeConfirmationDialog = () => {
    setConfirmationDialogIsOpen(false);
  }
  const deleteDrsObject = () => {
    setObjectIdToDelete(props.activeDrsObject.id);
    setConfirmationDialogIsOpen(false);
  }

  /* UseDrsStarterKit hook makes DELETE request when objectIdToDelete is set by clicking "Delete" button in confirmation dialog */
  UseDrsStarterKit(deleteRequestConfig, handleDeleteResponse, handleDeleteError, objectIdToDelete, drsCancelToken);

  /* Render EditDrs page */
  return (
      <div>
          <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width"
          />
          <Container maxWidth='lg'>
              <Grid container justify='space-between' alignItems='center'>
                  <Grid item xs={2} align='left'>
                      <Button variant='contained' color='secondary' endIcon={<DeleteIcon/>} onClick={() => setConfirmationDialogIsOpen(true)}>
                        <Typography variant='button'>Delete</Typography>
                      </Button>
                      <Dialog open={confirmationDialogIsOpen} onClose={closeConfirmationDialog}>
                        <DialogTitle align='center'>Are you sure you want to delete the DRS Object?</DialogTitle>
                        <DialogContent>
                          <DialogContentText align='center'>
                            Deleting this DRS Object will permanently remove it from the database.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button variant='contained' color='primary' onClick={closeConfirmationDialog}>
                            <Typography variant='button'>Cancel</Typography>
                          </Button>
                          <Button variant='contained' color='primary' onClick={deleteDrsObject}>
                            <Typography variant='button'>Delete</Typography>
                          </Button>
                        </DialogActions>
                      </Dialog>
                      <Dialog open={errorDialogIsOpen} onClose={closeErrorDialog}>
                        <DialogTitle align='center'>DRS Object was not deleted successfully.</DialogTitle>
                        <DialogContent>
                          <DialogContentText align='center'>
                            Select OK to continue editing.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button variant='contained' color='primary' onClick={closeErrorDialog}>
                            <Typography variant='button'>OK</Typography>
                          </Button>
                        </DialogActions>
                      </Dialog>
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
                  updateSubmitNewDrsRedirect={props.updateSubmitNewDrsRedirect}
                  apiRequest={props.apiRequest}
              />
          </Container>
      </div>
  ); 
}

export default EditDrs;