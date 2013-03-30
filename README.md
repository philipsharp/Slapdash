# Slapdash

## Introduction

Slapdash is a tool for constructing graphical dashboards. The main design theories are:

* Lightweight: Slapdash does not require a server-side programming language or database. It can be run directly from disk without a web server if your browser supports file:/// over AJAX (Firefox: yes, Chrome: no). 
* Componentized: Graph definitions are separate from dashboard definitions and can be used multiple times.
* Non-interactive: Slapdash is intended to be used for pre-defined dashboards. It does not support changing graphs on the fly.

Dashboard is designed with [Graphite](http://graphite.wikidot.com/) in mind, but can be used with any system that returns dynamically-sized images.

## Features

* Unlimited graph definitions, with inheritence
* Unlimited dashboard definitions
* Dashboards dynamically expand to fill the screen when loaded
* Dynamically-sized graphs using URL parameters or templating
* Multiple graph sizes per dashboard
* Configurable dashboard refresh interval

## Configuration

To get started, you must create the files `graphs.json` and `dashboards.json` in the `config/` directory. Sample files are provided.

### graphs.json

The `graphs.json` file contains a single JSON object. The object keys are used as the graph IDs. Each object key defines a graph object. All properties are optional. The structure of the graph object is:

```json
"extends": "_mygraph",                          <-- Inherit properties from the given graph ID; the parent graph must be defined earlier in the file
baseUrl: "http://graphite.example.com/render",  <-- Useful for defining the hostname for inherited graphs
url: "",                                        <-- This is appended to the base URL to get the graph URL
parameters: {},                                 <-- An object of query string parameters; often more readible than including them in the URL
templateUrl: false                              <-- See "Dynamic Sizing", below
```

### dashboards.json

The `dashbaords.json` files contains a single JSON object. The object keys are used as the dashboard IDs. Each object key defines a dashbaord object. The structure of the dashboard object is:

```json
"name": "WWW Servers",                        <-- Use this as the dashboard name ( optional: defaults to using the dashboard ID )
"rows":[                                      <-- Array of row objects
    {
        "layout":"halfs",                             <-- Pre-defined layout for this row
        "graphs":["webreqs","weberrors"]              <-- Array of graphs for this row
    },
    {
        "layout":[[4,2],[4,2],[4,2]],                 <-- User-defined layout for this row
        "graphs":["web1load","web2load","web3load"]   <-- Array of graphs for this row
    }
]
```

### Dynamic Sizing

Slapdash will expand the width of the dashboard to fill the screen when loaded. (It will not automatically re-size the dashboard if the window is resized.) A minimum width of 940 pixels is enforced. The dashboard is split into twelve columns, plus spacing. Each column is one "block" wide; this is the unit used when defining layouts. (For a 940-pixel-wide dashboard, one block is 60 pixels.)

Graphs are resized by one of two methods:

* URL parameters (default): The query parameters "height" and "width" are added to the URL with the current values. (This supports Graphite.)
* URL templating: If `templateUrl` is set to `true` for the graph, the strings '%height%' and '%width%' in the URL will be replaced with the current values.

### Layouts

Rows can use pre-defined or user-defined layouts. To use a pre-defined layout, set the "layout" value of the row object as the name of the layout. To use a user-defined layout, set the "layout" value as a multi-dimensional array. Each element of the array should be a two-dimensional array [height,width]. The units of height and width are "blocks" as mentioned in "Dynamic Sizing" above.

The following pre-defined layouts are available:

* "full": [[12,6]]
* "halfs": [[6,3],[6,3]]
* "thirds": [[4,2],[4,2],[4,2]]
* "quarters": [[3,2],[3,2],[3,2],[3,2]]
* "one-by-two":  [[8,4],[4,2],[4,2]]
* "one-by-three": [[8,6],[4,2],[4,2],[4,2]]
* "one-by-four": [[8,4],[4,1],[4,1],[4,1],[4,1]]

Layouts are drawn from top-to-bottom, left-to-right, as the twleve columns are filled. The "one-by-three" layout, for example, will draw the 8x6 graph first, and the three 4x2 graphs will be drawn along it's right side.

## License

Slapdash is licensed under the MIT License.

Slapdash includes part of the Bootstrap project, which is licensed under the  Apache License v2.0.