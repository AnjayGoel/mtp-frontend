import React, {useEffect, useState} from 'react';
import {CredentialResponse, GoogleLogin} from '@react-oauth/google';
import {useNavigate} from "react-router-dom";
import {Modal, notification} from "antd";
import {getPlayer} from "../api";
import {useQuery} from "react-query";
import {getUseQueryOptions} from "../utils";
import PlayerProfileConfig from "./PlayerProfileConfig";

const Login = () => {
  const navigate = useNavigate();
  const [isGoogleSuccess, setIsGoogleSuccess] = useState(false);
  const [showPlayerProfile, setShowPlayerProfile] = useState(false);

  const playerProfileQuery = useQuery(
    [{"key": "playerProfile"}],
    getPlayer,
    getUseQueryOptions(1, 0, isGoogleSuccess)
  )

  useEffect(() => {
      if (playerProfileQuery.isSuccess) {
        if (playerProfileQuery.data.exists) {
          notification.success({message: 'Logged in successfully'})
          setIsGoogleSuccess(false)
          setShowPlayerProfile(false)
          playerProfileQuery.remove()
          navigate("/")
        } else {
          setShowPlayerProfile(true)
        }
      }
    },
    [playerProfileQuery.isSuccess]
  )

  const onSuccess = (response: CredentialResponse) => {
    localStorage.setItem('token', response.credential!!)
    window.dispatchEvent(new Event('storage'))
    setIsGoogleSuccess(true)
  };
  const onFailure = () => {
    notification.error({message: 'Failed to login. Please try again'})
  };
  return (
    <div style={{display: 'flex', justifyContent: "center", alignItems: 'center'}}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onFailure}
      />
      <Modal
        width={'30vw'}
        title="Profile" open={showPlayerProfile}
        onOk={() => {
          setShowPlayerProfile(false)
        }}
        onCancel={() => {
          setShowPlayerProfile(false)
        }}
        cancelButtonProps={{style: {display: 'none'}}}
        okButtonProps={{style: {display: 'none'}}}
      >
        <PlayerProfileConfig isUpdate={false} closeCallback={() => {
          setShowPlayerProfile(false)
        }}/>
      </Modal>
    </div>
  )
};

export default Login;
