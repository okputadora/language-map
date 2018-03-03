$(document).ready(function(){
  // get data from api
  word = $("#word").html();
  $.ajax({
    dataType: "json",
    url: "/api",
    data: {word: word},
    success: function(response){
      inputData = response.results.origins.reverse().map(function(elem, i){
        elem.id = "ohai"+ (1000 + i)
        return elem
      })

      initTree(inputData, response.results.cousins, response.results.relatedEntries)
    }
  })
function initTree(inputData, cousins, relatedEntries){
  $("#relEntries").append(relatedEntries)
  // update(treeData)
  var w = 960,
      h = 900,
      root = inputData.shift(),
      data = [root],
      tree = d3.layout.tree().size([w - 20, h - 20]),
      diagonal = d3.svg.diagonal().projection(function(d) {return [d.y, d.x]})
      duration = 2050
  var vis = d3.select("#viz").append("svg:svg")
      .attr("width", w)
      .attr("height", h)
    .append("svg:g")
      .attr("transform", "translate(10, 10)");
  vis.selectAll("circle")
      .data(tree(root))
    .enter().append("svg:circle")
      .attr("class", "node")
      .attr("r", 3.5)
      .attr("cx", x)
      .attr("cy", y);

      var timer = setInterval(function(){
        update(inputData)
        inputData.shift()
        if (inputData.length == 0){
          clearTimeout(timer)
        }
      }, 40)
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
          parent.children.push(d);
        }
        else parent.children = [d];
        data.push(d);
        console.log(data)
        // Compute the new tree layout. We'll stash the old layout in the data.
        var nodes = tree(root);
        // Update the nodes…
        var node = vis.selectAll("circle.node")
            .data(nodes, nodeId);
        // Enter any new nodes at the parent's previous position.
        node.enter().append("svg:circle")
            .attr("class", "node")
            .attr("r", 3.5)
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
              var o = {x: d.source.data.y0, y: d.source.data.x0};
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
}


})
