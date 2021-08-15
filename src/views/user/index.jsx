import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import { useLocalStore } from "mobx-react-lite";
import {observer} from 'mobx-react';
import {
  Button,
  Drawer,
  Form,
  Space,
  Input,
  Typography,
  Table,
  Switch,
  Tag
} from 'antd';
import {toJS} from 'mobx';
import useStores from '../../stores';
import empty from 'is-empty';

const {Title} = Typography;

const Leave = () => {
  const {rootStore} = useStores();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCurrentAdmin, setIsCurrentAdmin] = useState(false);
  const [total, setTotal] = useState(10);
  const [cursor, setCursor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const columns = [
    {
      key: 'name',
      title: 'Name',
      render: ({name}) => (
        <span>
          {name}
        </span>
      ),
      width: '20%',
    },
    {
      key: 'email',
      title: 'Email',
      render: ({email}) => (
        <span>
          {email}
        </span>
      ),
      width: '30%',
    },
    {
      key: 'role',
      title: 'Role',
      render: ({isAdministrator}) => <span>{isAdministrator ? <Tag color="green">Admin</Tag>: <Tag color="cyan">User</Tag> }</span>,
      width: '15%',
    },
    {
      key: 'action',
      title: '',
      align: 'center',
      render: (data) => (
        <Button
          onClick={() => onEdit(data)}
        >
          Edit
        </Button>
      ),
      width: '5%',
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const state = useLocalStore(() => ({
    get usersData() {
      return toJS(rootStore.userStore.users);
    },
  }));

  const fetchUsers = async () => {
    rootStore.uiStore.loader.show();
    await rootStore.userStore.getUsers({
      body: {
        cursor
      },
      success: (res, nextCursor) => {
        if(!empty(nextCursor)) {
          setCursor(nextCursor);
          setTotal(total + 10);
        }
      },
      finally: () => {
        rootStore.uiStore.loader.hide();
      },
    });
  };

  const onClose = () => {
    form.resetFields();
    setVisible(false);
    setCurrentUser(null);
    setIsCurrentAdmin(false);
  };

  const onEdit = (data) => {
    console.log(data)
    form.setFieldsValue(data);
    setCurrentUser(data);
    setIsCurrentAdmin(data.isAdministrator);
    setVisible(true);
  }

  const onCreate = () => {
    form.validateFields().then(async(values) => {
      
      await rootStore.userStore.createUser({
        body: values,
        success: () => {
          rootStore.uiStore.noty.success('User successfully created!');
          onClose();
        },
      });
    });
  };

  const onUpdate = () => {
    form.validateFields().then(async(values) => {
      values.id = currentUser._id
      console.log(values, currentUser);
      await rootStore.userStore.updateUser({
        body: values,
        success: (item) => {
          rootStore.uiStore.noty.success('User successfully updated!');
          onClose();
        },
      });
    });
  };

  const onChange = (page) => {
    if (page.current > currentPage) {
      fetchLeaves();
      setCurrentPage(page.current);
    }
  };

  return (
    <>
      <Title level={3}>Users</Title>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}>
        <Space>
          <Button type='primary' onClick={() => setVisible(true)}>
            Create
          </Button>
        </Space>
      </div>
      <Table
        rowKey={(item) => item._id}
        dataSource={state.usersData}
        columns={columns}
        pagination={{
          showSizeChanger: false,
          pageSize: 10,
          total: total,
          hideOnSinglePage: true,
        }}
        onChange={onChange}
        bordered
      />
      <Drawer
        title={
          <div>
            <div>{currentUser ? 'Edit user' : 'Create user'}</div>
          </div>
        }
        headerStyle={{background: '#000', color: '#fff'}}
        width={400}
        onClose={onClose}
        visible={visible}
        bodyStyle={{paddingBottom: 80}}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}>
            <Button onClick={onClose} style={{marginRight: 8}}>
              Cancel
            </Button>
            <Button onClick={currentUser ? onUpdate : onCreate} type='primary'>
              Save
            </Button>
          </div>
        }>
        <Form form={form} layout='vertical'>
          <Form.Item
            name='name'
            label='Name'
            rules={[{required: true, message: 'Please enter name'}]}>
            <Input />
          </Form.Item>
          {!currentUser && (<Form.Item
            name='email'
            label='Email'
            rules={[{required: true, message: 'Please enter email'}]}>
            <Input type="email" />
          </Form.Item>)}
          {!currentUser && (<Form.Item
            name='password'
            label='Password'
            rules={[{required: true, message: 'Please enter password'}, {min: 8, message: 'Password should be at least 8 characters'}]}>
            <Input type="password" />
          </Form.Item>)}
          <Form.Item
            name='isAdministrator'
            label='Is Admin?'>
            <Switch checked={isCurrentAdmin} onClick={(checked) => {setIsCurrentAdmin(checked)}}/>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default observer(Leave);
