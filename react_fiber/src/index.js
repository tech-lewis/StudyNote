console.log('项目启动成功');
// 分析以下，咱们需要实现哪些核心方法  可以实现react的渲染

// 1. render 渲染入口
// 2. createElement  创建 element对象 
// 3. Component   组件类
// 4. setState   更新 
//import React, { Component, Fragment } from 'react'
import ReactDom from 'react-dom'

//  0 - > 1 React
import SimpleReact from './simpleReact';

// 可以转为element对象吗？
window.React = {};
React.createElement = SimpleReact.createElement;


var domComps = <div><h1>Hello</h1></div>;
SimpleReact.render(domComps, document.querySelector("#app"));


// class Demo extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {}
//   }
//   render () {
//     return (<Fragment>
      
//     </Fragment>)
//   }
// }
// test jsx
// ReactDom.render(<div><p>Hello</p></div>, document.querySelector("#app"));