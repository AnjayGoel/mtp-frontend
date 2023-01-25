import React, {useEffect, useState} from 'react';
import {CredentialResponse, GoogleLogin} from '@react-oauth/google';
import {useNavigate} from "react-router-dom";
import {notification} from "antd";
import {checkSignedUp} from "../api";
import {useQuery} from "react-query";
import {getUseQueryOptions} from "../utils";

const Login = () => {
  const navigate = useNavigate();
  const [googleSuccess, setGoogleSuccess] = useState(false)

  const checkExists = useQuery(
    [{"key": "checkExists"}],
    checkSignedUp,
    getUseQueryOptions(1, 60 * 1000, googleSuccess)
  )

  useEffect(() => {
      if (checkExists.isSuccess) {
        if (checkExists.data.exists) {
          navigate("/")
        } else {
          navigate("/signup")
        }
      }
    },
    [checkExists]
  )

  const onSuccess = (response: CredentialResponse) => {
    console.log('success:', response);
    localStorage.setItem('token', response.credential!!)
    notification.success({message: 'Logged in successfully'})
    setGoogleSuccess(true)
  };
  const onFailure = () => {
    notification.error({message: 'Failed to login. Please try again'})
    console.log('failed');
  };
  return (
    <div style={{display: 'flex', justifyContent: "center", alignItems: 'center'}}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onFailure}
      />
    </div>
  )
};

export default Login;
