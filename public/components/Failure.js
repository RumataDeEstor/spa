import React from 'react'

const Failure = () => (
  <div className  = "failure">
    <h1> Sorry! :( </h1>
    {"You can not view this page.\n"+
    "Perhaps this is a private page of another user or you are not logged in.\n"+
    "Try to log in."}
  </div>
) 

export default Failure;