
console.log("hello")
var treeData =
  {
  "language": "pie",
  "word": "*melith",
  "definition": "anything good of its kind",
  "children":[
    {
    "language": "pie",
    "word": "*k(e)neko-",
    "definition": "gold",
    "children":[
    {
      "language": "proto-germanic",
      "word": "*hunagam",
      "definition": "honey",
      "children":[
        {
          "language": "old norse",
          "word": "hunang",
          "defintion": "honey",
          "children": [{}],
        },
        {
          "language": "old english",
          "word": "hunig",
          "definition": "honey,",
          "children":[
            {
              "language": "middle english",
              "word": "hony",
              "children":[
                {
                  "language": "english",
                  "word": "honey",
                  "definition": "coming soon",
                  "children":[

                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
]
}
update();

function update() {

    d3.select("svg")
    .remove();
    // Create a svg canvas this scg:scg is equal to namespace:tagname
    var vis = d3.select("#viz").append("svg:svg")
    // set the width and the height
    .attr("width", 1500)
    .attr("height", 700)
    // append an svg container called g(roup)
    .append("svg:g")
    // position the group in the svg container
    .attr("transform", "translate(150, -200)");
    // create the cluster layout
    var layout = d3.layout.cluster().size([1000,1000]);
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
    .attr("dy", -10)
    .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
    .style("font-weight", "bold")
    .text(function(d) { return d.language;})
    node.append("svg:text")
    .attr("dx", function(d) { return d.children ? -8 : 8; })
    .attr("dy", 20)
    .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
    .text(function(d) { return d.word;})
    node.append("svg:text")
    .attr("dx", function(d) { return d.children ? -8 : 8; })
    .attr("dy", 40)
    .attr("width", 50)
    .attr("class", "definition")
    .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
    .text(function(d) { return d.definition;})
}
