import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const ENQUEUED_TASK_STATUS = "-1";
const COMPLETED_TASK_STATUS = "100";

const Filler = (props) => {
  return <div className="filler" style={{ width: `${props.percentage}%` }} />;
};

const ProgressBar = (props) => {
  return (
    <div>
      <div>
        {props.name}: {props.percentage}
      </div>

      <div className="progress-bar">
        <Filler percentage={props.percentage} />
      </div>
    </div>
  );
};

class ProcessList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const progressBarsList = this.props.progressList.map(
      ({ filename, progress }) => (
        <div>
          <ProgressBar name={filename} percentage={progress} />
        </div>
      )
    );
    return <div>{progressBarsList}</div>;
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
    };

    // connect to WebSocket to receive processes updating information
    const ws = new WebSocket("ws://localhost:3001");
    ws.addEventListener("message", ({ data }) => {
      let allReceivedTasks = JSON.parse(data);

      // distribute task by its progress status:
      let enqueued = [];
      let processing = [];
      let completed = [];

      for (let task of allReceivedTasks) {
        if (task.progress === ENQUEUED_TASK_STATUS) enqueued.push(task);
        else if (task.progress == COMPLETED_TASK_STATUS) completed.push(task);
        else processing.push(task);
      }

      // update state
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
    return (
      <div>
        <div>
          <h1>
            <ul>Monitoring of execution</ul>
          </h1>
        </div>
        <h2> Enqueued tasks </h2>
        <ProcessList progressList={this.state.filesProgress.enqueued} />
        <h2> Processing tasks </h2>
        <ProcessList progressList={this.state.filesProgress.processing} />
        <h2> Completed tasks </h2>
        <ProcessList progressList={this.state.filesProgress.completed} />
      </div>
    );
  }
}

ReactDOM.render(<Monitoring />, document.getElementById("root"));
