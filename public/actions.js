// Visibility

export const SET_TOP_REWARDS_VISIBILITY = 'SET_TOP_REWARDS_VISIBILITY'
export function setTopRewardsVisibility(flag) {
  return { type: SET_TOP_REWARDS_VISIBILITY, flag }
}

// AJAX

export const REQUEST_DATA = 'REQUEST_DATA'
export function requestData() {
  return { type: REQUEST_DATA }
}

export const RECEIVE_DATA = 'RECEIVE_DATA'
export function receiveData(json) {
  const { projects, rewards, rules, points } = json;
	return { 
    type: RECEIVE_DATA, 
    projects, 
    rewards, 
    rules,
    points,
    receivedAt: Date.now()
  }
}

export function fetchUserdata(login) {
  return function (dispatch) {
    dispatch(requestData())

    return fetch(`api/test/${login}/userdata`)
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(json => {
        dispatch(receiveData(json.userdata))
      })
   }
}

// Projects
export const ADD_PROJECT = 'ADD_PROJECT'
export function addProject (_id,  name, label, tasks) { // editing bool?
  return { type: ADD_PROJECT, _id, name, label }
}

export const DELETE_PROJECT = 'DELETE_PROJECT'
export function deleteProject(_id) {
  return { type: DELETE_PROJECT, _id }
}

export const IS_PROJECT_EDITING = 'IS_PROJECT_EDITING'
export function setProjectEditing(_id, flag) {
  return { type: PROJECT_IS_EDITING, _id, flag }
}

export const UPDATE_PROJECT = 'UPDATE_PROJECT'
export function updateProject(_id, name, label, tasks) {
  return { type: UPDATE_PROJECT, _id, name, label }
}

// Tasks

export const ADD_TASK = 'ADD_TASK'				
export function addTask (_projectId, _id, name, points, repeated) { // editing bool?
  return { type: ADD_TASK, _projectId, _id, name, points, repeated }
}

export const DELETE_TASK = 'DELETE_TASK'
export function deleteTask(_projectId, _id) {
  return { type: DELETE_TASK, _projectId, _id }
}

export const IS_TASK_EDITING = 'IS_TASK_EDITING'
export function setTaskEditing(_projectId, _id, flag) {
  return { type: TASK_IS_EDITING, _projectId, _id, flag }
}

export const UPDATE_TASK = 'UPDATE_TASK'
export function updateTask(_projectId, _id, name, points, repeated) {
  return { type: UPDATE_TASK, _projectId, _id, name, points, repeated }
}

export const COMPLETE_TASK = 'COMPLETE_TASK'		//maybe in other reducer, with points
export function completeTask(_projectId, _id, points) {
  return { type: COMPLETE_TASK, _projectId, _id, points }
}

// Rewards

export const ADD_REWARD = 'ADD_REWARD'
export function addReward (_id, name, price, repeated, percentsValue, locked) {
  return { type: ADD_REWARD, _id, name, price, repeated, percentsValue, locked }
}

export const COUNT_REWARD_PERCENTAGE = 'COUNT_REWARD_PERCENTAGE'    //maybe in other reducer, with points
export function countRewardPercentage(_id, price, userPoints ) {   // price is redundant
  return { type: COUNT_REWARD_PERCENTAGE, _id, price, userPoints }
}

export const DELETE_REWARD = 'DELETE_REWARD'
export function deleteReward(_id) {
  return { type: DELETE_REWARD, _id }
}

export const IS_REWARD_EDITING = 'IS_REWARD_EDITING'
export function setRewardEditing(_id, flag) {
  return { type: REWARD_IS_EDITING, _id, flag }
}

export const UPDATE_REWARD = 'UPDATE_REWARD'
export function updateReward(_id, name, price, repeated, percentsValue, locked) {
  return { type: UPDATE_REWARD, _id, name, price, repeated, percentsValue, locked }
}

export const GET_REWARD = 'GET_REWARD'		//maybe in other reducer, with points
export function getReward(_id, points) {
  return { type: GET_REWARD, _id, points }
}

//Rules

export const ADD_RULE = 'ADD_RULE'
export function addRule (_id, name, label, fine) {
  return { type: ADD_RULE, _id, name, label, fine }
}

export const DELETE_RULE = 'DELETE_RULE'
export function deleteRule(_id) {
  return { type: DELETE_RULE, _id }
}

export const IS_RULE_EDITING = 'IS_RULE_EDITING'
export function setRuleEditing(_id, flag) {
  return { type: RULE_IS_EDITING, _id, flag }
}

export const UPDATE_RULE = 'UPDATE_RULE'
export function updateRule(_id, name, label, fine) {
  return { type: UPDATE_RULE, _id, name, label, fine }
}

export const BREAK_RULE = 'BREAK_RULE'		//maybe in other reducer, with points
export function breakRule(_id, points) {
  return { type: BREAK_RULE, _id, points }
}

// Points

export const UPDATE_POINTS = 'UPDATE_POINTS'    //maybe in other reducer, with points
export function updatePoints(pointsDiff) {
  return { type: UPDATE_POINTS, pointsDiff }
}






