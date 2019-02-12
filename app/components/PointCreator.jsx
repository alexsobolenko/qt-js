import React from 'react';

export default class PointCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newItem: '', len: 1 };
    this.addPointItem = this.addPointItem.bind(this);
    this.itemChange = this.itemChange.bind(this);
  }

  addPointItem(e) {
    e.preventDefault();
    if (!this.state.newItem.length) return;
    this.props.addNew(this.state.newItem);
    this.setState({ newItem: '', len: this.state.len + 1 });
  }

  itemChange(e) {
    this.setState({ newItem: e.target.value, len: this.state.len });
  }

  render() {
    return (
      <form onSubmit={this.addPointItem}>
        <input className="block__creator" onChange={this.itemChange} value={this.state.newItem} />
      </form>
    );
  }
}
