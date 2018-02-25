// assign the svg element and its width and height to variables.
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height"),
  // add a svg group 'g' to the svg and save it in a variable
  g = svg.append("g").attr("transform", "translate(40,0)");

// make a d3 cluster called tree and set its height and width
// based on the svg's height and width
var origins =

var tree = d3.cluster()
    .size([height, width - 160]);

d3.json(origins, function(data){
  console.log(data)
})
