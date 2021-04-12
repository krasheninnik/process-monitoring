import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

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
      filenames: ["It is without web worker"],
      processPercentages: [10, 20, 30, 40, 50],
      percentage: 0,
    };

    console.log("in main");
    this.state.worker = new Worker("./workers/filenameListenerWorker.js");
    console.log(this.state.worker);
    this.state.worker.postMessage("Hello Worker");
    this.state.worker.onmessage = (e) => {
      this.setState({ filenames: [...this.state.filenames, e.data] });
    };
    console.log("worker started");
  }

  render() {
    const filenamesList = this.state.filenames.map((filename) => (
      <li>{filename}</li>
    ));

    return (
      <div>
        <div>
          <h1>
            <ul>Monitoring of execution</ul>
          </h1>
        </div>
        <ul>{filenamesList}</ul>
        <div>
          <ProcessList percentages={this.state.processPercentages} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Monitoring />, document.getElementById("root"));
