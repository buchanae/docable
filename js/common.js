import React, { Component } from "react"
import { Link } from 'react-router-dom'
import { NavHashLink as NavLink } from 'react-router-hash-link';


function oldheader() {
  return (
        <div className="global-header">
          <div className="global-header-home">
            <Link to="/"><h1>Exahub</h1></Link>
          </div>
        </div>
    )
}

class Page extends Component {

  constructor(props) {
    super(props)
    this.state = { visible: false }
  }

  toggleVisibility() {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    const { visible } = this.state
    return (
      <div className="page">


        <div className="main">
          <div className="main-nav">
            <div className="main-header">Exahub</div>
            <ul>
              { this.props.menu.map(item => (
                <li key={item.path}><NavLink to={item.path} exact>{item.text}</NavLink></li>
              )) }
            </ul>
          </div>

          <div className="main-content">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}


const Breadcrumb = ({ items }) => {
  // Build breadcrumb
  var bc = []

  if (items) {
    for (var i = 0; i < items.length; i++) {
      bc.push(<span key={i}>{items[i]}</span>)
      if (i != items.length - 1) {
        bc.push(<span key={i + "sep"} className="sep">&gt;</span>)
      }
    }
  }
  return (<div className="breadcrumb">{bc}</div>)
}
export { Link, Page }
