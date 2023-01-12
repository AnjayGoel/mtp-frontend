import React, {useEffect} from 'react';
import jwt_decode from "jwt-decode";
import {CredentialResponse, GoogleLogin} from '@react-oauth/google';
import {gapi} from "gapi-script";


const Login = () => {

  const clientID = '843781250860-4akb52ku37826s34q8npd03p712s3663.apps.googleusercontent.com'
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientID,
        scope: ''
      });
    };
    gapi.load('client:auth2', initClient);
  });


  const onSuccess = (response: CredentialResponse) => {
    console.log('success:', response);
    let obj = jwt_decode(response.credential!!)
    localStorage.setItem('user', JSON.stringify(obj));
    console.log(obj)
    console.log(jwt_decode("12"))
  };
  const onFailure = () => {
    console.log('failed:');
  };
  return (
    <div style={{width:'fit-content'}}>
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onFailure}
    />
    </div>
  )
};

export default Login;
