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
    <div style={{
      height: '100vh',
      width: '100vw',
      padding: '10px',
      display:'flex',
      flexFlow:'column'
    }}>
      <div style={{
        maxHeight: '5vh',
        width:'100%',
        boxSizing:'border-box',
        height: 'fit-content',
        justifyContent: 'right',
        display: 'flex'
      }}>
        {userInfo === null && <Avatar icon={<UserOutlined/>}><UserOutlined/></Avatar>}
        {userInfo !== null && (
          <Popover content={<Button onClick={() => {
            logout()
          }}>Logout</Button>} title={userInfo.name}>
            <Avatar src={userInfo.picture}/>
          </Popover>
        )}
      </div>
      <div style={{
        width:'100%',
        height:'100%',
        boxSizing:'border-box',
      }}>
        <HashRouter>
          <Routes>
            <Route element={<AuthWrapper/>}>
              <Route path="/" element={<Game/>}/>
              <Route path="/signup" element={<Signup/>}/>
            </Route>
            <Route path="/login" element={<Login/>}/>
          </Routes>
        </HashRouter>
      </div>
    </div>
  )
}

export default App;
