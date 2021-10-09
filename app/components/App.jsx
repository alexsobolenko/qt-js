import React from 'react';
import ymaps from 'ymaps';
import Card from './Card.jsx';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';
const update = require('immutability-helper');

class App extends React.Component {
    state = {
        point: [],
        newItem: '',
    };

    constructor(props) {
        super(props);

        this.renderMap = this.renderMap.bind(this);
        this.killPoint = this.killPoint.bind(this);
        this.addPointItem = this.addPointItem.bind(this);
        this.itemChange = this.itemChange.bind(this);
        this.moveCard = this.moveCard.bind(this);

        this.initMap();
    }

    initMap() {
        ymaps.load()
            .then((maps) => {
                this.map = new maps.Map('map', {
                    center: [47.11688, 43.88259],
                    zoom: 13,
                    type: 'yandex#map',
                    behaviors: ['scrollZoom', 'drag'],
                    controls: ['zoomControl'],
                });
            })
            .catch((error) => {
                console.log('Failed to load Yandex Maps', error);
            });
    }

    addPointItem(e) {
        e.preventDefault();
        if (!this.state.newItem.length) return;

        this.setState({
            point: this.state.point.concat({
                id: this.state.point.length + 1,
                name: this.state.newItem,
                coord: this.map.getCenter()
            }),
        });
        this.renderMap();
        this.setState({newItem: ''});
    }

    itemChange(e) {
        this.setState({newItem: e.target.value});
    }

    findIndex(id) {
        const {point} = this.state;
        const pointLength = point.length;
        let index = null;
        for (let i = 0; i < pointLength; i++) {
            if (point[i].id == id) {
                index = i;
                break;
            }
        }

        return index;
    }

    killPoint(id) {
        const index = this.findIndex(id);
        if (index !== null) {
            const {point} = this.state;
            point.splice(index, 1);
            this.setState({point});
            this.renderMap();
        }
    }

    changePointCoordinates(id, coord) {
        const index = this.findIndex(id);
        if (index !== null) {
            const {point} = this.state;
            point[index].coord = coord;
            this.setState({point});
            this.renderMap();
        }
    }

    renderMap() {
        this.map.geoObjects.removeAll();
        ymaps.load()
            .then((maps) => {
                let newIndex = 1;
                const coords = [];
                const that = this;
                const newPoint = this.state.point;

                newPoint.forEach((point) => {
                    coords.push(point.coord);
                    point.id = newIndex++;
                    const placemarkParams = {
                        balloonContent: `<h2><strong>${point.name}</string></h2>`,
                        hintContent: point.id + ': ' + point.name,
                        iconContent: point.id,
                    };
                    const placemarkOptions = {
                        preset: 'islands#circleIcon',
                        iconColor: '#3caa3c',
                        draggable: true,
                    };
                    let placemark = new maps.Placemark(point.coord, placemarkParams, placemarkOptions);
                    that.map.geoObjects.add(placemark);
                    placemark.events.add('dragend', (e) => {
                        that.changePointCoordinates(point.id, placemark.geometry.getCoordinates());
                    });
                });

                this.setState({point: newPoint});
                const polylineParams = {
                    hintContent: 'Ломаная',
                };
                const polylineOptions = {
                    strokeColor: '#123',
                    strokeWidth: 4,
                };
                let polyline = new maps.Polyline(coords, polylineParams, polylineOptions);
                this.map.geoObjects.add(polyline);
            })
            .catch((error) => {
                console.log('Failed to load Yandex Maps', error);
            });
    }

    moveCard(dragIndex, hoverIndex) {
        const {point} = this.state;
        const dragCard = point[dragIndex];
        this.setState(
            update(this.state, {
                point: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
                },
            }),
        );
        this.renderMap();
    }

    render() {
        return (
            <div className="main">
                <div className="block">
                    <form onSubmit={this.addPointItem}>
                        <input className="block__creator" onChange={this.itemChange} value={this.state.newItem} />
                    </form>
                    <ul className="list">{this.state.point.map((point, i) =>
                        <Card
                            id={point.id}
                            key={point.id}
                            index={i}
                            name={point.name}
                            moveCard={this.moveCard} killPoint={this.killPoint}
                        />
                    )}</ul>
                </div>
                <div className="map" id="map"></div>
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(App);
