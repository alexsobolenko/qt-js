import React from 'react';

export default class PointKill extends React.Component {
  constructor(props) {
    super(props);
    this.killPoint = this.killPoint.bind(this);
  }

  killPoint() {
    this.props.killPoint(this.props.id);
  }

  render() {
    return (
      <span className="item__kill" onClick={this.killPoint}>x</span>
    );
  }
}
