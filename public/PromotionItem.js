import React from 'react';
import { render } from 'react-dom';
import { 
  Router, Route, IndexRoute, Link, IndexLink, 
  IndexRedirect, browserHistory 
} from 'react-router';

class PromotionItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return<div id = "promotionItem">            
            <div id = "exCircle">
              <div id = "inCircle">
                <div id = "percents"> 25% </div>
                <div id = "square">         
                </div>     
              </div>
            </div>
            <div>{this.props.name}</div>
            <div>{this.props.price}</div>            
          </div>
  }
}

export default PromotionItem;
