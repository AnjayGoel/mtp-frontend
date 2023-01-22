import React from 'react';
import 'antd/dist/reset.css';
import './App.css';
import {BrowserRouter, Navigate, Outlet, Route, Routes, HashRouter} from "react-router-dom";
import {Avatar, Button, Popover} from "antd";
import {getUserInfo} from "./utils";
import {googleLogout} from "@react-oauth/google";
import {UserOutlined} from "@ant-design/icons";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Video from "./pages/Video";
import {Game} from "./pages/Game";

const App = () => {
  let userInfo = getUserInfo()

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
    <div style={{height: '100vh', width: '100vw'}}>
      <div style={{
        maxHeight: '5vh',
        height: 'fit-content',
        width: '100vw',
        justifyContent: 'right',
        display: 'flex',
        padding:'5px'
      }}>
        {userInfo === null && <Avatar style={{margin: '5px 5px 0 0'}}><UserOutlined /></Avatar>}
        {userInfo !== null && (
          <Popover content={<Button onClick={() => {
            logout()
          }}>Logout</Button>} title={userInfo.name}>
            <Avatar style={{margin: '5px 5px 0 0'}} src={userInfo.picture}/>
          </Popover>
        )}
      </div>
      <div style={{height: '95vh', width: '100vw'}}>
        <HashRouter>
          <Routes>
            <Route element={<AuthWrapper/>}>
              <Route path="/" element={<Game/>}/>
              <Route path="/signup" element={<Signup/>}/>
            </Route>
            <Route path="/login" element={<Login/>}/>
            <Route path="/video" element={<Video/>}/>
          </Routes>
        </HashRouter>
      </div>
    </div>
  )
}

export default App;
