import React, {useState} from 'react'


export default function FuncChild(props) {
  console.log(props);
  const [name, setName] = useState(props.name);
  return (
    <div>
      <h2 style={{ color: 'pink' }}>我是一个Func组件: 接收的参数为{name}</h2>
      <button onClick = {()=>{
        setName('使用useState Hook');
      }}>修改我的名字</button>
    </div>);
}