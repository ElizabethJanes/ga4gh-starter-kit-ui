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
import DrsObjectForm from '../DrsObjectForm';
import axios from 'axios';
import UseDrsStarterKit from '../UseDrsStarterKit';

const DrsShow = (props) => {
  let activeDrsObject = props.activeDrsObject;
  let setActiveDrsObject = props.drsObjectFunctions.setActiveDrsObject;
  let handleError = props.handleError;
  let { objectId } = useParams();
  let baseUrl = 'http://localhost:8080/admin/ga4gh/drs/v1/';
  let requestUrl=(baseUrl+'objects/'+objectId);
  const cancelToken = axios.CancelToken;
  const drsCancelToken = cancelToken.source();

  let requestConfig = {
    url: requestUrl,
    method: 'GET',
    cancelToken: drsCancelToken.token
  };

  const updateNewDrsObject = (newActiveDrsObject) => {
    if(!newActiveDrsObject.is_bundle) {
      let checksumTypes = {
        md5: {
          disabled: false
        },
        sha1: {
          disabled: false
        },
        sha256: {
          disabled: false
        }
      };
      if(newActiveDrsObject.checksums) {
        newActiveDrsObject.checksums.map((checksum) =>  {
          let type = checksum.type;
          let checksumTypesObject = checksumTypes[type];
          checksumTypesObject.disabled = true;
        })  
      }
      newActiveDrsObject.checksumTypes = checksumTypes;
    }
    setActiveDrsObject(newActiveDrsObject);
  }

  UseDrsStarterKit(requestConfig, updateNewDrsObject, handleError, objectId, drsCancelToken);

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
            <Button variant='contained' component={Link} to={`/drs/${activeDrsObject.id}/edit`} color='primary' size='large'>
              <Typography variant='button'>Edit</Typography>
            </Button>
          </Grid>
        </Grid>
        <DrsObjectForm 
          activeDrsObject={activeDrsObject} 
          readOnlyId={true}
          readOnlyForm={true}
          drsObjectFunctions={props.drsObjectFunctions}/>
      </Container>
    </div>
  );
}

export default DrsShow;