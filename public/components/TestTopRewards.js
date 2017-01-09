import React, { PropTypes } from 'react'

const TestTopRewards = ({ shouldShowTop }) => {
  if (shouldShowTop) {
    return <span>TOP REWARS HERE</span>
  }
  return null;
}

TestTopRewards.propTypes = {
  shouldShowTop: PropTypes.bool.isRequired
}

export default TestTopRewards;