# Vue 2.6-Study
2013--iOS7--Standford CS193p

在2.5版本的VUE中已经支持JSX语法写函数组件啦

```ts
从 Vue 的 Babel 插件的 3.4.0 版本开始，我们会在以 ES2015 语法声明的含有 JSX 的任何方法和 getter 中 (不是函数或箭头函数中) 自动注入 const h = this.$createElement，这样你就可以去掉 (h) 参数了。对于更早版本的插件，如果 h 在当前作用域中不可用，应用会抛错。

学习render渲染函数https://cn.vuejs.org/v2/guide/render-function.html

1 然而在Vue一些场景中，你真的需要 JavaScript 的完全编程的能力。这时你可以用渲染函数，它比模板更接近编译器。

```



