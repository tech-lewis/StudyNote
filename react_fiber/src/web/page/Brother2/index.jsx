import React, {useState} from 'react'
import styles from './Brother.module.css'

export default function Brother2(props) {
    //console.log(styles);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // 第一种实现方式, 东西多了容易出错
    // const changeUsernameHandler = (e) => {
    //   setUsername(e.target.value)
    // }
    // const changePasswordHandler = (e) => {
    //   setPassword(e.target.value)
    // }
    /// 如何利用一个函数String的名字去执行这个函数呢
    const changeInputValue = (e, functionName) =>{} 
    return (<div>

      <span className = {styles.test}>我是兄弟组件2 Login</span>
      <span>账号</span><input type="text" value = {username} onChange = {(e)=>{setUsername(e.target.value)}}/>
      {/* <span>密码</span><input type="text" value = {password} onChange = {changePasswordHandler}/> */}
      <button onClick = {()=>{
        console.log(`你输入的用户名${username} 密码为${password}`);
      }}>登录</button>
    </div>)
}