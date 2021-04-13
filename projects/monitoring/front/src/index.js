import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import FilenameListenerWorker from "./workers/filenamelistener.worker";

const Filler = (props) => {
  return <div className="filler" style={{ width: `${props.percentage}%` }} />;
};

const ProgressBar = (props) => {
  return (
    <div className="progress-bar">
      <Filler percentage={props.percentage} />
    </div>
  );
};

class ProcessList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      processPercentages: props.percentages,
    };
  }

  render() {
    const listItems = this.state.processPercentages.map((number) => (
      <li>
        <ProgressBar percentage={number} />
      </li>
    ));
    return <ul>{listItems}</ul>;
  }
}
class Monitoring extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filesProgress: {
        enqueued: [],
        processing: [],
        completed: [],
      },
      processPercentages: [10, 20, 30, 40, 50],
      percentage: 0,
    };

    const ENQUEUED_STATUS = "-1";
    const COMPLETED_STATUS = "100";

    const ws = new WebSocket("ws://localhost:3001");
    ws.addEventListener("message", ({ data }) => {
      let enqueued = [];
      let processing = [];
      let completed = [];
      let allReceived = JSON.parse(data);
      for (let task of allReceived) {
        if (task.progress === ENQUEUED_STATUS) enqueued.push(task);
        else if (task.progress == COMPLETED_STATUS) completed.push(task);
        else processing.push(task);
      }

      this.setState({
        filesProgress: {
          enqueued: enqueued,
          processing: processing,
          completed: completed,
        },
      });
    });
  }

  render() {
    const enqueueTasksList = this.state.filesProgress.enqueued.map(
      ({ filename, progress }) => (
        <li>
          filename {filename}: {progress}
        </li>
      )
    );

    const processingTasksList = this.state.filesProgress.processing.map(
      ({ filename, progress }) => (
        <li>
          filename {filename}: {progress}
        </li>
      )
    );

    const completedTasksList = this.state.filesProgress.completed.map(
      ({ filename, progress }) => (
        <li>
          filename {filename}: {progress}
        </li>
      )
    );

    return (
      <div>
        <div>
          <h1>
            <ul>Monitoring of execution</ul>
          </h1>
        </div>
        <h2> Enqueued tasks </h2>
        <ul>{enqueueTasksList}</ul>
        <h2> Processing tasks </h2>
        <ul>{processingTasksList}</ul>
        <h2> Completed tasks </h2>
        <ul>{completedTasksList}</ul>
        <div>
          <ProcessList percentages={this.state.processPercentages} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Monitoring />, document.getElementById("root"));
