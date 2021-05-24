// argument
function createElement(type, config, children) 
{
    // const props = Object.assign({}, config);
    /// 拷贝
    const configStr = JSON.stringify(config);

    var props = Object();
    props.config = JSON.parse(configStr);
    // 判断参数长度
    const childrenLenth = [].slice.call(arguments).length - 2;
    console.log(arguments);
    debugger
    if (childrenLenth > 1) {
        props.children = [].slice.call(arguments, 2);
    } else if (childrenLenth === 1) {
        // 长度 = 1
        props.children = children;
    }

    return {
        type,
        props
    }
}

export default {
    createElement
}
// 1. element长什么样？
//    props, type, children
// 2. 接受几个参数
//  接受无数个参数，从第3个开始，后面的都是子节点

// createElement('div', { id: 'app' }, 'hello');

// {
//     type: 'div',
//     props: {
//         id: 'app',
//         children: 'hello'
//     }
// }

// createElement('div', {id: 'app'}, 'hello',createElement('span', null, 'xxxx'))

// {
//     type: 'div',
//     props: {
//         id: 'app',
//         children: [
//             'span',
//             {
//                 type: 'span',
//                 props: {
//                     children: 'xxxx'
//                 }
//             }
//         ]
//     }
// }


