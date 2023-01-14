import React, {useEffect} from 'react';
import jwt_decode from "jwt-decode";
import {CredentialResponse, GoogleLogin} from '@react-oauth/google';
import {gapi} from "gapi-script";
import {getUserInfo} from "../utils";
import {useNavigate} from "react-router-dom";
import {notification} from "antd";


const Login = () => {
  const navigate = useNavigate();


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
    localStorage.setItem('token',response.credential!!)
    notification.success({message:'Logged In Successfully'})
    navigate("/")
  };
  const onFailure = () => {
    notification.error({message:'Failed to login'})
    console.log('failed');
  };
  return (
    <div style={{ display:'flex',justifyContent:"center",alignItems:'center'}}>
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onFailure}
    />
    </div>
  )
};

export default Login;
