
import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  Welcome,
  Demo
} from '../index';
import { AliveScope } from 'react-activation';

import LinkTable from './LinkTable'
import Table from './Table'
import LinkQueryForm from './LinkQueryForm'
import LinkTree from './LinkTree'
import Login from './Login/Login'

import Scard from '../components/CardActions/Scard'
import Smodal from './Modal'

import BasicLayout from './Layouts/BasicLayout'
import PageLoading from '../components/PageLoading'
import Collapse from './Collapse'
import Form from './Form'
import AutoFlow from './AutoFlow'
import Test from './Test'
import Total from '../components/Test/test'
import TreeTable from '../components/Table/TreeTable';
import TextArea from '../components/TextArea';
import XForm from './Form/XForm';
import InputChoose from './InputChoose/index'

storiesOf('Test', module)
  .add('test', () => (
    <AliveScope>
      <Test />
    </AliveScope>
  ))
  .add('test2', () => (
    <TextArea />
  ))

  .add('total', () => (
    <Total />
  ))

  .add('XForm', () => (
    <XForm />
  ))

storiesOf('Layouts', module)
  .add('SiderMenu', () => (
    <BasicLayout />
  ))

  .add('PageLoading', () => (
    <PageLoading />
  ))

storiesOf('Welcome', module)
  .add('welcome', () => (
    <Welcome />
  ))

storiesOf('Demo', module)
  .add('demo', () => (
    <Demo content='Click' />
  ))

storiesOf('Scard', module)
  .add('Scard', () => (
    <Scard
      title='树'
      bordered
    >
      <LinkTree />
    </Scard>
  ))

storiesOf('Modal', module)
  .add('Smodal', () => (
    <Smodal />
  ))

storiesOf('Collapse', module)
  .add('Collapse', () => (
    <Collapse />
  ))

storiesOf('Login', module)
  .add('Login', () => (
    <Login />
  ))

storiesOf('Table', module)
  .add('LinkTable', () => (
    <LinkTable />
  ))
  .add('TreeTable', () => (
    <TreeTable />
  ))

  .add('LinkQueryForm', () => (
    <LinkQueryForm />
  ))

  .add('New Table', () => (
    <Table />
  ))

storiesOf('LinkTree', module)
  .add('LinkTree', () => (
    <LinkTree />
  ))
storiesOf('Form', module)
  .add('Form', () => (
    <Form />
  ))
  .add('InputChoose', () => (
    <InputChoose />
  ))

storiesOf('AutoFlow', module)
  .add('AutoFlow', () => (
    <AutoFlow />
  ))