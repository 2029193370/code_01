import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

/**
 * Vue + Redux 线上书店应用
 * 
 * 本项目演示了如何在 Vue 3 中使用 Redux Toolkit 进行状态管理
 * Redux 是一个框架无关的状态管理库，可以与任何 UI 框架配合使用
 */

const app = createApp(App);

app.mount('#app');
