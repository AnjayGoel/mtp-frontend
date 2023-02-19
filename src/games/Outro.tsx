import React, {useState} from 'react';
import {Button, Divider, Form, Select, Slider, Space, Typography} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {Game} from "../api";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

export interface OutroProps {
  game: Game
  callback: Function
}

const Outro = ({game, callback}: OutroProps) => {
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
            Please answer these final questions honestly.
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
                label="Do you, by any chance, personally know the other player?"
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
                label="How trustworthy was the other player during the experiment?"
                name="trust"
                rules={[{required: true, message: 'Please, answer this question first'}]}
              >
                <Slider
                  min={0}
                  max={10}
                  style={{maxWidth:'25vw'}}
                  defaultValue={5}
                  step={0.5}
                  marks={{0:'0',10:'10'}}
                />
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

export default Outro;
