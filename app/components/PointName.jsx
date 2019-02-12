import React from 'react';

export default class PointName extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span className="item__name">{this.props.name}</span>
    );
  }
}
