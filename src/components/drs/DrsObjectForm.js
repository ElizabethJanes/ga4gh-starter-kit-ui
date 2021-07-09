import '@fontsource/roboto';
import React, {useState, useEffect} from 'react';
import { 
    Typography, 
    FormControl,
    TextField, 
    Grid, 
    FormGroup, 
    Button, 
    Divider, 
    Box, 
    RadioGroup, 
    Radio, 
    FormControlLabel, 
    IconButton, 
    MenuItem, 
    Tooltip,
    InputAdornment
} from '@material-ui/core';
import {
    Link
} from "react-router-dom";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { 
    DateTimePicker,
    MuiPickersUtilsProvider 
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import UseDrsStarterKit from './UseDrsStarterKit';

const SpaceDivider = () => {
    return (
        <Box py={4}>
            <Divider />
        </Box>
    );
}

/* AddPropertyButton displays a "+" icon and can be used to add additional fields for list-type items. It is passed a handler function 
as a prop, which should append another instance of the item to the list of items being updated. */
const AddPropertyButton = (props) => {
    if(!props.readOnlyForm) {
        return (
            <Grid container>
                <Grid item>
                    <Tooltip title={`Add another ${props.objectName}.`}>
                        <span>
                            <IconButton color='primary' onClick={props.handleClick} disabled={props.disabled}>
                                <AddCircleIcon/>
                            </IconButton>
                        </span>
                    </Tooltip>
                </Grid>
            </Grid>
        );
    }
    else return null;
}

/* RemovePropertyButton displays a "-" icon and can be used to remove instances of list-type items. It is passed a handler function 
as a prop, which should remove the specified instance from the list of items being updated. It is also passed an index value as a prop, 
which should be used to identify the specific object instance to be removed. */
const RemovePropertyButton = (props) => {
    if(!props.readOnlyForm) {
        return (
            <Grid item xs={1}>
                <Tooltip title={`Remove this ${props.objectName}.`}>
                    <IconButton color='secondary' onClick={() => props.handleClick(props.index)}>
                        <RemoveCircleIcon/>
                    </IconButton>
                </Tooltip>
            </Grid>
        );
    }
    else return null;
}

/* BundleBlobRadio is displayed on editable forms, allowing the user to select between a blob- or bundle-type object. Some data entry fields
 are displayed or hidden, depending on the DRS Object type that is selected. The default DRS Object type for new DRS Objects is "blob". */
const BundleBlobRadio = (props) => {
    let value;
    if (props.isBundle) {
        value = 'bundle';
    }
    else {
        value = 'blob';
    }
    if(!props.readOnlyForm) {
        return(
            <FormGroup>
                <Typography align='left' variant='h6'>Is this DRS Object a Bundle or a Blob?</Typography>
                <Typography variant='body2' align='left' color='textSecondary'>
                    Bundles contain references to Child DRS Objects, while Blobs act as single DRS Objects and do not have any children.
                </Typography>
                <RadioGroup name='drs_object_type' value={value} onChange={(event) => props.drsObjectFunctions.updateDrsObjectType(event.target.value)}>
                    <FormControlLabel control={<Radio color='primary'/>} label='Blob' value='blob' disabled={props.disabled}/>
                    <FormControlLabel control={<Radio color='primary'/>} label='Bundle' value='bundle' disabled={props.disabled}/>
                </RadioGroup>
            </FormGroup>
        );
    }
    else return null;
}

/* GenerateIdButton is displayed when the ID field is editable. Clicking this button sets the DRS Object ID to a random UUID. */
const GenerateIdButton = (props) => {
    if(!props.readOnlyId) {
        return(
            <Grid item xs={2} align='right'>
                <Button variant='contained' color='primary' 
                onClick={() => props.drsObjectFunctions.updateScalarProperty('id', uuidv4())}>
                    <Typography variant='button'>Generate ID</Typography>
                </Button>
            </Grid>     
        );
    }
    else return null;
}

const Id = (props) => {
    return(
        <Grid container spacing={4} alignItems='center' justify='space-between'>
            <Grid item xs>
                <FormControl fullWidth>
                    <TextField id='id' label='Id' margin='normal' name='id' type='text'
                    value={props.activeDrsObject.id} InputProps={{readOnly: props.readOnlyId}} 
                    onChange={(event) => props.drsObjectFunctions.updateScalarProperty('id', event.target.value)}
                    helperText='Unique identifier for this DRS Object (UUID recommended), cannot be modified later.'/>
                </FormControl>
            </Grid>
            <GenerateIdButton readOnlyId={props.readOnlyId} drsObjectFunctions={props.drsObjectFunctions}/>
        </Grid>     
    );  
}

const SimpleTextField = (props) => {
    if(!props.property && props.readOnlyForm) {
        return null;
    }
    else {
        return(
            <FormControl fullWidth>
                <TextField id={props.propertyName} label={props.label} margin='normal' name={props.propertyName} type='text' 
                value={props.property} InputProps={{readOnly: props.readOnlyForm}}
                onChange={(event) => props.drsObjectFunctions.updateScalarProperty(event.target.name, event.target.value)}
                helperText={props.description}/>
            </FormControl>
        );
    }
}

/* DateTimeField component displays a text field that opens a date-time picker when selected. The date and time are entered and displayed in 
the local time using the 24 hour clock, however, the activeDrsObject is updated with the date and time converted to UTC time. 
Seconds cannot be selected, and therefore they are always automatically set to zero. 
The date and time are displayed in the format 'yyyy-MM-dd HH:mm:ss OOOO' which includes the timezone (offset from GMT). 
The date-time picker includes a "Today" button which sets the value to the current minute when clicked. */
const DateTimeField = (props) => {
    if(!props.value && props.readOnlyForm) {
        return null;
    }
    else {
        return(
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <FormControl fullWidth>
                    <DateTimePicker id={props.propertyName} label={props.label} margin='normal' name={props.propertyName} value={props.value} 
                    format='yyyy-MM-dd HH:mm:ss OOOO' readOnly={props.readOnlyForm} showTodayButton ampm={false} helperText={props.description}
                    onChange={date => {
                        date.setSeconds(0, 0);
                        let utcDate = format(new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()), "yyyy-MM-dd'T'HH:mm:ss'Z'");
                        props.drsObjectFunctions.updateScalarProperty(props.propertyName, utcDate);
                    }} />
                </FormControl>
            </MuiPickersUtilsProvider>
        );    
    }
}

/* MimeType is displayed for blob-type DRS Objects. */
const MimeType = (props) => {
    if(props.isBundle || (!props.mimeType && props.readOnlyForm)) {
        return null;
    }
    else {
        return (
            <Grid item xs={4}>
                <FormControl fullWidth>
                    <TextField id='mime_type' label='MIME Type' margin='normal' name='mime_type' type='text' value={props.mimeType}
                    InputProps={{readOnly: props.readOnlyForm}} helperText='The media type of the DRS Object.' 
                    onChange={(event) => props.drsObjectFunctions.updateScalarProperty(event.target.name, event.target.value)} />
                </FormControl>    
            </Grid>
        );
        
    }
}

/* Size is displayed for blob-type DRS Objects. This field only accepts numbers and can be edited through free-text entry or using 
the arrow buttons in the text field. */
const Size = (props) => {
    if(props.isBundle || (!props.size && props.readOnlyForm)) {
        return null;
    }
    else {
        return (
            <Grid item xs={4}>
                <FormControl fullWidth>
                    <TextField id='size' label='Size' margin='normal' name='size' type='number' value={props.size} 
                    InputProps={{readOnly: props.readOnlyForm}} helperText='The size (in bytes) of the DRS Object represented as an integer.'
                    onChange={(event) => props.drsObjectFunctions.updateScalarProperty(event.target.name, event.target.value)}/>
                </FormControl>    
            </Grid>
        );
    }
}

/* Alias instances can be added or removed using the AddPropertyButton and RemovePropertyButton components, and are updated through free-text entry. */
const Aliases = (props) => {
    let aliases = props.aliases;
    if(!aliases && props.readOnlyForm) {
        return null;
    }
    else {
        if(!aliases) {
            return null;
        }
        const aliasesDisplay = aliases.map((alias, index) => {
            return (
                <Grid item xs={4} key={`alias${index}`}>
                    <FormGroup row>
                        <Grid item xs={11}>
                            <TextField variant='outlined' id={`alias${index}`} margin='normal' name='alias' label='Alias' type='text' 
                                value={alias} InputProps={{readOnly: props.readOnlyForm}} fullWidth
                                onChange={(event) => props.drsObjectFunctions.updateAlias(index, event.target.value)}/>  
                        </Grid>
                        <Grid item xs={1}>
                            <Box zIndex={1} position='relative' right='75%' top={-10}>
                                <RemovePropertyButton index={index} objectName='alias' readOnlyForm={props.readOnlyForm}
                                handleClick={(index) => props.drsObjectFunctions.removeAlias(index)}/>    
                            </Box>     
                        </Grid>
                    </FormGroup>
                </Grid>
            );  
        })
        return (
            <FormGroup>
                <SpaceDivider />
                <Typography align='left' variant='h6'>Aliases</Typography>
                <Typography variant='body2' align='left' color='textSecondary'>
                    A list of aliases that can be used to identify the DRS Object
                    by additional names.
                </Typography>
                <br />
                <FormGroup row>
                   <Grid container spacing={4} alignItems='center'>
                       {aliasesDisplay}
                       <Grid item>
                            <AddPropertyButton objectName='alias' readOnlyForm={props.readOnlyForm}
                            handleClick={() => props.drsObjectFunctions.addListItem('aliases', props.drsObjectProperties.aliases)}/>
                       </Grid>
                   </Grid>
                </FormGroup>
            </FormGroup>
        );
    }
}

/* Checksums are displayed for blob-type objects and can be added and removed. The Type property is selected using a dropdown, however each type can 
only be selected once. If a type is selected, that option is disabled for each of the other checksum instances. A maximum of 3 checksum objects can be 
added before the AddPropertyButton becomes disabled, since there are 3 type options. The Checksum value field is updated through free-text entry. */
const Checksums = (props) => {
    let checksums = props.checksums;
    let disableAddButton = false;
    if(props.isBundle || (!checksums && props.readOnlyForm)) {
        return null;
    }
    else {
        if(!checksums) {
            return null;
        }
        if(checksums && Object.keys(checksums).length === 3) {
            disableAddButton = true;
        } 
        const checksumsDisplay = checksums.map((checksum, index) => {
            return (
                <FormGroup key={`checksum${index}`} row>
                    <Grid container spacing={4}>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField select variant='outlined' id={`ChecksumType${index}`} label='Type' name='type' type='text' align='left' 
                                value={checksum.type} InputProps={{readOnly: props.readOnlyForm}} helperText='Hashing algorithm used to generate the checksum.' 
                                onChange={(event) => props.drsObjectFunctions.updateChecksumType(index, event.target.value)}>
                                    <MenuItem id='md5' value='md5' disabled={props.checksumTypes.md5.disabled}>md5</MenuItem>
                                    <MenuItem id='sha1' value='sha1' disabled={props.checksumTypes.sha1.disabled}>sha1</MenuItem>
                                    <MenuItem id='sha256' value='sha256' disabled={props.checksumTypes.sha256.disabled}>sha256</MenuItem>
                                </TextField>
                            </FormControl>
                        </Grid>
                        <Grid item xs>
                            <FormControl fullWidth>
                                <TextField variant='outlined' id={`ChecksumValue${index}`} label='Checksum' name='checksum' type='checksum' 
                                value={checksum.checksum} InputProps={{readOnly: props.readOnlyForm}} helperText='Checksum digest value.' 
                                onChange={(event) => props.drsObjectFunctions.updateObjectProperty('checksums', index, 'checksum', event.target.value)}/>
                            </FormControl>    
                        </Grid>   
                        <RemovePropertyButton objectName='checksum' index={index} readOnlyForm={props.readOnlyForm} 
                        handleClick={(index) => props.drsObjectFunctions.removeChecksumItem(index)}/>
                    </Grid>
                </FormGroup>
            );
        })
        return(
            <FormGroup>
                <SpaceDivider />
                <Typography align='left' variant='h6'>Checksums</Typography>
                <Typography variant='body2' align='left' color='textSecondary'>
                    Each single-blob DRS Object must report one or more checksums,
                    recording the digest algorithm and value of the DRS Object
                    bytes.
                    The following list displays the recorded digest algorithms
                    and corresponding values for this DRS Object.
                </Typography>
                <br />
                {checksumsDisplay} 
                <AddPropertyButton objectName='checksum' readOnlyForm={props.readOnlyForm} disabled={disableAddButton}
                handleClick={() => props.drsObjectFunctions.addListItem('checksums', props.drsObjectProperties.checksums)}/>
            </FormGroup>
        );
    }
}

/* VerifyIdButton is used to verify if the ID entered for a parent or child DRS Object is valid. When the button is clicked, a GET request for
the given ID will be made. If an error is returned, the object is set as invalid. If an object is successfully returned, it is valid, unless the 
property to be updated is "drs_object_parents" and the DRS Object returned is an existing blob-type object. Since blob-type objects cannot have 
children, they cannot be set as parent objects.
If the ID has been verified and is valid, it will display a blue checkmark icon in place of the "Verify" button and the name field will be 
automatically populated.
If the ID has been verified and is invalid, a red "X" icon will be displayed and the name field will not be populated.
If the ID has not been verified, or has been edited since being verified, the "Verify" button is displayed.
If the ID field is empty, the "Verify" button is displayed and disabled. */
const VerifyIdButton = (props) => {
    let id = props.relatedDrsObject.id; //id holds the current state of relatedDrsObject.id which is the the value displayed and updated in the id field
    const [objectId, setId] = useState(id); //objectId holds the value that is passed to the UseDrsStarterKit hook to make the API request
    let disabled = false;
    const cancelToken = axios.CancelToken;
    const drsCancelToken = cancelToken.source();
    let baseUrl = 'http://localhost:8080/admin/ga4gh/drs/v1/';
    let requestUrl=(baseUrl+'objects/'+objectId);
    let requestConfig = {
        url: requestUrl,
        method: 'GET',
        cancelToken: drsCancelToken.token
    };

    let activeDrsObject = {...props.activeDrsObject};
    let relatedObjectsList = activeDrsObject[props.property];
    let relatedObject = {...relatedObjectsList[props.index]};

    const handleResponse = (response) => {
        relatedObject.name = response.name;
        if(props.property === 'drs_object_parents' && !response.is_bundle) {
            relatedObject.isValid = false;
        }
        else {
            relatedObject.isValid = true;
        }
        relatedObjectsList[props.index] = relatedObject;
        activeDrsObject.validRelatedDrsObjects = props.drsObjectFunctions.getRelatedDrsValidation(activeDrsObject);
        props.drsObjectFunctions.setActiveDrsObject(activeDrsObject);
    }

    const handleError = (error) => {
        relatedObject.name = '';
        relatedObject.isValid = false;
        relatedObjectsList[props.index] = relatedObject;
        activeDrsObject.validRelatedDrsObjects = props.drsObjectFunctions.getRelatedDrsValidation(activeDrsObject);
        props.drsObjectFunctions.setActiveDrsObject(activeDrsObject);
    }
    
    /* UseDrsStarterKit hook is used to make the API GET request to retrieve the related DRS Object information. The hook is called when the 
    VerifyIdButton component is rendered and passes objectId to determine if it is valid. Prior to clicking the "Verify" button for the first 
    time, objectId is an empty string, and therefore the GET request is not made. When the "Verify" button is clicked, the ObjectId property 
    is updated to the value currently entered in the text field. When objectId is updated (when the "Verify" button is clicked and the objectId 
    value changes), a new API GET request is made to determine if the new objectId is valid. Although the id property is updated whenever the 
    textfield is edited, objectId is only updated when the "Verify" button is clicked. Therefore, the GET request is made when the "Verify" 
    button is clicked, resulting in validation of the updated objectId. */
    //UseDrsStarterKit(requestConfig, handleResponse, handleError, objectId, drsCancelToken);
    useEffect(() => {
        if(!props.readOnlyForm && objectId) {
            console.log('verify id button: ' + objectId);
            props.apiRequest(requestConfig, handleResponse, handleError);    
        }
        return () => {
          drsCancelToken.cancel('Cleanup API Request');
        };
    }, [objectId]);

    if(id === '') {
        disabled = true;
    }
    if(!props.readOnlyForm && relatedObject.isValid === undefined) {
        return(
            <Button color='primary' disabled={disabled} variant='contained' size='small' onClick={() => setId(id)}>
                <Tooltip title='Submit this ID for verification.'>
                    <Typography variant='button'>Verify ID</Typography>
                </Tooltip>
            </Button>
        );
    }
    else if(!props.readOnlyForm && relatedObject.isValid === true) {
        return(
            <IconButton color='primary'>
                <Tooltip title='This is a valid ID.'>
                    <CheckCircleIcon/>
                </Tooltip>
            </IconButton>
        );
    }
    else if(!props.readOnlyForm && relatedObject.isValid === false) {
        return(
            <IconButton color='secondary'>
                <Tooltip title='This is an invalid ID. Please enter a valid ID before proceeding.'>
                    <CancelIcon/>
                </Tooltip>
            </IconButton>
        );
    }
    else return null;
}

/* When the form is editable, each related DRS Object displays the RemovePropertyButton. When the form is read-only, each related DRS Object 
displays the "Details" button, which links to the associated DRS Object. */
const RelatedDrsObjectButton = (props) => {
    if(!props.readOnlyForm) {
        return(
            <RemovePropertyButton objectName={props.objectName} index={props.index} readOnlyForm={props.readOnlyForm}
            handleClick={(index) => {
                props.drsObjectFunctions.removeListItem(props.relationship, index);
                props.activeDrsObject.validRelatedDrsObjects = props.drsObjectFunctions.getRelatedDrsValidation(props.activeDrsObject);
                props.drsObjectFunctions.setActiveDrsObject(props.activeDrsObject);
            }}/>
        );
    }
    else {
        return(
            <Grid item xs={2}>
                <Tooltip title={`View details about this ${props.objectName}.`} id={`DetailsTooltip${props.relationship}${props.index}`}>
                    <Button variant='contained' component={Link} to={`/drs/${props.relatedDrs.id}`} color='primary'>
                        <Typography variant='button'>Details</Typography>
                    </Button>
                </Tooltip>    
            </Grid>
        )
    }
}

/* Related DRS Objects include DRS Object Children and DRS Object Parents, each of which can be added or removed. The ID of the related
DRS Object is entered in the text field. If the ID is valid, the name field is automatically populated by clicking the "Verify" button. 
Drs Object Children are only displayed for bundle-type DRS Objects. */
const RelatedDrsObject = (props) => {
    if(props.readOnlyForm && !props.relatedDrsObjects) {
        return null;
    }
    else if(!props.readOnlyForm && props.relationship === 'drs_object_children' && !props.isBundle) {
        return null;
    }
    else {
        if(!props.relatedDrsObjects) {
            return null;
        }
        const relatedDrsFields = props.relatedDrsObjects.map((relatedDrs, index) => {
            return (
                <FormGroup key={props.relationship + index} row>
                    <Grid container alignItems='center' spacing={4}>
                        <Grid item xs> 
                            <FormControl fullWidth>
                                <TextField variant='outlined' fullWidth id={`ID_${props.relationship}${index}`} 
                                label='Id' name={relatedDrs.id} value={relatedDrs.id} margin='normal' type='text' 
                                onChange={(event) => {
                                    props.drsObjectFunctions.updateObjectProperty(props.relationship, index, 'id', event.target.value);
                                    props.drsObjectFunctions.updateObjectProperty(props.relationship, index, 'isValid', undefined);
                                }}
                                InputProps={
                                    {
                                        readOnly: props.readOnlyForm,
                                        endAdornment: 
                                            <InputAdornment position='end'>
                                                <VerifyIdButton 
                                                relatedDrsObject={relatedDrs} 
                                                activeDrsObject={props.activeDrsObject} 
                                                readOnlyForm={props.readOnlyForm} 
                                                drsObjectFunctions={props.drsObjectFunctions} 
                                                index={index} 
                                                property={props.relationship}
                                                apiRequest={props.apiRequest}/>
                                            </InputAdornment>
                                    }
                                } >
                                </TextField>                        
                            </FormControl>
                        </Grid>
                        <Grid item xs>
                            <FormControl fullWidth>
                                <TextField variant='outlined' fullWidth id={`Name_${props.relationship}${index}`} 
                                label='Name' margin='normal' name={relatedDrs.name} type='text' 
                                value={relatedDrs.name} InputProps={{readOnly: true}}/>                            
                            </FormControl>
                        </Grid>
                        <RelatedDrsObjectButton relatedDrs={relatedDrs} readOnlyForm={props.readOnlyForm} index={index} activeDrsObject={props.activeDrsObject}
                        drsObjectFunctions={props.drsObjectFunctions} objectName={props.objectName} relationship={props.relationship}/>
                    </Grid>
                </FormGroup>
            );
        })
        return (
            <FormGroup>
                <SpaceDivider />
                <Typography align='left' variant='h6'>{props.header}</Typography>
                {props.sectionDescription}
                {relatedDrsFields}
                <AddPropertyButton objectName={props.objectName} readOnlyForm={props.readOnlyForm} 
                handleClick={() => props.drsObjectFunctions.addListItem(props.relationship, props.drsObjectProperties.newRelatedDrsObject)}/>
            </FormGroup>
        );
    }
}

/* AccessPoints are displayed for blob-type DRS objects and inlcude FileAccessObjects and AwsS3AccessObjects, both of which can be added and removed. */
const AccessPoints = (props) => {
    let fileAccessObjects = props.activeDrsObject.file_access_objects;
    let awsS3AccessObjects = props.activeDrsObject.aws_s3_access_objects;
    if(props.isBundle || (!fileAccessObjects && !awsS3AccessObjects)) {
        return null;
    }
    else {
        return(
            <FormGroup>
                <SpaceDivider />
                <Typography align='left' variant='h6'>Access Points</Typography>
                <Typography variant='body2' align='left' color='textSecondary'>
                    A DRS Object may contain multiple access points for fetching 
                    the raw bytes. Multiple access points give the client options 
                    in choosing the best data source for their use case (e.g.
                    based on geographic proximity to the data). All access points
                    associated with a single DRS Object must have the same bytes.
                </Typography>
                <FileAccessObjects fileAccessObjects={fileAccessObjects} readOnlyForm={props.readOnlyForm}
                drsObjectFunctions={props.drsObjectFunctions} drsObjectProperties={props.drsObjectProperties}/>
                <AwsS3AccessObjects awsS3AccessObjects={awsS3AccessObjects} readOnlyForm={props.readOnlyForm}
                drsObjectFunctions={props.drsObjectFunctions} drsObjectProperties={props.drsObjectProperties}/>
            </FormGroup>
        );
    }
}

const FileAccessObjects = (props) => {
    let fileAccessObjects  = props.fileAccessObjects;
    if(props.readOnlyForm && !fileAccessObjects){
        return null;
    }
    else {
        if(!fileAccessObjects) {
            return null;
        }
        const fileAccessDisplay = fileAccessObjects.map((fileAccessObject, index) => {
            return (
                <Grid container alignItems='center' spacing={4} key={`FileAccessObject${index}`}>
                    <Grid item xs>
                        <FormControl fullWidth>
                            <TextField variant='outlined' id={`FileAccessObject${index}`} 
                            label='Path' margin='normal' name='path' type='text' 
                            value={fileAccessObject.path} InputProps={{readOnly: props.readOnlyForm}} 
                            helperText='The filesystem path to the local file storing DRS Object bytes'
                            onChange={(event) => props.drsObjectFunctions.updateObjectProperty('file_access_objects', index, 'path', event.target.value)}/>
                        </FormControl>
                    </Grid>
                    <RemovePropertyButton objectName='local file access point' index={index} readOnlyForm={props.readOnlyForm} 
                    handleClick={(index) => props.drsObjectFunctions.removeListItem('file_access_objects', index)} />
                </Grid>
                
            );
        })
        return (
            <FormGroup>
                <br /> 
                <Typography align='left' variant='body1'>Local File Access Points</Typography>
                <Typography variant='body2' align='left' color='textSecondary'>
                    Local file access points represent local files available on
                    the same filesystem where the DRS service is running. This
                    can also include files co-located on Network Attached Storage
                    (NAS), such as on a high-performance compute cluster (HPC).                    
                </Typography>
                {fileAccessDisplay}
                <AddPropertyButton objectName='local file access point' readOnlyForm={props.readOnlyForm} 
                handleClick={() => props.drsObjectFunctions.addListItem('file_access_objects', props.drsObjectProperties.file_access_objects)}/>
            </FormGroup>
        );
    }
}

const AwsS3AccessObjects = (props) => {
    let awsS3AccessObjects = props.awsS3AccessObjects;
    if(props.readOnlyForm && !awsS3AccessObjects) {
        return null;
    }
    else {
        if(!awsS3AccessObjects) {
            return null;
        }
        const awsS3AccessDisplay = awsS3AccessObjects.map((awsS3AccessObject, index) => {
            return (
                <FormGroup key={`AwsS3AccessObject${index}`} row>
                    <Grid container alignItems='center' spacing={4}>
                        <Grid item xs>
                            <FormControl fullWidth>
                                <TextField variant='outlined' fullWidth id={`region${index}`} 
                                label='Region' margin='normal' name='region' type='text' 
                                value={awsS3AccessObject.region} InputProps={{readOnly: props.readOnlyForm}} 
                                helperText='Region where AWS S3 service is located.' 
                                onChange={(event) => props.drsObjectFunctions.updateObjectProperty('aws_s3_access_objects', index, 'region', event.target.value)}/>                            
                            </FormControl>
                        </Grid>
                        <Grid item xs> 
                            <FormControl fullWidth>
                                <TextField variant='outlined' fullWidth id={`bucket${index}`} 
                                label='Bucket' margin='normal' name='bucket' type='text' 
                                value={awsS3AccessObject.bucket} InputProps={{readOnly: props.readOnlyForm}} 
                                helperText='AWS S3 bucket containing the DRS Object.' 
                                onChange={(event) => props.drsObjectFunctions.updateObjectProperty('aws_s3_access_objects', index, 'bucket', event.target.value)} />                            
                            </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                            <FormControl fullWidth>
                                <TextField variant='outlined' fullWidth id={`key${index}`} 
                                label='Key' margin='normal' name='key' type='text' 
                                value={awsS3AccessObject.key} InputProps={{readOnly: props.readOnlyForm}} 
                                helperText='Path within the bucket to the S3 object storing DRS Object bytes.' 
                                onChange={(event) => props.drsObjectFunctions.updateObjectProperty('aws_s3_access_objects', index, 'key', event.target.value)}/>                            
                            </FormControl>
                        </Grid>
                        <RemovePropertyButton objectName='AWS S3 access point' index={index} readOnlyForm={props.readOnlyForm}
                        handleClick={(index) => props.drsObjectFunctions.removeListItem('aws_s3_access_objects', index)}/>
                    </Grid>
                </FormGroup>
            );
        })
        return (
            <FormGroup>
                <br /> 
                <Typography align='left' variant='body1'>AWS S3 Access Points</Typography>
                <Typography variant='body2' align='left' color='textSecondary'>
                    Represents objects stored in AWS S3 containing DRS Object bytes.
                </Typography>
                {awsS3AccessDisplay}
                <AddPropertyButton objectName='AWS S3 access point' readOnlyForm={props.readOnlyForm}
                handleClick={() => props.drsObjectFunctions.addListItem('aws_s3_access_objects', props.drsObjectProperties.aws_s3_access_objects)}/>
            </FormGroup>
        );
    }
}

const ErrorMessage = (props) => {
    if(!props.error) {
        return null;
    }
    else {
        return(
        <Box pb={4}>
            <Typography align='center' color='secondary'>DRS Object was not created successfully.</Typography>
            <Typography align='center' color='secondary'>{props.error.message}</Typography>
        </Box>
        );
    }
}

const InvalidDrsObjectMessage = (props) => {
    if(props.id && props.validRelatedDrs) {
        return null;
    }
    else {
        return( 
            <Box pb={4} px={35}>
                <Typography align='center' color='secondary' variant='h6'>
                    This DRS Object is invalid.
                </Typography>
                <Typography align='center' color='secondary'>
                    Please ensure that the DRS Object has a unique ID 
                    and that all Parent Bundles and Bundle Children are 
                    valid. Note that blob-type DRS Objects cannot be set 
                    as Parent Bundles.
                </Typography>
            </Box>
        );
    }
}

/* SubmitButton is used to make a POST request to create a new DRS Object. If the id field is empty or if any of the related DRS 
Objects are invalid, the InvalidDrsObjectMessage component is displayed and the button is disabled. When the SubmitButton is clicked, 
the activeDrsObject is "cleaned up" to ensure that the correct properties are submitted to the POST request based on whether the DRS 
Object is a blob or a bundle. If the POST request is successful, the user is redirected to the DRS Index page. However, if it is 
unsuccessful, the user is not redirected and the ErrorMessage component is displayed. */
const SubmitButton = (props) => {
    const [newDrsObjectToSubmit, setNewDrsObjectToSubmit] = useState('');
    const [error, setError] = useState(null);
    let activeDrsObject = props.activeDrsObject;
    const scalarProperties = ['description', 'created_time', 'name', 'updated_time', 'version'] 
    const blobScalarProperties = ['mime_type', 'size']
    const blobListProperties = ['aliases', 'checksums', 'drs_object_parents', 'file_access_objects', 'aws_s3_access_objects'];
    const bundleListProperties = ['aliases', 'drs_object_parents', 'drs_object_children'];

    const cancelToken = axios.CancelToken;
    const newDrsCancelToken = cancelToken.source();

    let requestConfig = {
        url: props.submitRequestUrl,
        method: props.submitRequestMethod,
        data: newDrsObjectToSubmit,
        cancelToken: newDrsCancelToken.token
    };
    
    const relatedDrsObjects = (property) => {
        let relatedDrsObjects = [];
        if(activeDrsObject[property]) {
            activeDrsObject[property].forEach((relatedDrs) => {
                if(relatedDrs.isValid) {
                    let relatedDrsObject = {
                        id: relatedDrs.id
                    }
                    relatedDrsObjects.push(relatedDrsObject);    
                }
            })
        }
        return relatedDrsObjects;   
    }

    const getNewDrsObject = () => {
        let newDrsObject = {
            id: activeDrsObject.id, 
            is_bundle: activeDrsObject.is_bundle
        };

        scalarProperties.forEach((property) => {
            if(activeDrsObject[property]) {
                newDrsObject[property] = activeDrsObject[property];
            }
        })

        if(!activeDrsObject.is_bundle) {
            blobScalarProperties.forEach((property) => {
                if(activeDrsObject[property]) {
                    newDrsObject[property] = activeDrsObject[property];
                }
            })
            blobListProperties.forEach((property) => {
                if(activeDrsObject[property] && Object.keys(activeDrsObject[property]).length > 0) {
                    if(property === 'drs_object_parents') {
                        newDrsObject[property] = relatedDrsObjects(property);
                    }
                    else {
                        newDrsObject[property] = activeDrsObject[property];
                    }
                }
            })
        }
        else { 
            bundleListProperties.forEach((property) => {
                if(activeDrsObject[property] && Object.keys(activeDrsObject[property]).length > 0) {
                    if(property === 'aliases') {
                        newDrsObject[property] = activeDrsObject[property];
                    }
                    else {
                        newDrsObject[property] = relatedDrsObjects(property);
                    }
                }
            })
        }
        return newDrsObject;   
    }

    const handleResponse = (response) => {
        console.log(response);
        props.updateSubmitNewDrsRedirect(true);
    }

    const handleError = (error) => {
        console.log(error);
        setError(error);
    }

    let submitButtonDisabled = false;
    if(!activeDrsObject.id || !activeDrsObject.validRelatedDrsObjects) {
        submitButtonDisabled = true;
    } 
    else {
        submitButtonDisabled = false;
    }

    /* UseDrsStarterKit hook is used to make API POST request. The hook is called when the SubmitButton component is rendered and passes the 
    newDrsObjectToSubmit object within the request body. Prior to clicking the "Submit" button for the first time, newDrsObjectToSubmit is an 
    empty object, and therefore the POST request is not made. When the "Submit" button is clicked, the newDrsObjectToSubmit property is updated, 
    resulting in the POST request being made. */
    UseDrsStarterKit(requestConfig, handleResponse, handleError, newDrsObjectToSubmit.id, newDrsCancelToken);

    if(!props.readOnlyForm) {
        return (
            <FormControl fullWidth>
                <SpaceDivider/>
                <ErrorMessage error={error} />
                <InvalidDrsObjectMessage id={activeDrsObject.id} validRelatedDrs={activeDrsObject.validRelatedDrsObjects}/>
                <Button variant='contained' color='primary' disabled={submitButtonDisabled}
                onClick={() => 
                {
                    let newDrsObject = getNewDrsObject();
                    if(!error && activeDrsObject.id && activeDrsObject.validRelatedDrsObjects) {
                        setNewDrsObjectToSubmit(newDrsObject);
                    }
                }}>
                    Submit
                </Button>
            </FormControl>
        );
    }
    else return null;
}

const DrsObjectForm = (props) => {
    let activeDrsObject = props.activeDrsObject;
    let readOnlyId = props.readOnlyId;
    let readOnlyForm = props.readOnlyForm;
    let isBundle = props.activeDrsObject.is_bundle;

    return (
      <div>
        <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <Box pb={4}>
            <form>
                <Id activeDrsObject={activeDrsObject} drsObjectFunctions={props.drsObjectFunctions} readOnlyId={readOnlyId}/>
                <SimpleTextField property={activeDrsObject.name} propertyName='name' label='Name' 
                drsObjectFunctions={props.drsObjectFunctions} readOnlyForm={readOnlyForm}
                description='Short, descriptive name for this DRS Object.'/>
                <SimpleTextField property={activeDrsObject.description} propertyName='description' label='Description' 
                drsObjectFunctions={props.drsObjectFunctions} readOnlyForm={readOnlyForm}
                description='Longer description of this DRS Object.'/>
                <Grid container justify='space-evenly' spacing={4}>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <DateTimeField value={activeDrsObject.created_time} drsObjectFunctions={props.drsObjectFunctions} 
                            readOnlyForm={readOnlyForm} propertyName='created_time' label='Created Time' 
                            description='Timestamp of DRS Object creation in ISO 8601 format.'/>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <DateTimeField value={activeDrsObject.updated_time} drsObjectFunctions={props.drsObjectFunctions} 
                            readOnlyForm={readOnlyForm} propertyName='updated_time' label='Updated Time' 
                            description='Timestamp of when the DRS Object was most recently updated in ISO 8601 format.'/>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <SimpleTextField property={activeDrsObject.version} propertyName='version' label='Version' 
                        drsObjectFunctions={props.drsObjectFunctions} readOnlyForm={readOnlyForm}
                        description='Current version of the DRS Object, it should be updated each time the DRS Object is modified.'/>
                    </Grid>
                </Grid>
                <BundleBlobRadio readOnlyForm={readOnlyForm} isBundle={isBundle} drsObjectFunctions={props.drsObjectFunctions} disabled={props.disabledBundleBlobSelector}/>
                <Grid container justify='flex-start' spacing={4}>
                    <MimeType mimeType={activeDrsObject.mime_type} isBundle={isBundle} readOnlyForm={readOnlyForm} drsObjectFunctions={props.drsObjectFunctions}/>
                    <Size size={activeDrsObject.size} isBundle={isBundle} readOnlyForm={readOnlyForm} drsObjectFunctions={props.drsObjectFunctions}/>
                </Grid>
                <Aliases aliases={activeDrsObject.aliases} readOnlyForm={readOnlyForm}
                drsObjectFunctions={props.drsObjectFunctions} drsObjectProperties={props.drsObjectProperties}/>
                <Checksums checksums={activeDrsObject.checksums} checksumTypes={activeDrsObject.checksumTypes} isBundle={isBundle} readOnlyForm={readOnlyForm}
                drsObjectFunctions={props.drsObjectFunctions} drsObjectProperties={props.drsObjectProperties}/>
                <RelatedDrsObject relatedDrsObjects={activeDrsObject.drs_object_children} isBundle={isBundle} relationship='drs_object_children'
                activeDrsObject={activeDrsObject} readOnlyForm={readOnlyForm} header='Bundle Children' objectName='child bundle'
                drsObjectFunctions={props.drsObjectFunctions} drsObjectProperties={props.drsObjectProperties} apiRequest={props.apiRequest}
                sectionDescription={
                    <div>
                        <Typography variant='body2' align='left' color='textSecondary'>
                            This DRS Object is currently acting as a DRS Bundle. Bundles
                            contain references to multiple Child objects (single-blob DRS
                            Objects and/or DRS Bundles), enabling multiple DRS Objects to
                            be logically grouped in a nested structure. Only DRS Bundles
                            may have children, single-blob DRS Objects do not have
                            children.
                        </Typography>
                        <Typography variant='body2' align='left' color='textSecondary'>
                            The following listing displays all children for the current
                            DRS Bundle.
                        </Typography>
                    </div>
                }/>
                <RelatedDrsObject relatedDrsObjects={activeDrsObject.drs_object_parents} isBundle={isBundle} relationship='drs_object_parents'
                activeDrsObject={activeDrsObject} readOnlyForm={readOnlyForm} header='Parent Bundles' objectName='parent bundle'
                drsObjectFunctions={props.drsObjectFunctions} drsObjectProperties={props.drsObjectProperties} apiRequest={props.apiRequest}
                sectionDescription={
                    <Typography variant='body2' align='left' color='textSecondary'>
                        The following listing displays all "Parent" DRS Bundles,
                        that is, all bundles that contain the current DRS Object as
                        one of its children.
                    </Typography>
                }/>
                <AccessPoints activeDrsObject={activeDrsObject} readOnlyForm={readOnlyForm} isBundle={isBundle}
                drsObjectFunctions={props.drsObjectFunctions} drsObjectProperties={props.drsObjectProperties}/>
                <SubmitButton activeDrsObject={activeDrsObject} readOnlyForm={readOnlyForm} 
                drsObjectFunctions={props.drsObjectFunctions} updateSubmitNewDrsRedirect={props.updateSubmitNewDrsRedirect}
                submitRequestUrl={props.submitRequestUrl} submitRequestMethod={props.submitRequestMethod} apiRequest={props.apiRequest}/>
            </form>
        </Box>
      </div>
    );
}

export default DrsObjectForm;