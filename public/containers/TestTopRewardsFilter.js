import React from 'react';
import { connect } from 'react-redux'
import TestTopRewards from '../components/TestTopRewards'

const mapStateToProps = (state) => {
  return {
    shouldShowTop: state.visibilityFilter.shouldShowTopRewards
  }
}

const TestTopRewardsFilter = connect(mapStateToProps)(TestTopRewards)

export default TestTopRewardsFilter;