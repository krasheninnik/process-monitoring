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
      processPercentages: [10, 20, 30, 40, 50],
      percentage: 0,
    };
  }

  render() {
    return (
      <div>
        <div>
          <h1>
            <ul>Monitoring of execution</ul>
          </h1>
        </div>
        <div>
          <ProcessList percentages={this.state.processPercentages} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Monitoring />, document.getElementById("root"));
