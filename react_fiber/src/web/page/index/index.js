import React, {useEffect, useRef, useState} from 'react'
import { Link } from 'react-router-dom'
import { DatePicker , Button, TimePicker} from 'antd'
import moment from 'moment'

import './index.less'

function Page (props) {
  //<HTMLIFrameElement>
  const timeRef = useRef(null)
  const dateRef = useRef(null)
  const [time, setTime] = useState(Date())
  const [date, setDate] = useState(Date())

  useEffect(() => {
    setTimeout(()=>{
      window.location.href = 'baidu';
    }, 100);
  }, [timeRef, dateRef])

  return (
    <div className='normal'>
      <div className='welcome' />
      <ul className='list'>
        {
          props.news && props.news.map(item => (
            <li key={item.id}>
              <div>文章标题: {item.title}</div>
              <div className='toDetail'><Link to={`/news/${item.id}`}>点击查看详情</Link></div>
            </li>
          ))
        }
      </ul>
      <DatePicker ref = {dateRef} size = 'large' defaultValue = {moment('2021-05-21', 'yyyy-MM-DD')}
        onChange = {(date)=>{
          //console.log(date);
          setDate(date.toDate());
        }}
      />
      <TimePicker ref = {timeRef}  size = "large" defaultValue = {moment('13-14-11', 'HH-mm-ss')}/>
      <br />
      <Button type = "primary" size = "large" onClick = {()=>{
        alert('测试当前时间'+date)

      }}>123</Button>
      {/* <DatePicker /> */}
    </div>
  )
}

Page.getInitialProps = (ctx) => {
  return Promise.resolve({
    news: [
      {
        id: '1',
        title: 'Racket v7.3 Release Notes'
      },
      {
        id: '2',
        title: 'Free Dropbox Accounts Now Only Sync to Three Devices'
      },
      { id: '3',
        title: 'Voynich Manuscript Decoded by Bristol Academic'
      },
      { id: '4',
        title: 'Burger King to Deliver Whoppers to LA Drivers Stuck in Traffic'
      },
      { id: '5',
        title: 'How much do YouTube celebrities charge to advertise your product? '
      }
    ]
  })
}
export default Page
