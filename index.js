//# dc.js Getting Started and How-To Guide
'use strict';

//charts - divs

//var gainOrLossChart = dc.pieChart("#gain-loss-chart");
//var fluctuationChart = dc.barChart("#fluctuation-chart");
// var complaintChart = dc.rowChart("#complaint-chart");
//
// var boroughChart = dc.rowChart("#borough-chart");
// var dayOfWeekChart = dc.rowChart("#day-of-week-chart");
// var agencyChart = dc.rowChart("#agency-chart");
// //var hourChart = dc.barChart("#hour-chart");
// var tempChart = dc.barChart("#temperature-chart")
// var nycMap = dc.geoChoroplethChart("#nyc-chart");
// var zipcodeChart = dc.rowChart("#zipcode-chart");
//var moveChart = dc.lineChart("#monthly-move-chart");
//var volumeChart = dc.barChart("#monthly-volume-chart");
//var yearlyBubbleChart = dc.bubbleChart("#yearly-bubble-chart");
//var rwChart = dc.geoChoroplethChart("#choropleth-map-chart");

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


queue()
.defer(d3.csv, "SVI2018_US.csv")
//.defer(d3.csv, "nyc_smallSample.csv")
.defer(d3.json, "cartogram.geojson")
.await(ready);

//filters for text
// var nypd = "NYPD"
// var weekend = ["0.Sun","6.Sat"]
// var noise = "Loud Music/Party"
// var tlc = "TLC"

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function histoMaker(column,ndx,domain,div,color){
	var histochart = dc.barChart(div);
	
	var titleDiv = d3.select(div).append('div').html(themeDisplayTextShort[column]).style('padding',"10px")
		.attr('id',column+"_title")
	.style('height',"36px")
	 titleDiv.append('div').attr("id",column+"_filter").attr("class","filter")
	.style('height',"12px")

	titleDiv.append("div")
	//.attr("href",'javascript:myChart.filterAll();dc.redrawAll();')
	.attr("class","reset")
	.attr("id",column+"_reset")
	.style('height',"12px")
	//.style("visibility","hidden")
	.html(" ")
	.on("click",function(){
		d3.select("#"+column+"_filter").html("")
		histochart.filterAll()
		dc.redrawAll()
	})
	 
	
	var dim = ndx.dimension(function(d){
		if(column=="EP_PCI"){
			return Math.round(d[column]/500)*500
		}else{
			return Math.round(d[column])
		}
	})
	var gro = dim.group()
	//console.log(gro.reduceCount())
	//console.log(dim)
	var width = (window.innerWidth-100)/4
	if(column=="EP_PCI"){
		width =600
	}
	histochart.width(width)
	        .height(100)
	        .margins({top: 0, right: 50, bottom: 20, left: 40})
	        .ordinalColors([color])
	        .dimension(dim)
	        .group(gro)
	       // .centerBar(true)
	        .elasticY(true)
	        .gap(1)
			.x(d3.scale.linear().domain(domain).range([0,1200]))
	.yAxis().ticks(4);
	
	if(column=="EP_PCI"){

		histochart.xAxis().ticks(5)//.tickValues([0, 100000]);
		histochart.xAxis().tickFormat(function(v) {return "$"+numberWithCommas(v) ;});
	}else{

		histochart.xAxis().ticks(5)//Values([0,25, 50,75,100]);
		histochart.xAxis().tickFormat(function(v) {return v + '%';});
	}
	histochart.turnOnControls(true)
	//histochart.controlsUseVisibility(true)
	
	histochart.filterPrinter(filters => {
            const filter = filters[0];
            let s = '';
			if(column=="EP_PCI"){
	            s += " $"+Math.round(filter[0])+" - $"+ Math.round(filter[1]);
			}else{
	            s +=" "+ Math.round(filter[0])+"% - "+ Math.round(filter[1])+"%";
				
			}
			d3.select("#"+column+"_filter").html(s)
			d3.select("#"+column+"_reset").html(" reset")
            return s;
        });

}

var colors = ["#68aa59",
"#596838",
"#7dd143",
"#bbb960"]
var groups = ["Socioeconomic_Status","Household_Composition","Race_Ethnicity_Language","Housing_Transportation"]

var colorDictionary = {
}
for(var g in groups){
	console.log(colors[g])
	colorDictionary[groups[g]]=colors[g]
}
var measureGroup = {
    "EP_POV":"Socioeconomic_Status",
    "EP_PCI":"Socioeconomic_Status",
    "EP_UNEMP":"Socioeconomic_Status",
    "EP_NOHSDP":"Socioeconomic_Status",

    "EP_AGE17":"Household_Composition",
    "EP_AGE65":"Household_Composition",
    "EP_DISABL":"Household_Composition",
    "EP_SNGPNT":"Household_Composition",


    "EP_LIMENG":"Race_Ethnicity_Language",
    "EP_MINRTY":"Race_Ethnicity_Language",

    "EP_CROWD":"Housing_Transportation",
    "EP_GROUPQ":"Housing_Transportation",
    "EP_MOBILE":"Housing_Transportation",
    "EP_MUNIT":"Housing_Transportation",
    "EP_NOVEH":"Housing_Transportation"

}
var groups = {
	Socioeconomic_Status:["EP_POV","EP_PCI","EP_UNEMP","EP_NOHSDP"],
	Household_Composition:["EP_AGE17","EP_AGE65","EP_DISABL","EP_SNGPNT"],
	Race_Ethnicity_Language:["EP_MINRTY","EP_LIMENG"],
	Housing_Transportation:["EP_NOVEH","EP_MUNIT","EP_MOBILE","EP_GROUPQ","EP_CROWD"]
}

var themeDisplayTextShort = {
    "EP_POV":"% residents below poverty",
    "EP_PCI":"$ Per capita income",
    "EP_UNEMP":"% unemployment",
    "EP_NOHSDP":"% residents with no high school diploma",

    "EP_AGE17":"% residents under 18",
    "EP_AGE65":"% residents over 64",
    "EP_DISABL":"% residents with disability",
    "EP_SNGPNT":"% single parent households",


    "EP_LIMENG":"% residents speaking limited english",
    "EP_MINRTY":"% minorities",

    "EP_CROWD":"% households more people than rooms",
    "EP_GROUPQ":"% group quarters",
    "EP_MOBILE":"% mobile homes",
    "EP_MUNIT":"% structures with 10+ units",
    "EP_NOVEH":"% households with no vehicle available"

}
function ready(error, data, geodata){
	// //format dates
//     var dateFormat = d3.time.format("%m%d%Y");
//     var numberFormat = d3.format(".2f");
//
// 	//prepars date and month
//     data.forEach(function (d) {
//         d.dd = dateFormat.parse(d.date);
//         d.month = d3.time.month(d.dd); // pre-calculate month for better performance
//     });

    //### Create Crossfilter Dimensions and Groups
    //See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference) for reference.
    var ndx = crossfilter(data);
    var all = ndx.groupAll();
	
	
	

//var measures = ["EP_POV","EP_PCI","EP_UNEMP","EP_NOHSDP","EP_AGE17","EP_AGE65","EP_DISABL","EP_SNGPNT", "EP_LIMENG","EP_MINRTY","EP_CROWD","EP_GROUPQ","EP_MOBILE", "EP_MUNIT","EP_NOVEH"]
	
	for(var g in groups){
		var measures = groups[g]
		var color = colorDictionary[g]
		
		var groupDiv = d3.select("#charts").append('div')
		.attr('id',g).attr("class","group")
		
		groupDiv.append("div").html(g.split("_").join(" "))
		.style("background-color",color)
		.style("color","white")
		.style("padding","5px")
		
		for(var m in measures){
			groupDiv.append('div').attr('id',measures[m]).attr("class","chartDiv")
			.style("color",color)
			var max = d3.max(function(d){console.log(d); return d[measures[m]]})
		
			if(measures[m]=="EP_PCI"){
				histoMaker(measures[m],ndx,[0,100000],"#"+measures[m],color)
			}else{
				histoMaker(measures[m],ndx,[0,100],"#"+measures[m],color)	
			}		
	}
}


  //   // dimension by month
//     var monthDimension = ndx.dimension(function (d) {
//         return d.month;
//     });
//
     var dateDimension = ndx.dimension(function (d) {
         return d.STATE;
     });
//
// 	var temp = ndx.dimension(function(d){
// 		return d.tempMax
// 	})
// 	var tempGroup = temp.group();
//     // create categorical dimension
//     var agency = ndx.dimension(function (d) {
//         return d.agency;
//     });
//     var agencyGroup = agency.group();
//
//     var complaint = ndx.dimension(function (d) {
//         return d.description;
//     });
//     var complaintGroup = complaint.group();
//
//     var hour = ndx.dimension(function (d) {
//         return d.hour;
//     });
//     var hourGroup = hour.group();
//
//
//     var borough = ndx.dimension(function (d) {
//         return d.borough;
//     });
//     var boroughGroup = borough.group();
//
//
//     // counts per weekday
//     var dayOfWeek = ndx.dimension(function (d) {
//         var day = d.dd.getDay();
//         var name=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
//         return day+"."+name[day];
//     });
//     var dayOfWeekGroup = dayOfWeek.group();
//
//
// 	var zipcode = ndx.dimension(function(d){
// 		return d.zipcode
// 	})
// 	var zipcodeGroup = zipcode.group();
//
// 	var topRowHeight = 120;
// 	var topRowColor = "#EDA929"
//     dayOfWeekChart.width(200)
//         .height(topRowHeight)
//         .margins({top: 0, left: 30, right: 10, bottom: 20})
//         .group(dayOfWeekGroup)
//         .dimension(dayOfWeek)
//         // assign colors to each value in the x scale domain
//         .ordinalColors([topRowColor])
//         .label(function (d) {
//             return d.key.split(".")[1];
//         })
// 		.labelOffsetX(-30)
// 		//.labelOffsetY(0)
//
//         // title sets the row text
//         .title(function (d) {
//             return d.value;
//         })
//         .elasticX(true)
//         .gap(2)
//         .xAxis().ticks(4);
//
// 	// hourChart.width(300)
// // 	        .height(topRowHeight)
// // 	        .margins({top: 0, right: 50, bottom: 20, left: 50})
// // 	        .ordinalColors([topRowColor])
// // 	        .dimension(hour)
// // 	        .group(hourGroup)
// // 	        .centerBar(true)
// // 	        .elasticY(true)
// //
// // 	        .gap(1)
// // 	        .x(d3.scale.linear().domain([1,24]))
// // 	        .yAxis().ticks(4);
// //
//     tempChart.width(300)
//         .height(topRowHeight)
//         .margins({top: 20, left: 50, right: 10, bottom: 20})
//         .group(tempGroup)
//         .dimension(temp)
//         .ordinalColors([topRowColor])
//         .centerBar(true)
//         .gap(1)
//         .x(d3.scale.linear().domain([1,124]))
//         .yAxis().ticks(4)
//
// 		var boroughScale = d3.scale.linear().domain([0,7]).range(["#ffffff", "#dc3a23"])
// 		var boroughChartColors = []
// 		for(var i =2; i < 7; i ++){
// 			boroughChartColors.push(boroughScale(i))
// 		}
//
// 		//TODO:lenght of current data
// 		var allValue = data.length
// 		//console.log(allvalue)
//
//     boroughChart.width(220)
//         .height(140)
// 	    .margins({top: 20, left: 90, right: 10, bottom: 20})
// 		.ordinalColors(boroughChartColors)
// 		.gap(1)
// 		.data(function(zipcodeGroup){return zipcodeGroup.top(5)})
//         .dimension(borough)
// 		.ordering(function(d){ return -d.value})
//         .group(boroughGroup)
// 	    .ordinalColors(["#DE3E2A"])
// 	    .label(function (d) {
// 	        return d.key;
// 	    })
// 	    .elasticX(true)
// 		.labelOffsetX(-90)
// 		.labelOffsetY(15)
//         .label(function (d) {
// 			//return toTitleCase(d.key) + ' ' + Math.round((d.endAngle - d.startAngle) / Math.PI * 50) + '%';
//             return toTitleCase(d.key+ "  "+Math.round(d.value/allValue*100)+"%");
//         })
//         .xAxis().ticks(2)
//
// 	zipcodeChart.width(200)
// 	    .height(200)
// 	    .margins({top: 20, left: 40, right: 10, bottom: 20})
// 	    .group(zipcodeGroup)
// 	    .dimension(zipcode)
// 		.gap(1)
// 		.data(function(zipcodeGroup){return zipcodeGroup.top(10)})
// 		.ordering(function(d){ return -d.value })
// 	    .ordinalColors(["#D96947"])
// 	    .label(function (d) {
// 	        return d.key;
// 	    })
// 		.labelOffsetX(-35)
// 		.labelOffsetY(12)
//
// 	    // title sets the row text
// 	    .title(function (d) {
// 	        return d.value;
// 	    })
// 	    .elasticX(true)
// 	    .xAxis().ticks(4);
//
//
// 		var bottomRowHeight = 800
//
// 	agencyChart.width(380)
//         .height(bottomRowHeight)
//         .margins({top: 0, left: 125, right: 10, bottom: 20})
//         .group(agencyGroup)
//         .dimension(agency)
// 		.labelOffsetX(-120)
// 		.labelOffsetY(12)
// 		.data(function(agencyGroup){return agencyGroup.top(50)})
// 		.ordering(function(d){ return -d.value })
//         .ordinalColors(["#5CDD89"])
//         .label(function (d) {
//             return d.key+": "+ d.value+ " Reports";
//         })
//         // title sets the row text
//         .title(function (d) {
//             return d.value;
//         })
//         .elasticX(true)
//         .xAxis().ticks(4)
//
// 	complaintChart.width(390)
//         .height(bottomRowHeight)
//         .margins({top: 0, left: 180, right: 10, bottom: 20})
//         .group(complaintGroup)
//         .dimension(complaint)
// 		.labelOffsetX(-175)
// 		.labelOffsetY(12)
// 		.data(function(complaintGroup){return complaintGroup.top(50)})
// 		.ordering(function(d){ return -d.value })
//         .ordinalColors(["#63D965"])
// 		.title("test")
// 		.label(function (d){
// 			var keyString = d.key.split(" ")
// 			//return d.key
//             return keyString[0]+" "+keyString[1]+": "+ d.value + " Reports";
//         })
//         .elasticX(true)
//         .xAxis().ticks(4)
// 		//.on("mouseover", function(d){console.log("test")})
//
//
     dc.dataCount(".dc-data-count")
         .dimension(ndx)
         .group(all)
//         // (optional) html, for setting different html for some records and all records.
//         // .html replaces everything in the anchor with the html given using the following function.
//         // %filter-count and %total-count are replaced with the values obtained.
         .html({
             some:"%filter-count selected out of <strong>%total-count</strong> tracts | <a href='javascript:dc.filterAll(); dc.renderAll();''>Reset All</a>",
             all:"All  %total-count tracts selected."
         })
//     /*
//     //#### Data Table
//     // Create a data table widget and use the given css selector as anchor. You can also specify
//     // an optional chart group for this chart to be scoped within. When a chart belongs
//     // to a specific group then any interaction with such chart will only trigger redraw
//     // on other charts within the same chart group.
//     <!-- anchor div for data table -->
//     <div id="data-table">
//         <!-- create a custom header -->
//         <div class="header">
//             <span>Date</span>
//             <span>Open</span>
//             <span>Close</span>
//             <span>Change</span>
//             <span>Volume</span>
//         </div>
//         <!-- data rows will filled in here -->
//     </div>
//     */
//
    dc.dataTable(".dc-data-table")
         .dimension(dateDimension)
         // data table does not use crossfilter group but rather a closure
         // as a grouping function
         .group(function (d) {
			 return d.STATE
         })
         .size(250) // (optional) max number of records to be shown, :default = 25
         // dynamic columns creation using an array of closures
         .columns([
             function (d) {
                 return d.FIPS;
             },
             function (d) {
                 return d.LOCATION;
             },
             function (d) {
                 return d["E_TOTPOP"];
             },
             function (d) {
                 return d["AREA_SQMI"];
             }
         ])
         // (optional) sort using the given field, :default = function(d){return d;}
         .sortBy(function (d) {
             return d.FIPS;
         })
         // (optional) sort order, :default ascending
         .order(d3.ascending)
         // (optional) custom renderlet to post-process chart using D3
         .renderlet(function (table) {
             table.selectAll(".dc-table-group").classed("info", true);
         });

 	//nycMap
 	//var colorScale = d3.scale.linear().domain([0,10000]).range(["#eee", "#dc3a23"])
 	//var maxZipcode = zipcodeGroup.top(1)[0].value
		 var padding = 10
		 var width = 300
		 var height = 200
		 var projection = d3.geo.mercator()
                 //   .fitExtent([[padding,padding],[width-padding,height-padding]],geodata)
		 .scale(200).translate([500, 250]);
		 
 					// .center([-74.25,40.915])
//  					.translate([0, 0])
//  					.scale(450);
//
	
					 	var state = ndx.dimension(function(d){
					 		return d["ST_ABBR"]
					 	})
					 	var stateGroup =state.group();
var cartogram= dc.geoChoroplethChart("#cartogram");
	
	//var tip = d3.select("#cartogram").append('div').html("test")
	
	 cartogram
 		.projection(projection)
         .width(width) // (optional) define chart width, :default = 200
         .height(height) // (optional) define chart height, :default = 200
         .transitionDuration(1000) // (optional) define chart transition duration, :default = 1000
         .dimension(state) // set crossfilter dimension, dimension key should match the name retrieved in geo json layer
         .group(stateGroup) // set crossfilter group
         //.colors(function(d, i){return  colorScale(d.value);})
 		//.colorAccessor(function(d){return d.value})
 		.colors(["#aaa"])
 		.overlayGeoJson(geodata.features, "ST_ABBR", function(d) {
             return d.properties["iso3166_2"];
         })
		 
		 
 		d3.selectAll(".ST_ABBR")
		 .style("cursor","pointer")
		 .on('mouseover', function(d){
			
 			d3.select(this).style("fill","black")
			console.log(d)
 		})
		.on('click',function(d){
			console.log(d)
		})
 		//.legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))



     dc.renderAll();
//	d3.select("#loader").remove();
};

//#### Version
//Determine the current version of dc with `dc.version`
d3.selectAll("#version").text(dc.version);
