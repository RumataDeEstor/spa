import { combineReducers } from 'redux'
import { ADD_TASK, DELETE_TASK, IS_TASK_EDITING, UPDATE_TASK, COMPLETE_TASK,
	ADD_PROJECT, DELETE_PROJECT, IS_PROJECT_EDITING, UPDATE_PROJECT, RECEIVE_DATA,
  REQUEST_DATA, ADD_RULE, DELETE_RULE, IS_RULE_EDITING, 
  UPDATE_RULE, BREAK_RULE, ADD_REWARD, COUNT_REWARD_PERCENTAGE,
  DELETE_REWARD, IS_REWARD_EDITING, 
  UPDATE_REWARD, UPDATE_POINTS } from './actions'

function tasks(state = [], action) {
	switch(action.type) {
		case ADD_TASK:
			return [
        ...state,
        {
          _id: action._id,
          name: action.name,
          points: action.points,
          repeated: action.repeated
        }
      ];
    case DELETE_TASK:
      return state.filter(task => task._id !== action._id);
    case IS_TASK_EDITING:
      return state.map(task => {
        if (task._id === action._id) {
          return {...task, isEditing: action.flag};
        }
        return task; // {...task, isEditing: false} ? or handle in other place
      })
    case UPDATE_TASK:
      return state.map(task => {
        if (task._id === action._id) {
          return {
            ...task,             
            _id: action._id,
            name: action.name,
            points: action.points,
            repeated: action.repeated            
          };
        }
        return task;
      })
    default:
      return state
    // case COMPLETE_TASK: 	maybe in other reducer, with points
	}
}

function projects(state = [], action) {
	switch(action.type) {
    case ADD_TASK:
    case DELETE_TASK:
    case IS_TASK_EDITING:
    case UPDATE_TASK:
      return state.map(project => {
        if (project._id === action._projectId) {
          return {
            ...project,
            tasks: tasks(project.tasks, action)
          }          
        }
        return project;
      })
		case ADD_PROJECT:
			return [
        ...state,
        {
          _id: action._id,
          name: action.name,
          label: action.label,
          tasks: action.tasks || []
        }
      ];
    case DELETE_PROJECT:
      return state.filter(project => project._id !== action._id);
    case IS_PROJECT_EDITING:
      return state.map(project => {
        if (project._id === action._id) {
          return {...project, isEditing: action.flag};
        }
        return project; // {...project, isEditing: false} ? or handle in other place (for other projects)
      })
    case UPDATE_PROJECT:
     return state.map(project => {
        if (project._id === action._id) {
          return {
            ...project,             
            _id: action._id,
            name: action.name,
            label: action.label,
            tasks: action.tasks || []        
          };
        }
        return project;
      })  
    default:
      return state
	}
}

function rules(state = [], action) {
  switch(action.type) {
    case ADD_RULE:
      return [
        ...state,
        {
          _id: action._id,
          name: action.name,
          label: action.label,
          fine: action.fine
        }
      ];
    case DELETE_RULE:
      return state.filter(rule => rule._id !== action._id);
    case IS_RULE_EDITING:
      return state.map(rule => {
        if (rule._id === action._id) {
          return {...rule, isEditing: action.flag};
        }
        return rule; // {...project, isEditing: false} ? or handle in other place
      })
    case UPDATE_RULE:
     return state.map(rule => {
        if (rule._id === action._id) {
          return {
            ...rule,             
            _id: action._id,
            name: action.name,
            label: action.label,
            fine: action.fine      
          };
        }
        return rule;
      })  
    default:
      return state
  }
}

function normalizePercentage(value) {
  return (value > 100) ? 100 : value; 
}

function rewardsCountPercentage(state = 0, action) {
  switch (action.type) {
    case COUNT_REWARD_PERCENTAGE:
      return normalizePercentage(Math.round( action.userPoints /  
        action.price * 100 ));
    default:
      return state;
  }  
}

function rewards(state = [], action) {
  switch(action.type) {
    case ADD_REWARD:
      return [
        ...state,
        {
          _id: action._id,
          name: action.name,
          price: action.price, 
          repeated: action.repeated,
          percentsValue: action.percentsValue, 
          locked: action.locked
        }
      ];
    case COUNT_REWARD_PERCENTAGE:
      return state.map(reward => {
        if (reward._id === action._id) {
          return {...reward, percentsValue: 
            rewardsCountPercentage(reward.percentsValue, action)};
        }
        return reward; // {...project, isEditing: false} ? or handle in other place
      })
    case DELETE_REWARD:
      return state.filter(reward => reward._id !== action._id);
    case IS_REWARD_EDITING:
      return state.map(reward => {
        if (reward._id === action._id) {
          return {...reward, isEditing: action.flag};
        }
        return reward; // {...project, isEditing: false} ? or handle in other place
      })
    case UPDATE_REWARD:
     return state.map(reward => {
        if (reward._id === action._id) {
          return {
            ...reward,             
            _id: action._id,
            name: action.name,
            price: action.price, 
            repeated: action.repeated,
            percentsValue: action.percentsValue, 
            locked: action.locked
          };
        }
        return reward;
      })  
    default:
      return state
  }
}

function points(state = 0, action) {
  switch (action.type) {
    case UPDATE_POINTS: 
      return state+action.pointsDiff;
    default:
      return state;
  }
}

function userdata(state = {
  isFetching: false,
  projects: [],
  rewards: [],
  rules: [],
  points: 0,
}, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return {
        ...state,
        isFetching: false,
        projects: action.projects, 
        rewards: action.rewards, 
        rules: action.rules,
        points: action.points,
        receivedAt: action.receivedAt
      }
    case REQUEST_DATA:
      return {
        ...state,
        isFetching: true
      }
    //
    case ADD_PROJECT:
    case DELETE_PROJECT:
    case IS_PROJECT_EDITING:
    case UPDATE_PROJECT:
    case ADD_TASK:
    case DELETE_TASK:
    case IS_TASK_EDITING:
    case UPDATE_TASK:
    //
    case ADD_RULE:
    case DELETE_RULE:
    case IS_RULE_EDITING:
    case UPDATE_RULE:
    case BREAK_RULE:  
    //
    case ADD_REWARD:
    case DELETE_REWARD:
    case IS_REWARD_EDITING:
    case UPDATE_REWARD:
    case COUNT_REWARD_PERCENTAGE:
    //
    case UPDATE_POINTS:
      return { 
        ...state, 
        projects: projects(state.projects, action),
        rules: rules(state.rules, action),
        rewards: rewards(state.rewards, action),
        points: points(state.points, action)
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  userdata
})

export default rootReducer