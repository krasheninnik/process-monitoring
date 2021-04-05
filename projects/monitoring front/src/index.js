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
class Monitoring extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      percentage: 0,
    };
  }

  render() {
    return (
      <div>
        <ProgressBar percentage={this.state.percentage} />
      </div>
    );
  }
}

ReactDOM.render(<Monitoring />, document.getElementById("root"));
