import { Button, Table } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

export default (app) => {
  [Button, Table].forEach((Component) => {
    app.use(Component);
  });
};
