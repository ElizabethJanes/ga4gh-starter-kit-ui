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

const EditDrs = (props) => {
  console.log(props.activeDrsObject);
  let { objectId } = useParams();
  let baseUrl = process.env.REACT_APP_DRS_ADMIN_ENDPOINT;
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

  /* useEffect hook makes GET request when EditDrs page is rendered.
  First the activeDrsObject is reset. Then, using the URL parameters to find the objectId, 
  the GET request is made. The GET response is handled through the handleResponse function, 
  which populates the editable form and updates the activeDrsObject. */
  useEffect(() => {
    props.drsObjectFunctions.resetActiveDrsObject();
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
    props.updateSubmitDrsRedirect(true);
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

  /* useEffect hook makes DELETE request when objectIdToDelete is set by clicking "Delete" button in confirmation dialog */
  useEffect(() => {
    if(objectIdToDelete){
      props.apiRequest(deleteRequestConfig, handleDeleteResponse, handleDeleteError);
    }
    return () => {
      drsCancelToken.cancel('Cleanup API Request');
    };
  }, [objectIdToDelete]);

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
                  updateSubmitDrsRedirect={props.updateSubmitDrsRedirect}
                  apiRequest={props.apiRequest}
              />
          </Container>
      </div>
  ); 
}

export default EditDrs;