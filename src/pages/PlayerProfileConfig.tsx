import React, {useEffect} from 'react';
import {Button, Form, Input, notification, Select, Spin, Typography} from "antd";
import {useMutation, useQuery} from "react-query";
import {getPlayer, signUp} from "../api";
import {getUseQueryOptions} from "../utils";
import {DEPARTMENTS, HALLS} from "../constants";

const {Paragraph, Text} = Typography;
const {Option} = Select

export interface PlayerProfileConfigProps {
  isUpdate: boolean,
  closeCallback: Function
}

const PlayerProfileConfig = ({isUpdate, closeCallback}: PlayerProfileConfigProps) => {

  const [form] = Form.useForm()

  const playerProfileQuery = useQuery(
    [{"key": "playerProfile"}],
    getPlayer,
    getUseQueryOptions(1, 60 * 1000, isUpdate)
  )

  useEffect(() => {
    if (playerProfileQuery.isSuccess) {
      console.log(playerProfileQuery.data.profile)
      form.setFieldsValue(playerProfileQuery.data.profile)
    }
  }, [playerProfileQuery])

  const signUpQuery = useMutation(signUp, {
    onSuccess: (data) => {
      console.log(data)
      notification.success({message: isUpdate ? 'Profile Updated' : 'Signup successful'})
      closeCallback()
    },
    onError: (e) => {
      console.log(e)
      notification.error({message: 'An error occurred'})
    }
  })

  const onFinish = (values: any) => {
    signUpQuery.mutate(values)
  }

  if ((isUpdate && playerProfileQuery.isLoading) || signUpQuery.isLoading) {
    return (
      <div className='div-center'>
        <Spin tip={"Loading"}/>
      </div>

    )
  }

  return (
    <div style={{justifyContent: 'center', alignContent: 'center', display: 'flex'}}>
      <Form
        form={form}
        onFinish={onFinish}
        layout='vertical'
        initialValues={{upi_id: 'no.thanks@upi', gender: 'M'}}
        style={{width: 'fit-content'}}
      >
        <Paragraph>
          <Text strong>Note:</Text> No personal information will be shared with anyone. And the collected data will be
          deleted after the completion of the project
        </Paragraph>
        <Form.Item
          name="hall"
          label="Hall Of Residence"
          rules={[{required: true}]}
        >
          <Select showSearch options={HALLS.map(it => {
            return {value: it, label: it}
          })}/>
        </Form.Item>
        <Form.Item
          name="department"
          label="Department"
          rules={[{required: true}]}
        >
          <Select showSearch options={DEPARTMENTS.map(it => {
            return {value: it, label: it}
          })}/>
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

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{required: true, message: ''}]}
        >
          <Select>
            <Option value="M" key={0}>Male</Option>
            <Option value="F" key={1}>Female</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="upi_id"
          label="UPI ID"
          help={"Used to pay the experiment's rewards"}
          rules={[{required: false, message: ''}]}
          style={{paddingBottom: '10px'}}
        >
          <Input defaultValue="no.thanks@upi"/>
        </Form.Item>

        <Button
          type='primary'
          htmlType='submit'
        >
          {isUpdate ? 'Update' : 'Signup'}
        </Button>
      </Form>
    </div>
  )
};

export default PlayerProfileConfig;
