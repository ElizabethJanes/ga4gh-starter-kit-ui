import '@fontsource/roboto';
import React, {useEffect} from 'react';
import { 
  Typography, 
  Container,
  Grid, 
  Button
} from '@material-ui/core';
import {
    useParams,
    useLocation, 
    Link
} from "react-router-dom";
import axios from 'axios';
import DrsObjectForm from '../DrsObjectForm';
import UseDrsStarterKit from '../UseDrsStarterKit';
import EditIcon from '@material-ui/icons/Edit';

const DrsShow = (props) => {
  let activeDrsObject = props.activeDrsObject;
  let setChecksumTypes = props.drsObjectFunctions.setChecksumTypes;
  let { objectId } = useParams();
  let baseUrl = 'http://localhost:8080/admin/ga4gh/drs/v1/';
  let requestUrl=(baseUrl+'objects/'+objectId);
  const cancelToken = axios.CancelToken;
  const drsCancelToken = cancelToken.source();

  /* GET request to set the activeDrsObject and populate DrsShow page */
  let requestConfig = {
    url: requestUrl,
    method: 'GET',
    cancelToken: drsCancelToken.token
  };

  UseDrsStarterKit(requestConfig, setChecksumTypes, props.handleError, objectId, drsCancelToken);

  /* Restore scroll to top of page on navigation to a new page */
  const { pathname }  = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname])

  /* Render DrsShow page */
  return(
    <div align="center">
    <meta
      name="viewport"
      content="minimum-scale=1, initial-scale=1, width=device-width"
    />
      <Container maxWidth="lg">
        <Grid container justify='space-between' alignItems='center'>
          <Grid item xs={2} align='left'>
            <Button variant='contained' component={Link} to='/drs' color='primary' size='large'>
              <Typography variant='button'>DRS Index</Typography>
            </Button>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h3" gutterBottom>DRS Object Details</Typography>
          </Grid>
          <Grid item xs={2} align='right'>
            <Button variant='contained' component={Link} to={`/drs/${activeDrsObject.id}/edit`} color='primary' size='large' endIcon={<EditIcon/>}>
              <Typography variant='button'>Edit</Typography>
            </Button>
          </Grid>
        </Grid>
        <DrsObjectForm 
          activeDrsObject={activeDrsObject} 
          readOnlyId={true}
          readOnlyForm={true}
          drsObjectFunctions={props.drsObjectFunctions}
          apiRequest={props.apiRequest}/>
      </Container>
    </div>
  );
}

export default DrsShow;