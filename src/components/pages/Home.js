import '@fontsource/roboto';
import React from 'react';
import {
  Link
} from "react-router-dom";
import { 
  Container, 
  Button, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  List, 
  ListItem, 
  Box
 } from '@material-ui/core';
 import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

 //temporary configuration object
 let configuration = {
    services: [
      {
        drs: [
          {admin_endpoint: 'http://localhost:8080/admin/ga4gh/drs/v1/'}, 
          {public_endpoint: 'http://localhost:8080/ga4gh/drs/v1/'}
        ]
      }
    ]
  }

const AccordionData = (props) => {
  let starterKitService = configuration.services[0][props.service];
  let accordion = null;
  starterKitService 
  ? 
  accordion = starterKitService.map((service, index) => {
    return(
      <ListItem key={`${Object.keys(service)}_${Object.values(service)}`}>
        <Button variant='contained' color='primary' component={Link} to={`/${props.service}`}>{Object.keys(service)}: {Object.values(service)}</Button>
      </ListItem>
    );
  })
  : accordion = <Typography>
    You have not configured any endpoints for this service.
  </Typography>;
  return(
    <List>
      {accordion}
    </List>
  );
}

const Home = () => {
    return(
      <div align="center">
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <Container maxWidth="lg">
          <Typography variant="h1" gutterBottom>Welcome to the GA4GH Starter Kit</Typography>
          <Typography variant="h3" gutterBottom>Get Started</Typography>
          <Typography variant="h5" gutterBottom>Select one of the services below to start using GA4GH Starter Kit</Typography>
          <Box py={4}>
            <Accordion defaultExpanded>
              <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              id='drs-accordion-header'
              aria-controls='drs-accordion-content'>
                <Typography variant='h5'>
                  Data Repository Service (DRS)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <AccordionData service='drs'/>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Container>
      </div>
    );
  }

  export default Home;