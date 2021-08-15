import React, {useState, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {observer} from 'mobx-react';
import {Button, DatePicker, Input, Space, Select, Typography, Tabs} from 'antd';
import {toJS} from 'mobx';
import useStores from '../../stores';

const {Option} = Select;
const {TabPane} = Tabs;
const {Title} = Typography;

const Calendar = () => {
  const {rootStore} = useStores();
  const history = useHistory();
  const location = useLocation();
  const [tabKey, setTabKey] = useState('');
  const [data, setData] = useState([]);

//   const fetchOrders = async () => {
//     setNextCursor(null);
//     setData([]);
//     setTotal(true);
//     setResetPagination(true);
//     rootStore.uiStore.loader.show();
//     let body = {
//       filter,
//       filterVal,
//     };
//     if (tabKey !== 'all' && tabKey !== 'today')
//       Object.assign(body, {status: tabKey});
//     if (date)
//       Object.assign(body, {date: date && date.startOf('day').utc().format()});
//     if (tabKey === 'today')
//       Object.assign(body, {date: moment().startOf('day').utc().format()});
//     await rootStore.orderStore.getOrders({
//       body,
//       success: (res, nextCursor) => {
//         setData(toJS(res));
//         if (nextCursor) {
//           setNextCursor(nextCursor);
//           setTotal(false);
//           setResetPagination(false);
//         } else setNextCursor(null);
//       },
//       finally: () => {
//         rootStore.uiStore.loader.hide();
//       },
//     });
//   };

  return (
    <>
      <Title level={3}>Calendar</Title>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
          alignItems: 'center',
        }}>
        
      </div>
    </>
  );
};

export default observer(Calendar);
