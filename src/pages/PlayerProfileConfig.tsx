import React, {useEffect, useState} from 'react';
import {Button, Form, Input, notification, Select, Spin} from "antd";
import {useMutation, useQuery} from "react-query";
import {getPlayer, PlayerProfile, signUp} from "../api";
import {useNavigate} from "react-router-dom";
import {getUseQueryOptions} from "../utils";
import {DEPARTMENTS, HALLS} from "../constants";

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

  if (isUpdate && playerProfileQuery.isLoading) {
    return (
      <Spin tip={"Loading"}/>
    )
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
          name="upi_id"
          label="UPI ID"
          rules={[{required: true, message: ''}]}
        >
          <Input/>
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
