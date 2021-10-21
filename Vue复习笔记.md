# Vue 2.6-Study
2013--iOS7--Standford CS193p

# 开发中遇到的iView的报错

原因是 我给Table组件的columns中定义了4个含有slot的列，但是实际在<Table>中只使用了其中3个，导致的报错。

也就是，在 Table组件的columns中定义了多少个含有slot的列，那么在<Table>内部必须输出多少个，否则会报错。

```js
ivue 的报错 TypeError: ctx.injections.tableRoot.$scopedSlots[ctx.props.column.slot] is not a function
```



在2.5版本的VUE中已经支持JSX语法写函数组件啦

```ts
从 Vue 的 Babel 插件的 3.4.0 版本开始，我们会在以 ES2015 语法声明的含有 JSX 的任何方法和 getter 中 (不是函数或箭头函数中) 自动注入 const h = this.$createElement，这样你就可以去掉 (h) 参数了。对于更早版本的插件，如果 h 在当前作用域中不可用，应用会抛错。

学习render渲染函数https://cn.vuejs.org/v2/guide/render-function.html

1 然而在Vue一些场景中，你真的需要 JavaScript 的完全编程的能力。这时你可以用渲染函数，它比模板更接近编译器。
2 复习唐老师的写法
```



# Todo 

```js

Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // 标签名称
      this.$slots.default // 子节点数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})

用极客时间唐老师的写法来实验使用JSX语法
```



# Todo

```
Mutations
Action存储

Vue devtools浏览器工具的使用或者更新Firefox的浏览器插件
```



# Todo 唐金州-课程

```js
Slot的复习和v-slot指令的使用
slot-scope="{row}"旧版写法

1 前置图标和后置图标，渲染图标iCON到Button组件当中，就需要运用到Slot的
2 配置不同图标和大小颜色，可以用Slot进行自定义传递进子组件哦 2.5的语法使用<slot>标签
3 VUE版本2.6有新的指令的v-slot:pre-icon
4 默认插槽，具名插槽， 作用域Slot可以根据子组件传递参数内容
5 作用域Slot的用法是什么，怎么设置参数的默认值呢?
  相当于返回组件的函数，分发复杂内容的方式。template的限制
	可以理解为回调函数，并使用子组件调用函数callback的参数传到外面


v-model
checkbox
select
radio
input的语法糖是 input事件+value属性的语法糖
  
```



# Todo

- 周一发口罩
- 周四发餐巾纸

