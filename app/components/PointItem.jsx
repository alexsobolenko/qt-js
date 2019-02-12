import React from 'react';
import PointName from './PointName.jsx';
import PointKill from './PointKill.jsx';

export default class PointItem extends React.Component {
  constructor(props) {
    super(props);
    this.killPoint = this.killPoint.bind(this);
  }

  killPoint(id) {
    this.props.killPoint(id);
  }

  render() {
    return (
      <li key={this.props.point.id} className="item">
        <PointName name={this.props.point.name} />
        <PointKill id={this.props.point.id} killPoint={this.killPoint} />
      </li>
    );
  }
}
