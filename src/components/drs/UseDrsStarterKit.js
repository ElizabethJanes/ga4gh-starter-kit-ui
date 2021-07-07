import '@fontsource/roboto';
import React, { 
  useEffect
} from 'react';
import axios from 'axios';

const makeRequest = async (requestConfig, handleResponse, handleError) => {
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

  /* UseDrsStarterKit is a custom hook used to make API requests. 
  Parameters:
    requestConfig: a JSON object specifying the API request to be made
    handleResponse: a function that handles the response.data object returned from the API request
    handleError: a function that handles an error that could be returned from the API request if it is unsuccessful
    requestUpdateParameter: a parameter related to the API request, such that when this parameter changes, the API request will be updated
    cancelToken: an axios cancel token used to cancel the request if needed */
const UseDrsStarterKit = (requestConfig, handleResponse, handleError, requestUpdateParameter, cancelToken) => {
    useEffect(() => {    
        if(requestUpdateParameter){
            console.log('make api request');
            makeRequest(requestConfig, handleResponse, handleError);
        }
        return () => {
          cancelToken.cancel('Cleanup API Request');
        };
    }, [requestUpdateParameter]);
}

export default UseDrsStarterKit;