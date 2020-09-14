import { configure } from '@storybook/react';
import 'antd/dist/antd.less'
import 'ant-design-pro/dist/ant-design-pro.css';

function loadStories() {
  require('../src/stories/index');
}

configure(loadStories, module);
