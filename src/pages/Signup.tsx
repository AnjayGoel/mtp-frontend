import React from 'react';
import {Button, Form, notification, Select} from "antd";
import {useMutation} from "react-query";
import {signUp} from "../api";
import {useNavigate} from "react-router-dom";

const {Option} = Select

const Signup = () => {

  const [form] = Form.useForm()
  const navigate = useNavigate();

  const signUpQuery = useMutation(signUp, {
    onSuccess: (data) => {
      console.log(data)
      notification.success({message: 'Signup up successfully'})
      navigate("/")
    },
    onError: (e) => {
      console.log(e)
      notification.success({message: 'An error occurred'})
    }
  })

  const onFinish = (values: any) => {
    signUpQuery.mutate(values)
  }

  return (
    <div style={{justifyContent: 'center', alignContent: 'center', display: 'flex'}}>
      <Form
        form={form}
        onFinish={onFinish}
        layout='vertical'
        style={{width: 'fit-content'}}
      >
        <Form.Item
          name="hall"
          label="Hall Of Residence"
          rules={[{required: true}]}
        >
          <Select>
            <Option value="nehru" key={0}>Nehru</Option>
            <Option value="patel" key={1}>Patel</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="department"
          label="Department"
          rules={[{required: true}]}
        >
          <Select>
            <Option value="A" key={0}>Nehru</Option>
            <Option value="B" key={1}>Patel</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="year"
          label="Year of study"
          rules={[{required: true, message: ''}]}
        >
          <Select>
            <Option value="1" key={0}>1</Option>
            <Option value="2" key={1}>2</Option>
            <Option value="3" key={2}>3</Option>
            <Option value="4" key={3}>4</Option>
            <Option value="5" key={4}>5</Option>
          </Select>
        </Form.Item>
        <Button
          type='primary'
          htmlType='submit'
        >
          Submit
        </Button>
      </Form>
    </div>
  )
};

export default Signup;
