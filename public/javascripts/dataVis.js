$(document).ready(function(){
  // get data from api
  word = $("#word").html();
  console.log(word)
  $.ajax({
    dataType: "json",
    url: "/api",
    data: {word: word},
    success: function(response){
      console.log(response.results.origins)
      treeData = response.results.origins
      $("#relEntries").append(response.results.relatedEntries)
      update({language: "PIE", word: "melith", children: [], definition:"a definition"})
    }
  })

  function update(treeData) {

      d3.select("svg")
      .remove();
      // Create a svg canvas this scg:scg is equal to namespace:tagname
      var vis = d3.select("#viz").append("svg:svg")
      // set the width and the height
      .attr("width", "100%")
      .attr("height", "90vh")
      // append an svg container called g(roup)
      .append("svg:g")
      // position the group in the svg container
      .attr("transform", "translate(250,50)");
      // create the cluster layout
      var layout = d3.layout.cluster().size([500,700]);
      var diagonal = d3.svg.diagonal()
      // swap x and y (for the left to right tree instead of top to bottom)
      .projection(function(d) { return [d.y, d.x]; });
      // Preparing the data for the tree layout, convert data into an array of nodes
      var nodes = layout.nodes(treeData);
      nodes.forEach(function(elem){
        console.log(elem)
      })
      // Create an array with all the links
      var links = layout.links(nodes);
      console.log(links)
      var link = vis.selectAll("pathlink")
      .data(links)
      // namespace:tag syntax again
      .enter().append("svg:path")
      .attr("class", "link")
      .attr("d", diagonal)
      var node = vis.selectAll("g.node")
      .data(nodes)
      .enter().append("svg:g")
      // where are d.y and d.x coming from
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      // Add the dot at every node
      node.append("svg:circle")
      .attr("r", 3.5);
      // place the name atribute left or right depending if children
      node.append("svg:text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", -5)
      .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .style("font-weight", "bold")
      .text(function(d) { return d.language;})
      node.append("svg:text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", 10)
      .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { return d.word;})
      node.append("svg:text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", 25)
      .attr("width", 50)
      .attr("class", "definition")
      .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { return d.definition;})
  }

})
