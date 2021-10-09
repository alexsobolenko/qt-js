import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import {DragSource, DropTarget} from 'react-dnd';
import flow from 'lodash/flow';

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
        };
    },
};

const cardTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        if (dragIndex === hoverIndex) return;

        const hoverBoundingRect = (findDOMNode(component)).getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = (clientOffset).y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

        props.moveCard(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    },
};

class Card extends React.Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        index: PropTypes.number.isRequired,
        isDragging: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        text: PropTypes.string.isRequired,
        moveCard: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.killPoint = this.killPoint.bind(this);
    }

    killPoint() {
        this.props.killPoint(this.props.id);
    }

    render() {
        const opacity = (this.props.isDragging ? 0 : 1);

        return (
            this.props.connectDragSource &&
            this.props.connectDropTarget &&
            this.props.connectDragSource(
                this.props.connectDropTarget(
                    <a className="item panel-block" style={{ opacity }}>
                        <span className="item__name">{this.props.id}: <strong>{this.props.name}</strong></span>
                        <span className="item__kill button is-danger" onClick={this.killPoint}>&times;</span>
                    </a>
                ),
            )
        );
  }
}

export default flow(
    DragSource(
        'card',
        cardSource,
        (connect, monitor) => ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        }),
    ),
    DropTarget('card', cardTarget, (connect) => ({
        connectDropTarget: connect.dropTarget(),
    }))
)(Card);
