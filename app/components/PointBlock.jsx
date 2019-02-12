import React from 'react';
import PointCreator from './PointCreator.jsx';
import PointList from './PointList.jsx';

export default class PointBlock extends React.Component {
  constructor(props) {
    super(props);
    this.addNew = this.addNew.bind(this);
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

  addNew(value) {
    this.props.addNew(value);
  }

  render() {
    return (
      <div className="block">
        <PointCreator addNew={this.addNew} />
        <PointList point={this.state.point} killPoint={this.killPoint} />
      </div>
    );
  }
}
