import React, {useState} from 'react';
import {Button, Divider, Form, Select, Slider, Space, Typography} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {Game} from "../api";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

export interface IntroProps {
  game: Game
  callback: Function
}

const Intro = ({game, callback}: IntroProps) => {
  const [action, setAction] = useState<string | null>(null)

  return (
    <Typography style={{width: '100%', height: '100%'}}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingRight: '10px',
        paddingLeft: '30px'
      }}>
        {action !== null && (
          <Space><LoadingOutlined style={{fontSize: 24}} spin/>
            <Text strong>Please wait for other player to respond</Text>
          </Space>
        )}
        {action == null && (
          <div>
            Please answer this final questions honestly.
            <Form
              layout='vertical'
              initialValues={{
                'know': false,
                'trust': 5
              }}
              onFinish={(values) => {
                setAction(values)
                callback(values)
              }}
            >

              <Form.Item
                label="Do you, by any chance, personally know the other person?"
                name="know"
                rules={[{required: true, message: 'Please, answer this question first'}]}
              >
                <Select
                  style={{width: 'fit-content'}}
                  options={[{label: 'Yes', value: true}, {label: 'No', value: false}]}
                  defaultValue={false}
                />
              </Form.Item>

              <Form.Item
                label="How trustworthy was the other person during the game?"
                name="trust"
                rules={[{required: true, message: 'Please, answer this question first'}]}
              >
                <Slider min={0} max={10} defaultValue={5}/>
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Done
              </Button>

            </Form>
          </div>
        )}
      </div>
    </Typography>
  )
};

export default Intro;