import {Alert, Form, Input, Button, Tooltip} from 'antd';
import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import useStores from '../stores';
import logo from '../assets/image/logo.png';

const Login = () => {
  const [isLoading, setLoading] = useState(false);
  const {rootStore} = useStores();
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (sessionStorage.getItem('accessToken')) history.replace('/orders');
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    await rootStore.authStore.login({
      body: values,
      success: () => {
        history.push('/leaves');
      },
      finally: () => {
        setLoading(false);
      },
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
      }}>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%',
          padding: '2.5%',
        }}>
        <div
          style={{
            width: '10%',
            display: 'flex',
            justifySelf: 'center',
          }}>
          <img src={logo} alt='logo' style={{width: '50%', margin: 'auto'}} />
        </div>
      </div>
      <div style={{width: '30%', margin: 'auto'}}>
        {location.hash === '#inactive' && (
          <Alert
            message='You have been logged out due to inactivity. Please login again.'
            type='warning'
            showIcon
            style={{marginBottom: 10}}
          />
        )}
        <Form form={form} name='basic' layout='vertical' onFinish={onFinish}>
          <div>
            <Form.Item
              label='Email'
              name='email'
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid email',
                },
                {
                  required: true,
                  message: 'Please enter email!',
                },
              ]}>
              <Input placeholder='Enter your email' />
            </Form.Item>
            <Form.Item
              label='Password'
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please enter password!',
                },
              ]}>
              <Input.Password placeholder='Enter your password' />
            </Form.Item>
          </div>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              block
              loading={isLoading}
              style={{marginTop: 20}}>
              Sign In
            </Button>
          </Form.Item>
          <div style={{textAlign: 'center', fontWeight: '600'}}>
            TM & © Leave Management System. All Rights Reserved.
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
