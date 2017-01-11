import React from "react";

export default class RuleItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pish: "f" };
  }

  render() {
    return (
      <div
        className="ruleItem"
        ref={(node) => { this.item = node; }}
      >
        <div
          className="itemNormal"
          ref={(node) => { this.itemNorm = node; }}
        >
          <div className="checkBoxField">
            <div className="taskCheckbox">
              <div
                className="check"
                ref={(node) => { this.check = node; }}
              >
                <i className="fa fa-times-circle" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="ruleLine">
            <div
              style={{ backgroundColor: this.props.label }}
              className="projectLabel"
            />
            <div className="ruleName">{this.props.name}</div>
            <div className="fine"> {this.props.fine}</div>
          </div>
          <div
            id="editItem"
            ref={(node) => { this.eBtn = node; }}
          >
            <i className="fa fa-pencil-square-o" />
          </div>
        </div>
      </div>
    );
  }
}

RuleItem.propTypes = {
  label: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  fine: React.PropTypes.number.isRequired
};
