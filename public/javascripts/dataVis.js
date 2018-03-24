$(document).ready(function(){
  // get data from api
  word = $("#word").html();
  $.ajax({
    dataType: "json",
    url: "/api",
    data: {word: word},
    success: function(response){
      console.log(response)
      data = response.result.origins.reverse()
      data.forEach(function(elem, i){
        elem.id = "ohai" + (1000 + i)
      })
      initTree(data, response.result.cousins, response.result.relatedEntries)
    }
  })
function initTree(inputData, cousins, relatedEntries){
  relatedEntries.forEach(function(elem, i){
    $("#relEntries").append(elem + ", ")
  })
  // update(treeData)
  var sfid = 1000;
  var w = $(window).width(),
      h = 700,
      i = 0,
      root = inputData.shift(),
      data = [root],
      tree = d3.layout.tree().size([h-20, w-250]),
      diagonal = d3.svg.diagonal().projection(function(d) {return [d.y, d.x]})
      duration = 400,
      $("#expand").on("click", function(){
        datum = cousins.pop()
        console.log(datum)
        update(datum)
      })
      timer = setInterval(function(){
        datum = inputData.shift()
        console.log(datum)
        if (datum === undefined){
          clearInterval(timer)
          return
        }
        update(datum)
      }, duration-100)

  var vis = d3.select("#viz").append("svg")
      .attr("width", w*.97)
      .attr("height", h)
    .append("g")
      .attr("transform", "translate(10, 10)");

  root.x0 = h /2
  root.y0 = 0

  update(root)

  function update(d) {
    if (data.length >= 100) {
      data.splice(50, 1);
    }
    // find the parent in the array of stored data
    data.forEach(function(elem, i ){
      if (elem.word == d.parent){
        parent = data[i]
        return
      }
    })
    if (parent.children) {
      console.log("parent")
      console.log(parent)

      parent.children.push(d);
    }
    else parent.children = [d];
    data.push(d);
    // Compute the new tree layout. We'll stash the old layout in the data.
    var nodes = tree(root);
    // Update the nodes…
    var node = vis.selectAll("g.node")
        .data(nodes, nodeId);
    // Enter any new nodes at the parent's previous position.
    var newGroup = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d){
        if(d.parent){
          return "translate(" + d.parent.y + "," + d.parent.x + ")"
        }
        else{return "translate(" + 0 + "," + 440 + ")"}
      })
      .attr("id", d.language)
    newGroup.append("text")
    .attr("x", 0)
    .attr("dy", -7)
    .attr("text-anchor", "start")
    .style("font-weight", "bold")
    .text(d.language)
    newGroup.append("text")
    .attr("x", 0)
    .attr("dy", 15)
    .attr("text-anchor", "start")
    .text(d.word)
    newGroup.append("text")
    .attr("x", 0)
    .attr("dy", 30)
    .attr("text-anchor", "start")
    .style("font-style", "italic")
    .text(d.definition)
    // d3.select("#" +d.language)("svg:text")
    // .attr("dx", function(d) { return d.parent.data.x0; })
    // .attr("dy", function(d) { return d.parent.data.y0; })
    // .text(d.language)
    node.exit().remove()
    .transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
    // Transition nodes to their new position.
    node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
    // Update the links…
    var link = vis.selectAll("path.link")
        .data(tree.links(nodes), linkId);
    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        // TO HAVE A SMOOTHE TRANSITION FOR THE LINKS WE
        // NEED TO FIGURE OUT WHAT"S GOING HERE
        .attr("d", function(d) {
          var o = {y: d.source.y, x: d.source.x}
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
//   function x(d) {
//     return d.data.x0 = d.y;
//   }
//   function y(d) {
//     return d.data.y0 = d.x;
//   }
}


})
