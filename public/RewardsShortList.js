import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import RewardItem from './RewardItem';
import ee from './EventEmitter';

export default class RewardsShortList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {topRewards: [], points: null};
    this.loadItems = this.loadItems.bind(this);
    this.getPoints = this.getPoints.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount(){
    ee.addListener('getPoints', this.getPoints);
    ee.addListener('giveData', this.getData);
    ee.emitEvent('reqForPoints');
    this.loadItems();
  }

  componentWillUnmount() {
    ee.removeListener('getPoints', this.getPoints);
    ee.removeListener('giveData', this.getData);
  }

  getPoints(points){
    this.setState({points: points});
  }

  getData (data) {
    let newRewards = data.rewards.slice();
    newRewards = newRewards
      .sort((first, second) => {
        if (first.price > second.price) return -1;
        return 1;
      }).slice(0, 3);
    this.setState({topRewards: newRewards});
  }

  loadItems() {
    ee.emitEvent("reqForUserdata");
  }

  render () {
    return <div className = "rewardsShort">
            <div className = "rewardsShortTitle"> Top Rewards </div>
              {this.state.topRewards.map((el, i) => {
                return <RewardItem
                  key = {i} 
                  id ={el._id} 
                  name = {el.name}  
                  price = {el.price} 
                  repeated = {el.repeated}
                  points = {this.state.points}
                  login = {this.props.login}
                  loc = "short"
                />
              })
            } 
          </div>
  }
}
