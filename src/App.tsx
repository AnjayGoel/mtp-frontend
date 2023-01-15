import React from 'react';
import 'antd/dist/reset.css';
import './App.css';
import {BrowserRouter, Navigate, Outlet, Route, Routes} from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import {Avatar, Button, Popover} from "antd";
import {getUserInfo} from "./utils";
import {googleLogout} from "@react-oauth/google";
import {UserOutlined} from "@ant-design/icons";
import Video from "./pages/video";
import {Chat} from "./pages/chat";

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
      <div style={{maxHeight: '5vh', height: 'fit-content', width: '100vw', justifyContent: 'right', display: 'flex'}}>
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
        <BrowserRouter>
          <Routes>
            <Route element={<AuthWrapper/>}>
              <Route path="/" element={<Home/>}/>
              <Route path="/signup" element={<Signup/>}/>
            </Route>
            <Route path="/login" element={<Login/>}/>
            <Route path="/video" element={<Video/>}/>
            <Route path="/chat" element={<Chat/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App;
