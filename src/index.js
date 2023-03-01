import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

// 创建app根节点
const appEl = document.getElementById('editor');
// 设置id

// 最新版本使用的是ReactDOM.createRoot
// 如果使用ReactDOM.render()控制台会报warnning错误
const root = ReactDOM.createRoot(appEl);

// 渲染
root.render(<App />);