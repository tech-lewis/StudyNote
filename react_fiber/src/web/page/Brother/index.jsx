import React from 'react'

/// 模块化的导入和css在哪没关系的 外面也不会报错的
//  import语句必须在其他代码的最前面 否则文件语法会报错的
/// 学习样式私有化的处理 css同名的处理情况 css的scoped 要用脚手架的规范哦
import './index.css'
import styles from './Brother1.module.css'


export default function Brother1(props) {
  
    const buttonStyleObj = {fontSize: 15+'px', color: 'gray'};
    return (<div>
      <span className = {styles.test}>我是兄弟组件1</span>
      <button style = {{fontSize: 15+'px', color: 'gray'}} onClick  ={()=>{
        console.log('处理组件传value')
      }}>传递参数给我的兄弟组件</button>
    </div>)
}