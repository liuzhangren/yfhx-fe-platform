import React from 'react';
import {
  DatePicker,
  Input,
  InputNumber,
  Checkbox,
  Tag,
  ConfigProvider,
  TreeSelect,
  Cascader,
  Switch,
  Select,
  TimePicker
} from 'antd';
import YearPicker from './YearPicker'
import OptionSelect from './OptionSelect';
import IconSelect from './IconSelect';
import OptionCheckBox from './OptionCheckBox';
import OptionRadio from './OptionRadio';
import CronGenerator from './CronGenerator';
import DictSelect from './DictSelect';
import DictCheckBox from './DictCheckBox';
import DictRadio from './DictRadio';
import SingleCheckBoxExt from './SingleCheckBoxExt';
import ServiceSelect from './ServiceSelect';
import InputChoose from './InputChoose';
import MonthRangePicker from './MonthRangePicker';
import NoTextArea from '../../TextArea';
import SliderInput from './Slider'

import zhCN from 'antd/es/locale/zh_CN';
const { RangePicker, MonthPicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

// 根据类型得到组件(包含自定义组件,组件变多了再优化成单独的文件)
export default function getComponentByType(item) {
  if (item.componentType === 'input') {
    return (
      <Input
        placeholder={(item.props && item.props.disabled) ? '' : (item.placeholder || item.label)}
        {...item.props}
      />)
  }
  if (item.componentType === 'password') {
    return (
      <Input.Password placeholder={item.props.disabled ? '' : (item.placeholder || item.label)} />
    )
  }
  if (item.componentType === 'inputSearch') {
    return (
      <Input.Search
        placeholder={(item.props && item.props.disabled) ? '' : (item.placeholder || item.label)}
        {...item.props}
      />
    )
  }
  if (item.componentType === 'inputChoose') {
    return (
      <InputChoose
        placeholder={(item.props && item.props.disabled) ? '' : (item.placeholder || item.label)}
        {...item.props}
      />
    )
  }

  if (item.componentType === 'inputNumber') {
    return (
      <InputNumber
        style={{ width: '100%' }}
        placeholder={(item.props && item.props.disabled) ? '' : (item.placeholder || item.label)}
        max={(item.key === 'sort' || item.key === 'sortNo') ? 999 : item.props && item.props.max}
        min={(item.key === 'sort' || item.key === 'sortNo') ? 0 : item.props && item.props.min}
        {...item.props}
      />
    );
  }
  if (item.componentType === 'Switch') {
    item.props = item.props || {}
    return (
      <Switch
        {...item.props}
      />
    );
  }
  if (item.componentType === 'slider') {
    item.props = item.props || {}
    return (
      <SliderInput
        {...item.props}
      />
      // <Row>
      //   <Col span={12}>
      //     <Slider
      //       // {...item.props}
      //       value={2}
      //     />
      //   </Col>
      //   <Col span={4}>
      //     <InputNumber
      //       min={1}
      //       max={20}
      //       {...item.inputProps}
      //       value={1}
      //     />
      //   </Col>
      // </Row>
    );
  }
  if (item.componentType === 'selectTag') {
    item.props = item.props || {}
    return (
      <Select
        mode="tags"
        {...item.props}
      />
    );
  }
  if (item.componentType === 'textArea') {
    item.props = item.props || {}
    item.props.autoSize = item.props.autoSize || { minRows: 4 }
    item.props.maxlength = item.props.maxlength || 2000
    if (item.props.no) {
      return (
        <NoTextArea
          placeholder={(item.props && item.props.disabled) ? '' : (item.placeholder || item.label)}
          {...item.props}
        />
      )
    } else {
      return (
        <TextArea
          placeholder={(item.props && item.props.disabled) ? '' : (item.placeholder || item.label)}
          {...item.props}
        />
      );
    }
  }
  if (item.componentType === 'tag') {
    return <Tag {...item.props} />
  }
  if (item.componentType === 'datePicker') {
    return (
      <DatePicker
        placeholder={(item.props && item.props.disabled) ? '' : (item.placeholder || item.label)}
        {...item.props} style={{ width: '100%' }} />
    )
  }
  // TimePicker
  if (item.componentType === 'timePicker') {
    return (
      <TimePicker
        placeholder={(item.props && item.props.disabled) ? '' : (item.placeholder || item.label)}
        {...item.props}
      />
    )
  }
  if (item.componentType === 'rangerPicker') {
    return <RangePicker placeholder={(item.props && item.props.disabled) ? '' : (item.placeholder || item.label)} {...item.props} style={{ width: '100%' }} />;
  }

  if (item.componentType === 'monthRangerPicker') {
    return <MonthRangePicker placeholder={(item.props && item.props.disabled) ? '' : (item.placeholder || item.label)} {...item.props} style={{ width: '100%' }} />;
  }
  
  if (item.componentType === 'yearPicker') {
    return <YearPicker placeholder={(item.props && item.props.disabled) ? '' : (item.placeholder || item.label)} {...item.props} style={{ width: '100%' }}/>
  }

  if (item.componentType === 'monthPicker') {
    return <MonthPicker placeholder={(item.props && item.props.disabled) ? '' : (item.placeholder || item.label)} {...item.props} style={{ width: '100%' }} />;
  }
  if (item.componentType === 'serviceSelect') {
    return <ServiceSelect {...item.props} />;
  }
  if (item.componentType === 'optionSelect') {
    return <OptionSelect {...item.props} placeholder={(item.props && item.props.disabled) ? ' ' : null} />;
  }
  if (item.componentType === 'optionCheckbox') {
    return <OptionCheckBox {...item.props} />;
  }
  if (item.componentType === 'checkbox') {
    return <Checkbox {...item.props} />
  }

  if (item.componentType === 'SingleCheckBoxExt') {
    return <SingleCheckBoxExt {...item.props} />
  }
  if (item.componentType === 'optionRadio') {
    return <OptionRadio {...item.props} />;
  }
  if (item.componentType === 'iconSelect') {
    return <IconSelect {...item.props} />;
  }
  if (item.componentType === 'cronGenerator') {
    return <CronGenerator {...item.props} />
  }
  if (item.componentType === 'dictSelect') {
    return <DictSelect {...item.props} />
  }
  if (item.componentType === 'dictRadio') {
    return <DictRadio {...item.props} />
  }
  if (item.componentType === 'dictCheckBox') {
    return <DictCheckBox {...item.props} />
  }
  if (item.componentType === 'treeSelect') {
    return (
      <TreeSelect
        treeNodeFilterProp='title'
        allowClear
        showSearch
        {...item.props}
        style={{ width: '100%' }}
        dropdownStyle={{
          maxHeight: 500
        }}
      />
    )
  }
  if (item.componentType === 'cascader') {
    return <Cascader {...item.props} style={{ width: '100%' }} />
  }

  return (<Input
    //     placeholder={item.placeholder || item.label}
    placeholder={(item.props && item.props.disabled) ? '' : (item.placeholder || item.label)}
    {...item.props}
  />)
}