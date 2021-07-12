import '@fontsource/roboto';
import axios from 'axios';
import React from 'react';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { Typography } from '@material-ui/core';
import { format } from 'date-fns';
import DrsIndex from './pages/DrsIndex';
import DrsShow from './pages/DrsShow';
import NewDrs from './pages/NewDrs';
import EditDrs from './pages/EditDrs';

let newDate = new Date();
newDate.setSeconds(0, 0);
let year = newDate.getUTCFullYear();
let month = newDate.getUTCMonth();
let date = newDate.getUTCDate();
let hours = newDate.getUTCHours();
let minutes = newDate.getUTCMinutes();
let seconds = newDate.getUTCSeconds();

class Drs extends React.Component {
  constructor(props) {
    super(props);
    this.apiRequest = this.apiRequest.bind(this);
    this.getDrsObjectsList = this.getDrsObjectsList.bind(this);
    this.handleError = this.handleError.bind(this);
    this.updateSubmitDrsRedirect = this.updateSubmitDrsRedirect.bind(this);
    this.state = {
      activeDrsObject: {
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
      },
      drsObjectsList: null,
      error: null,  
      path: this.props.location.pathname, 
      prevPath: null, 
      submitDrsRedirect: false
    };
    this.drsObjectFunctions = {
      setActiveDrsObject: (newActiveDrsObject) => this.setActiveDrsObject(newActiveDrsObject),
      resetActiveDrsObject: () => this.resetActiveDrsObject(),
      getEditableDrsObject: (drsObject) => this.getEditableDrsObject(drsObject),
      updateDrsObjectType: (value) => this.updateDrsObjectType(value),
      updateScalarProperty: (property, newValue) => this.updateScalarProperty(property, newValue), 
      addListItem: (property, newObject) => this.addListItem(property, newObject),
      updateObjectProperty: (objectList, index, property, newValue) => this.updateObjectProperty(objectList, index, property, newValue), 
      removeListItem: (objects, index) => this.removeListItem(objects, index),
      updateAlias: (index, newValue) => this.updateAlias(index, newValue),
      removeAlias: (index) => this.removeAlias(index),
      setChecksumTypes: (drsObject) => this.setChecksumTypes(drsObject),
      updateChecksumType: (index, newValue) => this.updateChecksumType(index, newValue),
      removeChecksumItem: (index) => this.removeChecksumItem(index),
      getRelatedDrsValidation: (drsObject) => this.getRelatedDrsValidation(drsObject)
    };
    this.drsObjectProperties = {
      aliases: '',
      checksums: {
        checksum: '',
        type: ''
      },
      newRelatedDrsObject: {
        id: '', 
        name: '', 
        isValid: undefined
      },
      drs_object_children: {
        id: '', 
        name: '', 
        isValid: undefined
      },
      drs_object_parents: {
        id: '', 
        name: '', 
        isValid: undefined
      },
      file_access_objects: {
        path: ''
      },
      aws_s3_access_objects: {
        region: '',
        bucket: '',
        key: ''
      }
    }
  }

  apiRequest = async (requestConfig, handleResponse, handleError) => {
    await axios(requestConfig)
    .then (
      (response) => {
        handleResponse(response.data);
      },
      (error) => {
        if (axios.isCancel(error)) {
          console.log('API request has been cancelled');
        }
        else {
          handleError(error);
        }
      }
    )
  } 

  getDrsObjectsList = async () => {
    let baseUrl = 'http://localhost:8080/admin/ga4gh/drs/v1/';
    let requestUrl=(baseUrl+'objects');
    await axios({
      url: requestUrl, 
      method: 'GET'
    })
    .then(
      (response) => {
        this.setState ({
          drsObjectsList: response.data
        })
      },
      (error) => {
        this.handleError(error);
      }
    )
  }

  componentDidMount() {
    if(!this.state.drsObjectsList) {
      this.getDrsObjectsList();
    }
  }

  componentDidUpdate() {
    if(this.state.path !== this.props.location.pathname) {
      this.setState((state, props) => ({
        prevPath: state.path,
        path: props.location.pathname
      }))
      /* On navigation to the Index Page, update the Drs Objects list, reset the activeDrsObject, and reset the the state of submitDrsRedirect. */
      if(this.props.location.pathname === '/drs' && this.state.path !== this.state.prevPath) {
        this.getDrsObjectsList();
        this.setState({
          submitDrsRedirect: false
        })
      }
    }
  }

  handleError(error) {
    this.setState({
      error: error
    });
  }

  setActiveDrsObject(newActiveDrsObject) {
    this.setState({
      activeDrsObject: newActiveDrsObject
    });
  }

  resetActiveDrsObject() {
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
        validRelatedDrsObjects: true
    }
    this.setState({
      activeDrsObject: newDrsObject
    })
  }

  getEditableDrsObject(drsObject) {
    const scalarProperties = ['description', 'created_time', 'name', 'updated_time', 'version'] 
    const blobScalarProperties = ['mime_type', 'size']
    const blobListProperties = ['aliases', 'checksums', 'drs_object_parents', 'file_access_objects', 'aws_s3_access_objects'];
    const bundleListProperties = ['aliases', 'drs_object_parents', 'drs_object_children'];

    scalarProperties.forEach((scalarProperty) => {
      if(!drsObject[scalarProperty]) {
        drsObject[scalarProperty] = '';
      }
    })
    if(!drsObject.is_bundle) {
      blobScalarProperties.forEach((blobScalarProperty) => {
        if(!drsObject[blobScalarProperty]) {
          drsObject[blobScalarProperty] = '';
        }
      })
      blobListProperties.forEach((blobListProperty) => {
        if(!drsObject[blobListProperty]) {
          drsObject[blobListProperty] = [];
        }
      })
      drsObject = this.setChecksumTypes(drsObject);
    }
    if(drsObject.is_bundle) {
      bundleListProperties.forEach((bundleListProperty) => {
        if(!drsObject[bundleListProperty]) {
          drsObject[bundleListProperty] = [];
        }
      })
    }
    drsObject.validRelatedDrsObjects = this.getRelatedDrsValidation(drsObject);
    return drsObject;
  }

  updateDrsObjectType(value) {
    let activeDrsObject = {...this.state.activeDrsObject};
    if(value === 'blob') {
      activeDrsObject.is_bundle = false;
    }
    else {
      activeDrsObject.is_bundle = true;
    }
    this.setState({
      activeDrsObject: activeDrsObject
    })
  }

  updateScalarProperty(property, newValue) {
    let activeDrsObject = {...this.state.activeDrsObject};
    activeDrsObject[property] = newValue;
    this.setState({
      activeDrsObject: activeDrsObject
    })
  }

  addListItem(property, newObject) {
    let activeDrsObject = {...this.state.activeDrsObject};
    activeDrsObject[property].push(newObject);
    this.setState({
      activeDrsObject: activeDrsObject
    })
  }

  updateObjectProperty(objects, index, property, newValue) {
    let activeDrsObject = {...this.state.activeDrsObject};
    let objectList = activeDrsObject[objects];
    let object = {...objectList[index]};
    object[property] = newValue;
    objectList[index] = object;
    this.setState({
      activeDrsObject: activeDrsObject
    })
  }

  removeListItem(objects, index) {
    let activeDrsObject = {...this.state.activeDrsObject};
    let objectList = activeDrsObject[objects];
    objectList.splice(index, 1);
    this.setState({
      activeDrsObject: activeDrsObject
    })
  }

  updateAlias(index, newValue) {
    let activeDrsObject = {...this.state.activeDrsObject};
    let aliases = activeDrsObject['aliases'];
    aliases[index] = newValue;
    this.setState({
      activeDrsObject: activeDrsObject
    })
  }

  removeAlias(index) {
    let activeDrsObject = {...this.state.activeDrsObject};
    let aliases = activeDrsObject['aliases'];
    aliases.splice(index, 1);
    this.setState({
      activeDrsObject: activeDrsObject
    })
  }

  setChecksumTypes = (drsObject) => {
    if(!drsObject.is_bundle) {
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
      if(drsObject.checksums) {
        drsObject.checksums.forEach((checksum) =>  {
          let type = checksum.type;
          let checksumTypesObject = checksumTypes[type];
          checksumTypesObject.disabled = true;
        })  
      }
      drsObject.checksumTypes = checksumTypes;
    }
    return drsObject;
    /* this.setState({
      activeDrsObject: drsObject
    }) */
  }

  updateChecksumType(index, newValue) {
    let activeDrsObject = {...this.state.activeDrsObject};
    let objectList = activeDrsObject['checksums'];
    let object = {...objectList[index]};
    let previousType = object['type'];
    object['type'] = newValue;
    objectList[index] = object;
    let checksumTypes = {...activeDrsObject.checksumTypes};
    if(previousType) {
      checksumTypes[previousType].disabled = !checksumTypes[previousType].disabled;
    }
    checksumTypes[newValue].disabled = !checksumTypes[newValue].disabled;
    this.setState({
      activeDrsObject: activeDrsObject
    })
  }

  removeChecksumItem(index) {
    let activeDrsObject = {...this.state.activeDrsObject};
    let objectList = activeDrsObject['checksums'];
    let checksumToRemove = objectList[index];
    let typeToUpdate = checksumToRemove.type;
    objectList.splice(index, 1);
    let checksumTypes = {...activeDrsObject.checksumTypes};
    if(typeToUpdate) {
      checksumTypes[typeToUpdate].disabled = false;
    }
    this.setState({
      activeDrsObject: activeDrsObject
    })
  }

  /* Check all Parent DRS Objects or all Child DRS Objects to determine if any are invalid. If all objects are valid, 
  this.state.activeDrsObject.validRelatedDrsObjects is true, otherwise, if any objects are invalid, it is false. */
  getRelatedDrsValidation(drsObject) {
    let validRelatedDrsObjects = true;
    if(drsObject.drs_object_parents) {
      drsObject.drs_object_parents.forEach((drsObjectParent) => {
        if(!drsObjectParent.isValid) {
          validRelatedDrsObjects = false;
        }
      })  
    }
    if(drsObject.drs_object_children) {
      drsObject.drs_object_children.forEach((drsObjectChild) => {
        if(!drsObjectChild.isValid) {
          validRelatedDrsObjects = false;
        }
      })  
    }
    return validRelatedDrsObjects;
  }

  /* When this.state.submitDrsRedirect is true, the page will be redirected from '/drs/new' to '/drs'. */
  updateSubmitDrsRedirect(newValue) {
    this.setState({
      submitDrsRedirect: newValue
    })
  }

  render(){
    if(this.state.error) {
      if(this.state.error.response) {
        return (
          <div align="center">
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
            <Typography variant="h4" gutterBottom>Error</Typography>
            <Typography gutterBottom>{this.state.error.response.data.error}</Typography>
            <Typography gutterBottom>{this.state.error.message}</Typography>
          </div>
        );
      }
      else if(this.state.error.request) {
        return (
          <div align="center">
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
            <Typography variant="h4" gutterBottom>Error</Typography>
            <Typography gutterBottom>{this.state.error.request}</Typography>
          </div>
        );
      }
      else {
        return (
          <div align="center">
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
            <Typography variant="h4" gutterBottom>Error</Typography>
            <Typography gutterBottom>{this.state.error.message}</Typography>
          </div>
        );
      }
    }
    else {
      return (
        <div>
          <Switch>
            <Route exact path='/drs'>
              <DrsIndex 
                drsObjectsList={this.state.drsObjectsList} 
                handleError={this.handleError}
                drsObjectFunctions={this.drsObjectFunctions}
                drsObjectProperties={this.drsObjectProperties}
              />
            </Route>
            <Route exact path='/drs/new'>
              {this.state.submitDrsRedirect ? <Redirect from='/drs/new' to='/drs' /> :
                <NewDrs
                  activeDrsObject={this.state.activeDrsObject}
                  drsObjectFunctions={this.drsObjectFunctions}
                  drsObjectProperties={this.drsObjectProperties}
                  updateSubmitDrsRedirect={this.updateSubmitDrsRedirect}
                  apiRequest={this.apiRequest}
                />
              }
            </Route>
            <Route exact path='/drs/:objectId'>
              <DrsShow 
                activeDrsObject={this.state.activeDrsObject} 
                handleError={this.handleError}
                drsObjectFunctions={this.drsObjectFunctions}
                apiRequest={this.apiRequest}
              />
            </Route>
            <Route exact path='/drs/:objectId/edit'>
              {this.state.submitDrsRedirect ? <Redirect from='/drs/:objectId/edit' to='/drs' /> :
                <EditDrs 
                  activeDrsObject={this.state.activeDrsObject}
                  drsObjectFunctions={this.drsObjectFunctions}
                  drsObjectProperties={this.drsObjectProperties}
                  handleError={this.handleError}
                  updateSubmitDrsRedirect={this.updateSubmitDrsRedirect}
                  apiRequest={this.apiRequest}
                  path={this.state.path}
                />
              }
            </Route>
          </Switch>
        </div>
      );
    }
  }
}
  
export default Drs;