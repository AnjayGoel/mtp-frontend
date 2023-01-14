import React, {useEffect} from 'react';
import {Form, Select} from "antd";
const { Option } = Select

const Signup = () => {

  const [form] = Form.useForm()

  return (
    <div style={{justifyContent:'center',alignContent:'center',display:'flex'}}>
    <Form
    form={form}
    layout='vertical'
    style={{width:'fit-content'}}
    >
      <Form.Item
      name = "hall"
      label="Hall Of Residence"
      rules={[{ required: true }]}
      >
        <Select >
            <Option value="nehru" key={0}>Nehru</Option>
            <Option value="patel" key={1}>Patel</Option>
        </Select>
      </Form.Item>

      <Form.Item
      name = "year"
      label = "Year of study"
      rules={[{ required: true, message: '' }]}
      >
        <Select >
            <Option value="1" key={0}>1</Option>
            <Option value="2" key={1}>2</Option>
            <Option value="3" key={2}>3</Option>
            <Option value="4" key={3}>4</Option>
            <Option value="5" key={4}>5</Option>
        </Select>
      </Form.Item>
    </Form>
    </div>
  )
};

export default Signup;
