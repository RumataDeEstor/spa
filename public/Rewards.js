import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import RewardItem from './RewardItem';
import RewardsAddNew from './RewardsAddNew';
import Points from './Points';
import ee from './EventEmitter';

export default class Rewards extends React.Component {
  constructor(props) {
    super(props);
    this.loadItems = this.loadItems.bind(this);
    this.state = {rewards: [], points: null};
    this.getPoints = this.getPoints.bind(this);
    this.handleChildDelete = this.handleChildDelete.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount(){
    ee.addListener('getPoints', this.getPoints);
    ee.addListener('rewardDeleted', this.handleChildDelete);
    ee.addListener('giveData', this.getData);
    ee.emitEvent('reqForPoints');
    this.loadItems();
  }

  componentWillUnmount() {
    ee.removeListener('getPoints', this.getPoints);
    ee.removeListener('rewardDeleted', this.handleChildDelete);
    ee.removeListener('giveData', this.getData);
  }

  getPoints(points){
    this.setState({points: points});
  }

  getData (data) {
    let newRewards = data.rewards.slice();
    newRewards = newRewards.reverse();
    this.setState({rewards: newRewards});
  }

  handleChildDelete(id) {
    let newRewards = this.state.rewards.slice();
    newRewards = newRewards.filter(el => el._id !== id);
    this.setState({rewards: newRewards});
  }

  handleNewRewardAdding(reward) {
    this.setState({rewards: [reward, ...this.state.rewards] });
  }

  loadItems(){
    ee.emitEvent("reqForUserdata");
  }

  render () {
    return <div className = "rewards">
            <div className = "listTitle">Rewards</div>
            <div className = "annotation"> 
              {`Each reward has a name, "price" of getting it and repeat-mark. This button is responsible 
                for whether your reward will be deleted right after getting it or not. To "win" rewards, 
                you should complete your tasks and not to break rules. Good luck!`}
            </div>
            <RewardsAddNew login = {this.props.params.login}
              onNewRewardAdded = {this.handleNewRewardAdding.bind(this)}
            />
            <div className = "rewardList">
              {
                this.state.rewards.map((el,i,arr) => {
                  return <RewardItem
                    key = {arr.length - i - 1} 
                    id ={el._id} 
                    name = {el.name} 
                    price = {el.price} 
                    repeated = {el.repeated}
                    points = {this.state.points}
                    login = {this.props.params.login}
                    loc = "full"
                  />
                })
              }
            </div>
          </div>
  }
}