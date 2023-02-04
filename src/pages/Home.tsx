import React from 'react';
import {Button, Select, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {QuestionCircleOutlined} from "@ant-design/icons";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

export interface HomePageProps {
  showInstructions: Function
}

const HomePage = ({showInstructions}: HomePageProps) => {
  const navigate = useNavigate();


  return (
    <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex',gap:'10px', flexDirection: 'column'}}>
        <Button
          type={'primary'}
          block
          onClick={() => {
            navigate('/game')
          }}
        >
          Start
        </Button>
        <Button
          block
          icon={<QuestionCircleOutlined/>}
          onClick={() => {
            showInstructions()
          }}>Instructions
        </Button>
      </div>
    </div>
  )
};

export default HomePage;
