import React, { Component } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { Home, TaskAPIDocs } from "./Home"

ReactDOM.render(
  (<Router>
    <div className="router-root">
      <Route exact path="/" render={Home} />
      <Route exact path="/task" render={TaskAPIDocs} />
    </div>
  </Router>),
  document.getElementById('root')
)
