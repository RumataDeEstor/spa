import React from 'react'
import { render } from 'react-dom'
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router'
import TasksItem from './TasksItem'

class TasksList extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {tasks: []};
    // this.loadTasks = this.loadTasks.bind(this);
  }

  // loadTasks() {
  //   let reqParams = {
  //     method: 'GET',
  //     credentials: 'include'
  //   }

  //   let login = this.props.login;
  //   let projectID = this.props.projectID;

  //   fetch(`/api/userdata/${login}/${projectID}`, reqParams)
  //     .then(res => res.json())
  //     .then(res => {
  //       if (res.error) {
  //         console.log(res.error); // handle;
  //         return;
  //       }
  //       res.tasks.map(task => {
  //         this.setState( {tasks: [task, ...this.state.tasks] });
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     })
  // }

  // componentDidMount() {
  //   this.loadTasks();
  // }

  // componentWillReceiveProps(){
  //   this.loadTasks();
  // }

  handleChildDelete(id) {
    // let newTasks = this.state.tasks.slice();
    // newTasks = newTasks.filter(el => el._id !== id);
    // this.setState({tasks: newTasks});
  }

  handleChildEdit(task) {
    // return <div> {task.id} </div>
  }

  render () {
    // let tasks = this.state.tasks;
    return <div>
            List Page
            <div id = "tasksList">
              {this.props.tasks.map((el,i) => {
                return <TasksItem key = {i} 
                id ={el._id} 
                onDelete={this.handleChildDelete.bind(this)} 
                onEdit={this.handleChildEdit.bind(this)}
                points = {el.points} 
                name = {el.name} 
                label = {el.label}
                login = {this.props.login}/>
              })}       
            </div>
          </div>
  }
}

export default TasksList;
