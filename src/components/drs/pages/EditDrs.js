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

  UseDrsStarterKit(getRequestConfig, props.drsObjectFunctions.setEditableDrsObject, props.handleError, objectId, drsCancelToken);

  /* DELETE request to remove activeDrsObject */
  const [objectIdToDelete, setObjectIdToDelete] = useState('');

  let deleteRequestConfig = {
    url: requestUrl,
    method: 'DELETE',
    cancelToken: drsCancelToken.token
  }

  const handleDeleteResponse = (response)  => {
    console.log(response);
    props.updateSubmitNewDrsRedirect(true);
  }

  UseDrsStarterKit(deleteRequestConfig, handleDeleteResponse, props.handleError, objectIdToDelete, drsCancelToken);

  /* Render EditDrs page */
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const closeDialog = () => {
    setDialogIsOpen(false);
  }
  const deleteDrsObject = () => {
    setObjectIdToDelete(props.activeDrsObject.id);
    setDialogIsOpen(false);
  }

  return (
      <div>
          <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width"
          />
          <Container maxWidth='lg'>
              <Grid container justify='space-between' alignItems='center'>
                  <Grid item xs={2} align='left'>
                      <Button variant='contained' color='secondary' endIcon={<DeleteIcon/>} onClick={() => setDialogIsOpen(true)}>
                        <Typography variant='button'>Delete</Typography>
                      </Button>
                      <Dialog open={dialogIsOpen} onClose={closeDialog}>
                        <DialogTitle align='center'>Are you sure you want to delete the DRS Object?</DialogTitle>
                        <DialogContent>
                          <DialogContentText align='center'>
                            Deleting this DRS Object will permanently remove it from the database.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button variant='contained' color='primary' onClick={closeDialog}>
                            <Typography variant='button'>Cancel</Typography>
                          </Button>
                          <Button variant='contained' color='primary' onClick={deleteDrsObject}>
                            <Typography variant='button'>Delete</Typography>
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
              />
          </Container>
      </div>
  ); 
}

export default EditDrs;