import React from 'react';
import ymaps from 'ymaps';
import _ from 'lodash';
import PointBlock from './PointBlock.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  
    let myMap = null;
    ymaps.load().then(maps => {
      myMap = new maps.Map('map', {
        center: [ 47.11688, 43.88259 ],
        zoom: 13,
        type: 'yandex#map',
        behaviors: [ 'scrollZoom', 'drag' ],
        controls: [ 'zoomControl' ]
      });
      this.setState({ map: myMap });
    })
    .catch(error => console.log('Failed to load Yandex Maps', error));

    this.state = { point: [], map: myMap };
    this.addNew = this.addNew.bind(this);
    this.renderMap = this.renderMap.bind(this);
    this.killPoint = this.killPoint.bind(this);
  }

  killPoint(id) {
    let point = this.state.point;
    let pointLength = point.length;
    let index = null;
    for (let i = 0; i < pointLength; i++) {
      if (point[i].id == id) {
        index = i;
        break;
      }
    }
    if (index != null) {
      point.splice(index, 1);
      this.setState({ point: point });
      this.renderMap();
    }
  }

  addNew(value) {
    this.setState({ point: this.state.point.concat({
      id: this.state.point.length + 1,
      name: value,
      coord: this.state.map.getCenter()
    }) });
    this.renderMap();
  }

  renderMap() {
    this.state.map.geoObjects.splice(0, this.state.map.geoObjects.getLength());
    ymaps.load().then(maps => {
      let coords = [];
      let newIndex = 1;
      _.forEach(this.state.point, (point) => {
        coords.push(point.coord);
        point.id = newIndex;
        let placemark = new maps.Placemark(point.coord, {
          balloonContent: '<img src="http://img-fotki.yandex.ru/get/6114/82599242.2d6/0_88b97_ec425cf5_M" />',
          iconContent: point.id + ': ' + point.name
        }, {
          preset: "islands#yellowStretchyIcon",
          balloonCloseButton: false,
          hideIconOnBalloonOpen: false
        });
        this.state.map.geoObjects.add(placemark);
        newIndex++;
      });
      let polyline = new maps.Polyline(coords, {
        hintContent: "Ломаная"
      }, {
        strokeColor: '#123',
        strokeWidth: 4
      });
      this.state.map.geoObjects.add(polyline);
    })
    .catch(error => console.log('Failed to load Yandex Maps', error));
  }

  render() {
    return (
      <div className="main">
        <PointBlock addNew={this.addNew} point={this.state.point} killPoint={this.killPoint} />
        <div className="map" id="map"></div>
      </div>
    );
  }
}
