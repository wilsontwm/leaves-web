import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import { useLocalStore } from "mobx-react-lite";
import {observer} from 'mobx-react';
import moment from 'moment';
import {
  Button,
  Drawer,
  Form,
  Space,
  DatePicker,
  Typography,
  Table,
  Select
} from 'antd';
import {toJS} from 'mobx';
import useStores from '../../stores';
import empty from 'is-empty';

const {Title} = Typography;
const { RangePicker } = DatePicker;
const {Option} = Select;

const Leave = () => {
  const {rootStore} = useStores();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [currentLeave, setCurrentLeave] = useState(null);
  const [total, setTotal] = useState(10);
  const [cursor, setCursor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const columns = [
    {
      key: 'date',
      title: 'Date',
      render: ({startAt, endAt}) => (
        <span>
          {moment(startAt).format('DD/MM/YYYY')} - {moment(endAt).format('DD/MM/YYYY')}
        </span>
      ),
      width: '30%',
    },
    {
      key: 'noOfDays',
      title: 'No. of days',
      render: ({noOfDays}) => (
        <span>
          {noOfDays} day{noOfDays > 1 ? 's' : ''}
        </span>
      ),
      width: '30%',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (data) => <span>{data}</span>,
      width: '15%',
    },
    {
      key: 'action',
      title: '',
      align: 'center',
      render: (data) => (
        <Button
          onClick={() => onEdit(data)}
          disabled={data.status !== "PENDING"}
        >
          Edit
        </Button>
      ),
      width: '5%',
    },
  ];

  useEffect(() => {
    fetchLeaves();
  }, []);

  const state = useLocalStore(() => ({
    get leavesData() {
      return toJS(rootStore.leaveStore.leaves);
    },
  }));

  const fetchLeaves = async () => {
    rootStore.uiStore.loader.show();
    await rootStore.leaveStore.getLeaves({
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
    setCurrentLeave(null);
  };

  const onEdit = (data) => {
    let formValue = {
      date: [
        moment(data.startAt),
        moment(data.endAt)
      ],
      status: data.status
    }
    form.setFieldsValue(formValue);
    setCurrentLeave(data);
    setVisible(true);
  }

  const onCreate = () => {
    form.validateFields().then(async(values) => {
      let data = {
        startAt: values.date[0],
        endAt: values.date[1]
      };
      
      await rootStore.leaveStore.createLeave({
        body: data,
        success: () => {
          rootStore.uiStore.noty.success('Leave successfully applied!');
          onClose();
        },
      });
    });
  };

  const onUpdate = () => {
    form.validateFields().then(async(values) => {
      let data = {
        id: currentLeave._id,
        startAt: values.date[0],
        endAt: values.date[1],
        status: values.status
      };
    
      await rootStore.leaveStore.updateLeave({
        body: data,
        success: (item) => {
          rootStore.uiStore.noty.success('Leave successfully updated!');
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
      <Title level={3}>Leaves</Title>
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
        dataSource={state.leavesData}
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
            <div>Apply leave</div>
            <p style={{fontSize: 12}}>
              Apply leave by filling up the information below
            </p>
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
            <Button onClick={currentLeave ? onUpdate : onCreate} type='primary'>
              Apply
            </Button>
          </div>
        }>
        <Form form={form} layout='vertical'>
          <Form.Item
            name='date'
            label='Date'
            rules={[{required: true, message: 'Please enter date'}]}>
            <RangePicker />
          </Form.Item>
          {currentLeave && (
          <Form.Item
            name='status'
            label='Status'
            rules={[{required: true, message: 'Please select status'}]}>
            <Select
              placeholder='Select status'
            >
              <Option value='PENDING'>Pending</Option>
              <Option value='CANCELLED'>Cancelled</Option>
            </Select>
          </Form.Item>)}
        </Form>
      </Drawer>
    </>
  );
};

export default observer(Leave);
