import React, { Component } from "react"
import { Link, Page } from "./common"
import { Spec } from './specs/tes'
import {  MarkdownPreview  } from 'react-marked-markdown'

export const Home = () => {
  var menu = [
    {
      path: "/",
      text: "Home",
    },
    {
      path: "/task",
      text: "Task",
    },
  ]
  return (<Page menu={menu}>
     <h2>Home</h2>
  </Page>)
}


export const TaskAPIDocs = () => {
  var menu = [
    {
      path: "/",
      text: "Back",
    },
  ]

  Object.keys(Spec.definitions).forEach(key => {
    menu.push({
      path: "#/definitions/" + key,
      text: key,
    })
  })

  return (<Page menu={menu}>
     <APIDoc spec={Spec} />
  </Page>)
}

// APIDoc displays type and operation docs for a Swagger-based API spec.
const APIDoc = ({ spec }) => {
  const { info, paths, definitions } = spec
  return (<div className="api-spec">

    <div className="api-row">
      <div className="api-doc-col">
        <div className="api-info">
          <h1>{info.title} <span className="api-spec-version">{info.version}</span></h1>
          <div className="api-spec-desc">
            <MarkdownPreview value={info.description} />
          </div>
        </div>
      </div>
      <div className="api-demo-col">
          Intro examples
      </div>
    </div>

    { flattenPaths(paths).map((op) => (
      <div className="api-row" key={op.path + op.method}>
        <div className="api-doc-col">
          <APIOp op={op} />
        </div>
        <div className="api-demo-col">
            Operations examples
        </div>
      </div>
    ))}

    { Object.entries(definitions).map(([key, def]) => (
      <div className="api-row" key={key}>
        <div className="api-doc-col">
          <APIDef name={key} def={def} />
        </div>
        <div className="api-demo-col">
            Type def examples
        </div>
      </div>
    ))}

  </div>)
}

// APIOp displays docs for an API operation, such as "Create User".
const APIOp = ({ op }) => {
  return (<div className="api-op">
    <h2>{ op.summary }</h2>
    <div className="api-op-desc">
      <MarkdownPreview value={op.description} />
    </div>
    <APIParams params={op.parameters} />
    <APIResp resp={op.responses["200"]} />
  </div>)
}

const APIParams = ({ params }) => {
  if (!params || params.length == 0) {
    return <span />
  }

  params = coerceRequestParams(params)
  return (<div>
    <h4>Parameters</h4>

    <table className="api-obj">
      <tbody>{
        params.map(param => {
          return (<tr key={param.name}>
            <td className="api-val-key">
              <a href="#" className="api-obj-key">{param.name}</a>
              <div className="api-val-type">{ switchValType(param) }</div>
              <Required value={param.required} />
            </td>
            <td className="api-val-desc">
              <MarkdownPreview value={param.description} />
              <Default value={param.default} />
            </td>
          </tr>)
        })
      }</tbody>
    </table>
  </div>)
}

const APIResp = ({ resp }) => {
  if (!resp.schema) {
    return <span />
  }

  var resp

  if (resp.schema.type == "object") {
    var props = coerceSchema(resp.schema)
    resp = (<table className="api-obj">
      <tbody>{
        props.map(param => {
          return (<tr key={param.name}>
            <td className="api-val-key">
              <a href="#" className="api-obj-key">{param.name}</a>
              <div className="api-val-type">{ switchValType(param) }</div>
            </td>
            <td className="api-val-desc">
              <MarkdownPreview value={param.description} />
            </td>
          </tr>)
        })
      }</tbody>
    </table>)

  } else if (resp.schema["$ref"]) {
    resp = (<div>Returns a { switchValType(resp.schema) }.</div>)

  } else {
    resp = (<div>{ switchValType(resp.schema) }</div>)
  }

  return (<div>
    <h4>Response</h4>
    {resp}
  </div>)
}

// coerceRequestParams is a bit of a hack to display requests/responses with a schema.
// Probably brittle, but also probably handles most cases.
// If the params can't be obviously coerced, the params are returned unmodified.
const coerceRequestParams = (params) => {
  if (params.length == 1 && params[0].in == "body" && 
      params[0].schema && params[0].schema.type == "object") {
    return coerceSchema(params[0].schema)
  }
  return params
}

const coerceSchema = (schema) => Object.entries(schema.properties).map(([key, val]) => {
  return Object.assign({}, val, {name: key})
})

// Required displays a "required" tag if "value" is true,
// otherwise it displays an empty span.
const Required = ({ value }) => {
  if (value) {
    return <span className="required-tag">required</span>
  }
  return <span />
}

// flattenPaths flattens Swagger API path and operation definitions
// into a more useful, flat list. List items are Swagger Operation items,
// with "path" and "method" fields added (e.g. "/users" and "get").
const flattenPaths = (paths) => {
  var out = []
  for (var path in paths) {
    for (var method in paths[path]) {
      out.push(Object.assign({
        path: path,
        method: method,
        parameters: [],
      }, paths[path][method]))
    }
  }
  return out
}

// APIDef displays an API type definition, e.g. object, enum, etc.
const APIDef = ({ name, def }) => {

  var obj = <div />
  if (def.type == "object") {
    obj = <APIObj obj={def} />
  } 

  return (<div className="api-def" id={"/definitions/" + name}>

    <h2>{def.title}</h2>
    <div className="api-def-desc"><MarkdownPreview value={def.description} /></div>

    <h4>Fields</h4>
    { obj }

  </div>)
}

// switchValType displays the type of an value, e.g. string, boolean, array of X, etc.
const switchValType = (val) => {
  var $ref = val["$ref"]
  if ($ref) {
    return <a href={$ref}>{ stripDef($ref) }</a>
  }

  if (val.type == "object" && val.additionalProperties) {
    return <span>{"map<string, "}{switchValType(val.additionalProperties)}{">"}</span>
  }

  switch (val.type) {
  case "number":
    return <span>{val.format}</span>

  case "array":
    return <span>{"list<"}{switchValType(val.items)}{">"}</span>
  case "dateTime":
    return <span>date + time</span>
  }
  return <span>{val.type}</span>
}


// stripDef strips the swagger definition prefix.
const stripDef = (raw) => {
  return raw.replace("#/definitions/", "")
}

const Default = ({ value }) => {
  if (!value) {
    return <span />
  }
  return <p className="default-value">Defaults to { value }.</p>
}

/*
APIObj displays an table of object properties
with key names, values types, descriptions, etc.
*/
const APIObj = ({ obj }) => {
  return (<table className="api-obj">
    <tbody>{
      Object.entries(obj.properties).map(([key, val]) => {
        var desc = val.description || ""
        return (<tr key={key}>
          <td className="api-val-key">
            <a href="#" className="api-obj-key">{key}</a>
            <div className="api-val-type">{ switchValType(val) }</div>
            <Required value={val.required} />
          </td>
          <td className="api-val-desc">
            <MarkdownPreview value={desc} />
            <Default value={val.default} />
          </td>
        </tr>)
      })
    }</tbody>
  </table>)
}
