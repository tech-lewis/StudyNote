import DOM from './Dom.js';
import instantiateComponent from './instantiateComponent';

// 旧的
// class App extends SimpleReact.Component {
//     render() {
//         return (
//             <div>
//                 <h1>111</h1>
//                 <h2>2222</h2>
//                 <Cpp />
//                 {this.state.count}
//             </div>
//         )
//     }
// }

// 复合组件

// App 的第一次update一定会 对比 2 个render的element
// 第二次 update 将会在DomComponent触发  diff

// {
//     type: 'div',
//     props: {
//         children: [] // 对比children数组中的elemment对象
//     }
// }
// class App extends SimpleReact.Component {

//     render() {
//         return (
//             <div>
//                 <h1>00000000000</h1>
//                 <h2>2222</h2>
//                 <Cpp />
//                 {this.state.count}
//             </div>
//         )
//     }
// }

class DomComponent {
    constructor(element) {
        // super();
        this._currentElement = element;
        this._domNode = null;
    }

    mountComponent() {
        // :dom
        // 通过 element 去创建dom
        var node = document.createElement(this._currentElement.type);
        this._domNode = node;
        // 需要一个方法去专门处理子节点
        // const children = 
        // this._renderComponents = 

        // 在mount的过程中可以去将子节点的instance存储起来

        this._renderDomChildren(this._currentElement.props);  // element对象

        return node;
    }


    /// 处理子节点的情况

    _renderDomChildren(props) {  // 递归
        // 获取 子节点信息 
        console.log('_renderDomChildren', props)
        // children
        // 1. string 或者 数字类型 2. 数组
        if (typeof props.children === 'string' || typeof props.children === 'number') {
            var textNode = document.createTextNode(props.children);
            // 如何插入 h1
            this._domNode.appendChild(textNode);
        } else if (props.children) {  // 小技巧
            // 1. 数组 2. 对象  [{type: 'div'}]
            var childrenNodes;   // 转换成真实dom

            if (Array.isArray(props.children)) {  //多个节点
                childrenNodes = props.children.map((el) => {  // element  => dom
                    // 
                    return instantiateComponent(el).mountComponent();
                });// [dom, dom]

            } else {  // 单个节点  element对象 
                childrenNodes = instantiateComponent(props.children).mountComponent();
            }
            DOM.appendChildren(this._domNode, childrenNodes);
        }
    }
}

export default DomComponent;