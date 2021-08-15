import React, {useState, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import { useLocalStore } from "mobx-react-lite";
import {Avatar, Layout, Menu, Dropdown, Card} from 'antd';
import {UpOutlined, DownOutlined, UserOutlined} from '@ant-design/icons';
import useStores from '../../stores';

const {Content, Sider} = Layout;
const {SubMenu} = Menu;

const Portal = ({children}) => {
  const {rootStore} = useStores();
  const history = useHistory();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [keys, setKeys] = useState(['']);
  const [user, setUser] = useState({});

  useEffect(() => {
    let path = location.pathname.replace('/', '');
    let newArr = [];
    newArr.push(path);
    setKeys(newArr);
    rootStore.authStore.setCurrentUser();
    if (!sessionStorage.getItem('accessToken')) history.replace('/');
  }, []);


  const state = useLocalStore(() => ({
    get currentUser() {
      return rootStore.authStore.currentUser;
    },
  }));

//   useEffect(() => {
//     let path = location.pathname.replace('/', '');
//     let newArr = [];
//     newArr.push(path);
//     setKeys(newArr);
//   }, [location]);

//   const fetchProfile = async () => {
//     rootStore.uiStore.loader.show();
//     await rootStore.authStore.getProfile({
//       body: {},
//       success: (res) => {
//         setUser(res);
//       },
//       finally: () => {
//         rootStore.uiStore.loader.hide();
//       },
//     });
//   };

  const onChangeMenu = (e) => {
    let newArr = [];
    newArr.push(e.key);
    setKeys(newArr);
    e.key !== 'logout' ? history.push(`/${e.key}`) : logOut();
  };

  const logOut = () => {
    sessionStorage.clear();
    history.push('/');
  };

  const profileMenu = (
    <Menu>
      <Menu.Item onClick={logOut}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Layout style={{minHeight: '100vh'}}>
        <Sider
          width='240'
          collapsible
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              padding: '20px 20px',
              marginBottom: '20px',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            {!collapsed && (
              <>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Avatar size='large' icon={<UserOutlined />} />
                  <div
                    style={{
                      marginLeft: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      maxWidth: '180px',
                    }}>
                    <span
                      style={{
                        fontWeight: 'bold',
                        overflowWrap: 'break-word',
                        lineHeight: 1,
                        marginBottom: 5,
                      }}>
                      {state.currentUser?.name}
                    </span>
                    <span
                      style={{
                        overflowWrap: 'break-word',
                        lineHeight: 1,
                        color: '#707070',
                      }}>
                      {state.currentUser?.email}
                    </span>
                  </div>
                </div>
                <Dropdown
                  overlay={profileMenu}
                  trigger={['click']}
                  placement='bottomRight'
                  overlayStyle={{left: '200px'}}>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                      }}>
                      <UpOutlined width='20px' />
                      <DownOutlined />
                    </div>
                  </div>
                </Dropdown>
              </>
            )}
          </div>
          <Menu mode='inline' onClick={onChangeMenu} selectedKeys={keys}>
            {collapsed && (
              <SubMenu
                key='user'
                icon={<UserOutlined />}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <Menu.Item key='logout' onClick={logOut}>
                  Logout
                </Menu.Item>
              </SubMenu>
            )}
            <Menu.Item
              key='leaves'
              icon={
                <span
                  style={{
                    width: '35px',
                  }}>
                  <span
                    style={{
                      display: 'flex',
                      width: '28px',
                      alignItems: 'center',
                    }}>
                    <svg class="svg-icon" viewBox="0 0 20 20">
                        <path d="M16.557,4.467h-1.64v-0.82c0-0.225-0.183-0.41-0.409-0.41c-0.226,0-0.41,0.185-0.41,0.41v0.82H5.901v-0.82c0-0.225-0.185-0.41-0.41-0.41c-0.226,0-0.41,0.185-0.41,0.41v0.82H3.442c-0.904,0-1.64,0.735-1.64,1.639v9.017c0,0.904,0.736,1.64,1.64,1.64h13.114c0.904,0,1.64-0.735,1.64-1.64V6.106C18.196,5.203,17.461,4.467,16.557,4.467 M17.377,15.123c0,0.453-0.366,0.819-0.82,0.819H3.442c-0.453,0-0.82-0.366-0.82-0.819V8.976h14.754V15.123z M17.377,8.156H2.623V6.106c0-0.453,0.367-0.82,0.82-0.82h1.639v1.23c0,0.225,0.184,0.41,0.41,0.41c0.225,0,0.41-0.185,0.41-0.41v-1.23h8.196v1.23c0,0.225,0.185,0.41,0.41,0.41c0.227,0,0.409-0.185,0.409-0.41v-1.23h1.64c0.454,0,0.82,0.367,0.82,0.82V8.156z"></path>
                    </svg>
                  </span>
                </span>
              }
              style={{display: 'flex', alignItems: 'center'}}>
              Leaves
            </Menu.Item>
            {state.currentUser?.isAdministrator && (<Menu.Item
              key='approvals'
              icon={
                <span
                  style={{
                    width: '35px',
                  }}>
                  <span
                    style={{
                      display: 'flex',
                      width: '20px',
                      alignItems: 'center',
                    }}>
                    <svg class="svg-icon" viewBox="0 0 20 20">
                        <path d="M15.396,2.292H4.604c-0.212,0-0.385,0.174-0.385,0.386v14.646c0,0.212,0.173,0.385,0.385,0.385h10.792c0.211,0,0.385-0.173,0.385-0.385V2.677C15.781,2.465,15.607,2.292,15.396,2.292 M15.01,16.938H4.99v-2.698h1.609c0.156,0.449,0.586,0.771,1.089,0.771c0.638,0,1.156-0.519,1.156-1.156s-0.519-1.156-1.156-1.156c-0.503,0-0.933,0.321-1.089,0.771H4.99v-3.083h1.609c0.156,0.449,0.586,0.771,1.089,0.771c0.638,0,1.156-0.518,1.156-1.156c0-0.638-0.519-1.156-1.156-1.156c-0.503,0-0.933,0.322-1.089,0.771H4.99V6.531h1.609C6.755,6.98,7.185,7.302,7.688,7.302c0.638,0,1.156-0.519,1.156-1.156c0-0.638-0.519-1.156-1.156-1.156c-0.503,0-0.933,0.322-1.089,0.771H4.99V3.062h10.02V16.938z M7.302,13.854c0-0.212,0.173-0.386,0.385-0.386s0.385,0.174,0.385,0.386s-0.173,0.385-0.385,0.385S7.302,14.066,7.302,13.854 M7.302,10c0-0.212,0.173-0.385,0.385-0.385S8.073,9.788,8.073,10s-0.173,0.385-0.385,0.385S7.302,10.212,7.302,10 M7.302,6.146c0-0.212,0.173-0.386,0.385-0.386s0.385,0.174,0.385,0.386S7.899,6.531,7.688,6.531S7.302,6.358,7.302,6.146"></path>
                    </svg>
                  </span>
                </span>
              }
              style={{display: 'flex', alignItems: 'center'}}>
              Approval
            </Menu.Item>)}
            {state.currentUser?.isAdministrator && (<Menu.Item
              key='users'
              icon={
                <span
                  style={{
                    width: '35px',
                  }}>
                  <span
                    style={{
                      display: 'flex',
                      width: '20px',
                      alignItems: 'center',
                    }}>
                    <svg class="svg-icon" viewBox="0 0 20 20">
                        <path d="M15.573,11.624c0.568-0.478,0.947-1.219,0.947-2.019c0-1.37-1.108-2.569-2.371-2.569s-2.371,1.2-2.371,2.569c0,0.8,0.379,1.542,0.946,2.019c-0.253,0.089-0.496,0.2-0.728,0.332c-0.743-0.898-1.745-1.573-2.891-1.911c0.877-0.61,1.486-1.666,1.486-2.812c0-1.79-1.479-3.359-3.162-3.359S4.269,5.443,4.269,7.233c0,1.146,0.608,2.202,1.486,2.812c-2.454,0.725-4.252,2.998-4.252,5.685c0,0.218,0.178,0.396,0.395,0.396h16.203c0.218,0,0.396-0.178,0.396-0.396C18.497,13.831,17.273,12.216,15.573,11.624 M12.568,9.605c0-0.822,0.689-1.779,1.581-1.779s1.58,0.957,1.58,1.779s-0.688,1.779-1.58,1.779S12.568,10.427,12.568,9.605 M5.06,7.233c0-1.213,1.014-2.569,2.371-2.569c1.358,0,2.371,1.355,2.371,2.569S8.789,9.802,7.431,9.802C6.073,9.802,5.06,8.447,5.06,7.233 M2.309,15.335c0.202-2.649,2.423-4.742,5.122-4.742s4.921,2.093,5.122,4.742H2.309z M13.346,15.335c-0.067-0.997-0.382-1.928-0.882-2.732c0.502-0.271,1.075-0.429,1.686-0.429c1.828,0,3.338,1.385,3.535,3.161H13.346z"></path>
                    </svg>
                  </span>
                </span>
              }
              style={{display: 'flex', alignItems: 'center'}}>
              Users
            </Menu.Item>)}
          </Menu>
        </Sider>
        <Layout className='site-layout'>
          <Content style={{margin: 40}}>
            <Card className='bg-white min-h-full'>{children}</Card>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Portal;
