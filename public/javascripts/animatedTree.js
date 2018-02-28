<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    <title>Node-Link Tree</title>
    <script type="text/javascript" src="http://mbostock.github.com/d3/d3.js"></script>
    <script type="text/javascript" src="http://mbostock.github.com/d3/d3.layout.js"></script>
    <style type="text/css">

.node {
  stroke: red;
  stroke-width: 20px;
}

.link {
  fill: none;
  stroke: #000;
}

    </style>
  </head>
  <body>
    <script type="text/javascript">

var sfid = 1000; // we will increment this each time we make a new datum and
// assign this to its id
var w = 960, // width of entire vis svg
    h = 900, // height -- having theswe as global variables allows us to set tree relative to svg container
    root = {}, // our data
    data = [root],
    // create a tree (a little smaller than the vis svg)
    tree = d3.layout.tree().size([w - 20, h - 20]),
    diagonal = d3.svg.diagonal()
      .projection(function(d) {return [d.y, d.x]})// can;t find documentation on this...what is it?
    duration = 2500, //duration of animation
    timer = setInterval(update, duration); // we'll likely do away with this

// create our main container
var vis = d3.select("body").append("svg:svg")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(10, 10)");

// the first time there are no circles. selectAll returns an empty
// placeholder
vis.selectAll("circle")
    // counts all of our data
    .data(tree(root))
    //.enter looks at the dom an compares elements and data points
    // if there are more datapoint than dom elements it creates
    // a placeholder element which is passed to appen which actually
    //creates the element
  .enter().append("svg:circle")
    // set the attributes of the appended element
    .attr("class", "node")
    .attr("r", 3.5)
    .attr("cx", x)
    .attr("cy", y);

// update the tree -- I wonder if update updates the whole tree or just
// the needed nodes (like react) I imagine the former and wonder if
// there is a wau to incorporate this into react so the only the nodes of the
// tree that change are re rendered
function update() {
  // if our data got too big
  if (data.length >= 100) {
  data.splice(50, 1); // remove the 50th element ??? why the 50th ???
  }
  var d = {id: "ohai"+(++sfid)} // here we're setting a piece of data to have an id ohai+incremented sfid
  // randomly pick a parent for this data
  // this will be one of the big things we're changing. we need to find the parent
  // of our new node
  var parent = data[~~(Math.random() * data.length)];
  if (parent.children) parent.children.push(d); else parent.children = [d];
  data.push(d);

  // Compute the new tree layout. We'll stash the old layout in the data.
  var nodes = tree(root);

  // Update the nodes…
  var node = vis.selectAll("circle.node") // select all with classes cirlce and node
      .data(nodes, nodeId);

  // Enter any new nodes at the parent's previous position.
  node.enter().append("svg:circle")
      .attr("class", "node")
      .attr("r", 3.5)
      // what is d here
      .attr("cx", function(d) { return d.parent.data.x0; })
      .attr("cy", function(d) { return d.parent.data.y0; })
    .transition()
      .duration(duration)
      .attr("cx", x)
      .attr("cy", y);


  node.exit().remove();

  // Transition nodes to their new position.
  node.transition()
      .duration(duration)
      .attr("cx", x)
      .attr("cy", y);

  // Update the links…
  var link = vis.selectAll("path.link")
      .data(tree.links(nodes), linkId);

  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "circle")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {y: d.source.data.x0, x: d.source.data.y0};
        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);
}

function linkId(d) {
  return d.source.data.id + "-" + d.target.data.id;
}

function nodeId(d) {
  return d.data.id;
}

function x(d) {
  return d.data.x0 = d.y;
}

function y(d) {
  return d.data.y0 = d.x;
}

    </script>
  </body>
</html>
