google.charts.load('current', {packages:["orgchart"]});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  word = $("#word").html();
  firstRow = [{v: word, f:word + '<div style="color:red; font-style:italic">english</div>'}, "", ""]
  console.log(word)
  origins = [];
  $(".source").each(function(i, element){
    origins.push(element.innerHTML)
  })
  words = []
  $(".source-word").each(function(i, element){
      words.push(element.innerHTML)
  })
  console.log(words)
  dataRows = []
  dataRows.push(firstRow)
  for (var i = 0; i < origins.length; i++){
    if (i === 0){
      newRow = [{v: words[i], f:words[i] + '<div style="color:red; font-style:italic">'+ origins[i] +'</div>'}, word, ""]
    }
    else{
      newRow = [{v: words[i], f:words[i] + '<div style="color:red; font-style:italic">'+ origins[i] +'</div>'}, words[i-1], ""]
    }
    dataRows.push(newRow)
  }
  console.log(origins)
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Name');
  data.addColumn('string', 'Manager');
  data.addColumn('string', 'ToolTip');

  // For each orgchart box, provide the name, manager, and tooltip to show.
  data.addRows(dataRows);

 // Create the chart.
 var chart = new google.visualization.OrgChart(document.getElementById('wordmap'));
 // Draw the chart, setting the allowHtml option to true for the tooltips.
 chart.draw(data, {allowHtml:true});
}
