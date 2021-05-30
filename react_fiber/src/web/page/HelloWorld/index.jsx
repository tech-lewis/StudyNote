import React from 'react' // 在 React V15.5 版本之前，类型校验的能力，和 react 是在一起；
import Types from 'prop-types' // 导入类型校验的包
import FuncChild from '../FuncChild'
import Brother1  from '../Brother'
import Brother2  from '../Brother2'
import {DatePicker} from 'antd'
/*
  Vue组件生命周期的复习 11+2
  render和data的生命周期 keep-alive的时候多的两个生命周期的actived和deactived在显示和消失调用

  actived和deactived 微信公众号的文章浏览位置
  1 create beforeCreate  发送网络请求的，页面的埋点操作
  2 mount beforeMount    初次渲染完毕修改DOM在这里  
  3 update beforeUpdate
  4 destoryed beforeDestoryed 销毁定时器清除资源，统计页面停留的时间。恢复阅读的位置，通过阅读的网络请求位置

  应用场景 使用生命周期的，发布房源的时候退出编辑保存到草稿箱中，再次自动填充
  1.自动滚动 beforeDestoryed到update 2.统计用户喜好和使用情况create和销毁 3.完成自动填充 beforeDestoryed和mount挂在填充
*/
export default class HelloWorld extends React.Component {
  // 为外界传递过来的 props 属性值，做类型校验
  static propTypes = {
    // 如果，外界在使用组件的时候，某个 props 属性是必须要被传递的，则 可以是用 isRequired 来进行标记；
    data: Types.number.isRequired, // 规定， 外界传递过来的 data 必须是 number，否则，就报错；
    theName: Types.string.isRequired
  }

  // 如果外界在使用组件的时候，没有传递规定的属性值，则 组件内，需要有一个默认的属性值；
  static defaultProps = {
    data: 10,
    theName: ''
  }

  // 初始化私有的数据
  constructor(props) {
    super()
    this.state = {
      name: props.theName,
      arrayData: [1, 2, 3, 4, 5, 6, 7, 8, 9, '=============分割线']
    }

    // console.log("测试ES6语法", ...this.state.arrayData);
  }

  // 相当于 Vue 中的 created 函数；组件的 props 和 state 数据，都已经可以被访问了；
  componentWillMount() { }

  // 虚拟DOM正在被创建；当 render 执行完， 虚拟DOM才创建到内存中；
  render() {
    return (<div>
      
      <label htmlFor="">请输入你的姓名</label>
      <FuncChild name = "marklewis" />
      <DatePicker />
      <input style = {{height: 30+'px', margin: 20}} type="text" placeholder={this.props.name} onChange={(e) => {
        //console.log(e.target.value)
        this.setState({
          name: e.target.value
        })
      }} />

      <br />
      <h1>父组件传递的参数是 {this.props.data}</h1>
      <h2>{this.state.name}</h2>


      
      <ul>
        {this.state.arrayData.map((item, index) => {
          return <li key={index}>我是数据=={item}</li>
        })}
        {this.state.arrayData.map((item, index) => {
          return <li key={index}>我是数据=={item}</li>
        })}
        {this.state.arrayData.map((item, index) => {
          return <li key={index}>我是数据=={item}</li>
        })}
      </ul>

      <ol style = {{backgroundColor: 'pink'}}>
        {this.state.arrayData.map((item, index) => {
          return <li key={index}>我是数据=={item}</li>
        })}
      </ol>

      <div className = 'left'>
        <Brother1 />
      </div>

      <div className = 'right'>
        <Brother2 />
      </div>
    </div>);
  }

  // 已经第一次被渲染到页面上；相当于 Vue 中的 mounted 函数；用于初始化第三方插件
  componentDidMount() { }

  // 运行阶段的第一个生命周期函数
  // 使用这个 函数，可以按需更新页面；减少不必要的 DOM 渲染；
  shouldComponentUpdate(nextProps, nextState) {
    // 注意： 在 shouldComponentUpdate 方法中，如果想获取 最新的 state 值，千万不要使用 this.state.***  会比 nextProps,nextState晚一步
    return true //更新
    // return false 不更新
  }

  // 运行阶段 第二个生命周期函数 【组件将要被更新】
  componentWillUpdate() {
    // console.log(document.getElementById('myh3').innerHTML)
  }

  componentDidUpdate() { }

  // 组件的 porps 被改变，会重新触发 componentWillRevceiveProps
  componentWillReceiveProps(nextProps) { // 组件将要接收新属性
    this.setState({
      data: nextProps.data
    })
  }
}