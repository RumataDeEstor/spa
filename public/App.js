import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';
import InternalTopmenu from './InternalTopmenu';
import PromotionsShortList from './PromotionsShortList';
import ee from './EventEmitter';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showPromoShort: true};
    this.handleShowingPromos = this.handleShowingPromos.bind(this);
  }

  handleShowingPromos(bool){
    this.setState({showPromoShort: bool});
  }

  componentDidMount() {
    ee.addListener('showingPromos', this.handleShowingPromos);
  }
  componentWillUnmount() {
    ee.removeListener('showingPromos', this.handleShowingPromos);
  }
  // //todo: DidMount - fetch to check Auth; if not user page, forbidden, redirect.
  render () {
    let component = this.state.showPromoShort ? <PromotionsShortList login = {this.props.params.login}/> : null;
    return <div id = "app">
            <InternalTopmenu login = {this.props.params.login}/>
            <div id = "appContent">
              {this.props.children}
              {component}
            </div>
          </div>
  }
}

export default App;
