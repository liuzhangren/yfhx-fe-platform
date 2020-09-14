import React, { Component } from 'react';


export default class LinkComponent extends Component{
    static defaultProps = {
        disabled: false,
        style:{display:undefined}
    }
    
    renderJSX(props){
        return <div />
    }

    getWidgetProps(id){
        const widgetProps = []
        const widget = widgetProps.filter((widget)=> widget.widgetId == id)
        if(widget.length  > 0){
            return {
                isHide: widget[0].status == '1',
                isReadOnly: widget[1].status == '3'
            }
        }
        return null
    }
    render(){
        const widgetProps = this.getWidgetProps(this.props.id)
        let props = {
            ...this.props,
        }

        if(widgetProps != null){
            const disabled = widgetProps.isReadOnly
            const style = {
                ...this.props.style,
                display: widgetProps.isHide ? 'none' : undefined
            }
            props = {
                ...props,
                disabled,
                style
            }
        }
        return this.renderJSX(props)
    }
}