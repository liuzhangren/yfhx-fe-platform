import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import moment from 'moment';

export default class Gantt extends Component {
  dataProcessor = null;

  constructor(props) {
    super(props);
    this.initZoom();
  }

  componentDidMount() {
    const { columns } = this.props;
    gantt.config.xml_date = '%Y-%m-%d %H:%i';
    if (columns) {
      gantt.config.columns = columns;
    }
    gantt.plugins({
      tooltip: true,
    });
    gantt.templates.tooltip_text = (start, end, task) => `<b>任务名:</b> ${task.text}<br/><b>开始时间:</b> ${moment(task.start_date).format('YYYY-MM-DD')}<br/><b>周期:</b> ${task.duration}`;
    gantt.config.readonly = true;
    gantt.config.open_tree_initially = true;
    gantt.i18n.setLocale('cn');
    const { tasks } = this.props;
    gantt.init(this.ganttContainer);
    this.initGanttDataProcessor();
    gantt.parse(tasks);
  }

  componentWillReceiveProps(nextProps) {
    const { zoom } = nextProps
    if (zoom === 'Years') {
      gantt.templates.task_text = (start, end, task) => '';
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.zoom !== nextProps.zoom;
  }

  componentWillUnmount() {
    if (this.dataProcessor) {
      this.dataProcessor.destructor();
      this.dataProcessor = null;
    }
  }


  initZoom = () => {
    gantt.ext.zoom.init({
      levels: [
        {
          name: 'Years',
          scale_height: 60,
          min_column_width: 30,
          scales: [
            { unit: 'year', step: 1, format: '%Y 年' },
            { unit: 'month', step: 1, format: '%F' },
            // { unit: 'week', step: 1, format: '%W 周' },
            // { unit: 'day', step: 1, format: '%d 日' },
          ],
        },
        {
          name: 'Months',
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: 'month', step: 1, format: '%F' },
            // { unit: 'week', step: 1, format: '%W 周' },
            { unit: 'day', step: 1, format: '%d 日' },
          ],
        },
        {
          name: 'Weekend',
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: 'week', step: 1, format: '%W 周' },
            { unit: 'day', step: 1, format: '%d 日' },
          ],
        },
      ],
    });
  }

  setZoom = value => {
    gantt.ext.zoom.setLevel(value);
  }

  initGanttDataProcessor() {
    /**
     * type: "task"|"link"
     * action: "create"|"update"|"delete"
     * item: data object object
     */
    const { onDataUpdated } = this.props;
    this.dataProcessor = gantt.createDataProcessor((
      type,
      action,
      item,
      id,
    ) => new Promise(resolve => {
        if (onDataUpdated) {
          onDataUpdated(type, action, item, id);
        }
        return resolve();
      }));
  }

  render() {
    const { zoom } = this.props;
    this.setZoom(zoom);
    return (
      <div
        ref={input => { this.ganttContainer = input }}
        style={{ width: '100%', height: '100%' }}
      ></div>
    );
  }
}
