import React from 'react';
import PointItem from './PointItem.jsx';

export default class PointList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { point: [] };
    this.killPoint = this.killPoint.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.point !== this.state.point) {
      this.setState({ point: nextProps.point });
    }
  }

  killPoint(id) {
    this.props.killPoint(id);
  }

  render() {
    const list = this.state.point.map((point) =>
      <PointItem point={point} killPoint={this.killPoint} />
    );
    return (
      <ul className="list">{list}</ul>
    );
  }
}
