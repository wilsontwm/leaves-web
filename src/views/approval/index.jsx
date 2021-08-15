import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import { useLocalStore } from "mobx-react-lite";
import {observer} from 'mobx-react';
import moment from 'moment';
import {
  Button,
  Form,
  Typography,
  Table
} from 'antd';
import {toJS} from 'mobx';
import useStores from '../../stores';
import empty from 'is-empty';

const {Title} = Typography;

const Approval = () => {
  const {rootStore} = useStores();
  const [total, setTotal] = useState(10);
  const [cursor, setCursor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const columns = [
    {
      key: 'userId',
      title: 'User ID',
      render: ({userId}) => (
        <span>
          {userId}
        </span>
      ),
      width: '15%',
    },
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
      width: '10%',
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
        <div>
           <Button
            type="primary"
            onClick={() => onReview(data._id, "ACCEPTED")}
            disabled={data.status !== "PENDING"}
            style={{marginLeft: '3px'}}
            >
              Accept
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => onReview(data._id, "REJECTED")}
              disabled={data.status !== "PENDING"}
              style={{marginLeft: '3px'}}
            >
              Reject
            </Button>
        </div>
       
      ),
      width: '30%',
    },
  ];

  useEffect(() => {
    getApprovals();
  }, []);

  const state = useLocalStore(() => ({
    get leavesData() {
      return toJS(rootStore.leaveStore.approvals);
    },
  }));

  const getApprovals = async () => {
    rootStore.uiStore.loader.show();
    await rootStore.leaveStore.getApprovals({
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


  const onReview = async(id, status) => {
    await rootStore.leaveStore.reviewLeave({
      body: {
        id, status
      },
      success: (item) => {
        rootStore.uiStore.noty.success('Leave successfully reviewed!');
        onClose();
      },
    });
  };

  const onChange = (page) => {
    if (page.current > currentPage) {
      getApprovals();
      setCurrentPage(page.current);
    }
  };

  return (
    <>
      <Title level={3}>Approvals</Title>
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
    </>
  );
};

export default observer(Approval);
