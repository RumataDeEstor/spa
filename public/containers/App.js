import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { addTask, addRule, addProject, addReward, deleteProject, 
  updateTask, receiveData, updatePoints, countRewardPercentage, fetchUserdata } from '../actions'
// Testing
class App extends Component {
  constructor(props) {
    super(props)
    this.pish = this.pish.bind(this);
  }

  pish() {
    const { dispatch, projects, rules, rewards, points } =  this.props;
    // dispatch(countRewardPercentage(2, 100, points));
    dispatch(fetchUserdata("Rumata"));
  }

  componentDidMount() {
    const { dispatch, projects, rules, rewards, points } =  this.props;
    // dispatch(receiveData([{_id: 1, name: "Programming", label: "red", tasks: []}]));
    // dispatch(addProject(1, "Programming", "red"));
    // dispatch(updatePoints(10));
    // dispatch(addReward(1, "Concert", 20, false, 15, true));
    // dispatch(addReward(2, "Burger", 100, false, 90, true));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.points !== this.props.points) {
      const { dispatch, projects, rules, rewards, points } = nextProps
    }
  }

  render(){
  	return <div>
  					It works!
            <button onClick = {this.pish}>fetch data</button>
  				</div>
  }
}

function mapStateToProps(state) {
  const { projects, rules, rewards, points } = state.userdata;

  return {
    projects,
    rules,
    rewards,
    points
  }
}
export default connect(mapStateToProps)(App)