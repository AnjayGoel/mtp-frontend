import React from 'react';
import {Button, notification, Select, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {QuestionCircleOutlined} from "@ant-design/icons";
import {useQuery} from "react-query";
import {getPlayer, isEligible} from "../api";
import {getUseQueryOptions} from "../utils";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

export interface HomePageProps {
  showInstructions: Function
}

const HomePage = ({showInstructions}: HomePageProps) => {
  const navigate = useNavigate();


  const eligible = useQuery(
    [{"key": "eligible"}],
    isEligible,
    getUseQueryOptions(1)
  )

  return (
    <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
        <Button
          type={'primary'}
          block
          loading={eligible.isLoading}
          onClick={() => {
            if (eligible.isLoading) return;
            if (eligible.data?.eligible) {
              navigate('/game')
            } else {
              notification.info({
                message: 'You have already participated in the experiment',
                duration: 5,
                key: 'ineligible'
              })
            }

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
