import React from "react";
import "./vote.css";

export default class Vote extends React.Component {
  state = {
    label: "",
  };

  render() {
    const _ = require("lodash");

    const { vote } = this.props;
    const getColor = () => {
      if (vote > 0 && vote <= 3) {
        return "#E90000";
      }
      if (vote > 3 && vote < 5) {
        return "#E97E00";
      }
      if (vote >= 5 && vote < 7) {
        return "#E9D100";
      }
      if (vote >= 7) {
        return "#66E900";
      } else {
        return "lightgrey";
      }
    };
    return (
      <div className="score" style={{ borderColor: `${getColor()}` }}>
        <span className="score-item">{vote.toFixed(1)}</span>
      </div>
    );
  }
}
