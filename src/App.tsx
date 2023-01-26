import React, {useState} from 'react';
import 'antd/dist/reset.css';
import './App.css';
import {BrowserRouter, Navigate, Outlet, Route, Routes, HashRouter} from "react-router-dom";
import {Avatar, Button, Modal, Popover, Space} from "antd";
import {getUserInfo} from "./utils";
import {googleLogout} from "@react-oauth/google";
import {UserOutlined} from "@ant-design/icons";
import PlayerProfileConfig from "./pages/PlayerProfileConfig";
import Login from "./pages/Login";
import {Game} from "./pages/Game";

const App = () => {
  let userInfo = getUserInfo()
  const [showPlayerProfile, setShowPlayerProfile] = useState(false);

  const AuthWrapper = () => {
    return getUserInfo() == null
      ? <Navigate to="/login" replace/>
      : <Outlet/>;
  };

  const logout = () => {
    googleLogout()
    localStorage.removeItem("token")
    window.location.reload()
  }

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      padding: '10px',
      display: 'flex',
      flexFlow: 'column'
    }}>
      <div style={{
        maxHeight: '5vh',
        width: '100%',
        boxSizing: 'border-box',
        height: 'fit-content',
        justifyContent: 'right',
        display: 'flex'
      }}>
        {userInfo === null && <Avatar icon={<UserOutlined/>}><UserOutlined/></Avatar>}
        {userInfo !== null && (
          <Popover content={
            <Space>
              <Button onClick={() => {
                setShowPlayerProfile(true)
              }}>Profile</Button>
              <Button type={'primary'} danger onClick={() => {
                logout()
              }}>Logout</Button>
            </Space>

          } title={userInfo.name}>
            <Avatar src={userInfo.picture}/>
          </Popover>
        )}
      </div>
      <div style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
      }}>
        <HashRouter>
          <Routes>
            <Route element={<AuthWrapper/>}>
              <Route path="/" element={<Game/>}/>
            </Route>
            <Route path="/login" element={<Login/>}/>
          </Routes>
        </HashRouter>
      </div>
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
        <PlayerProfileConfig isUpdate={true} closeCallback={() => {
          setShowPlayerProfile(false)
        }}/>
      </Modal>
    </div>
  )
}

export default App;
