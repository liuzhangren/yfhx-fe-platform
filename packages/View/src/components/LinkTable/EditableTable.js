/* eslint-disable */
import React from 'react'
import { Table, Form, Input } from 'antd';
import styles from './EditableTable.less';

export const EditableContext = React.createContext();

//TODO cellEdit 模式还有显示问题
class EditableCell extends React.Component {

    state = { editing: false }

    // editing 为单元格编辑状态，取值为 true 时 表示可编辑 false 时为只读状态
    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing && this.inputCoponent) {
                let { focus } = this.inputComponent;
                if (focus) {
                    this.inputComponent.focus();
                }
            }
        })
    };

    // 当组件编辑模式为 cellEdit 的时候，就使用单元格自己的编辑状态
    getEditing() {
        const { mode, editing, inputType } = this.props;
        if (mode === 'cellEdit') {
            if (inputType === 'SingleCheckBoxExt') {
                return true;
            }
            return this.state.editing;
        }
        return editing;

    }

    // 只要不是SingleCheckBoxExt 就给回车事件 和失去焦点事件 让其回到不可编辑状态
    getInputComponentProps = (inputType, inputProps) => {
        if (inputType !== 'SingleCheckBoxExt') {
            const props = {
                ...inputProps,
                onPressEnter: this.toggleEdit,
                onBlur: this.toggleEdit,
                ref: (inputComponent) => { this.inputComponent = inputComponent }
            }
            return props;
        }
        return inputProps;
    }

    // 行编辑模式，就使用单元格本身的dataIndex 作为表单的key   列编辑模式则使用record.key + dataIndex
    getFormItemKey = ()=>{
        const { mode, record, dataIndex } = this.props;
        if(mode === 'cellEdit'){
            return `${record.key}_${dataIndex}`
        }
        return dataIndex
    }

    renderCell = (form) => {
        this.form = form;
        const editing = this.getEditing();
        const {
            mode,
            dataIndex,
            component,
            title,
            inputType,
            inputProps,
            rules,
            record,
            renderInitialValue,
            index,
            children,
            ...restProps
        } = this.props;

        const props = this.getInputComponentProps(inputType, inputProps);

        const { getFieldDecorator } = form;

        // 单元格编辑状态会给组件添加悬停样式
        const wrapperChildren = mode === 'cellEdit' ? (
            <div
                className={"editable-cell-value-wrap"}
                style={{ paddingRight: 24, width:'100%' }}
                onClick={this.toggleEdit}
            >
                {children}
            </div>
        ) : (children)

        const itemKey = this.getFormItemKey();
        return (<td {...restProps}>
            {editing ? (
                <Form.Item style={{ margin: 0 }}>
                    {getFieldDecorator(itemKey, {
                        rules,
                        initialValue: renderInitialValue ? renderInitialValue(record[dataIndex]) : record[dataIndex],
                    })(<Input {...props}/> )}
                </Form.Item>
            ) : (wrapperChildren)}
        </td>
        );
    };


    render() {
        const {
            mode,
            dataIndex,
            editable,
            title,
            inputType,
            inputProps,
            rules,
            record,
            renderInitialValue,
            index,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                        children
                    )}
            </td>
        );
    }
}

class EditableTable extends React.Component {

    render() {
        const components = {
            body: {
                cell: EditableCell,
            }
        };
        const { form, ...rest } = this.props;
        return (
            <EditableContext.Provider value={form}>
                <Table
                    className={styles.editableTable}
                    rowClassName={() => 'editable-row'}
                    components={components}
                    {...rest}
                />
            </EditableContext.Provider>
        );
    }
}

/**
 * 从组件初始化开始,每次表格中表单项有变化,就会检测和初始化数据是否相同，不同返回有变化的值
 * 
 * @return method param {*} dataSource 表格的初始化数据
 *                param {*} changedValues 表格中表单每次变化的项的值
 *                return {key:{dataInde:value}} // key为有变化的记录的key
 */
function getChangedValues() {

    // 有变化的值
    let modifiedRecords = {};

    return (dataSource, changedValues) => {
        if (changedValues === undefined || dataSource === undefined) {
            return;
        }

        const vKeys = Object.keys(changedValues);
        // 列名
        const vKey = vKeys[0];
        const arr = vKey.split('_');
        // key为 表格记录的key  dataIndex 为列名
        const key = arr[0];
        const dataIndex = arr[1];
        const records = dataSource.filter(item => (item.key == key));
        if (records.length === 0) {
            return;
        }
        // 如果修改的值和初始值不一样的话就说明这个一行被改过了
        const [ record ] = records; 
        if (record[dataIndex] !== changedValues[vKey]) {
            if (modifiedRecords[record.id]) {
                modifiedRecords[record.id][dataIndex] = changedValues[vKey];
                return modifiedRecords
            }
            modifiedRecords[record.id] = new Object();
            modifiedRecords[record.id][dataIndex] = changedValues[vKey];
            return modifiedRecords;
        }
        // 如果和初始值相等,且存在修改则 delete 属性
        if (modifiedRecords[record.id]) {
            delete modifiedRecords[record.id][dataIndex]
            return modifiedRecords
        }
    }

}

const addChanges = getChangedValues();

export default Form.create({
    // 除了SingleCheckBoxExt 之外的都要点击才显示
    onValuesChange: (props, changedValues, allValues) => {
        const { handleSave, dataSource } = props;
        const modifiedRecords = addChanges(dataSource, changedValues);
        if (modifiedRecords) {
            handleSave(modifiedRecords)
        }
    }
})(EditableTable);




