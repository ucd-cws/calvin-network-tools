// Given a link
// return a list of every set of cost links at each timestep.
// How do you get the total number of links to make? You can grab the flow?

var cost=require('./cost');
var bound=require('./bound');

module.exports = function(link,hnf,config) {
    var steps=[];
    var p=link.properties;
    var amp=p.amplitude;
    var step_costs;
    var step_bounds;
    var i,c;
    var lb,ub,costs,lb_left,ub_left;
    var rows = [];

    console.log(p.hobbes.networkId);
    hnf.expand(link, ['flow'], function(){
	var flow = link.properties.flow;
	
	for( i = 1; i < flow.length; i++ ) { // i=0 is header;
	    // Get boundary Conditions 
	    if (( ! config.start || config.start<flow[i][0]) &&
		(! config.end || flow[i][0]<config.end)) {
		steps.push(flow[i][0]);
	    }
	}
    });
    step_costs=cost(link,steps,hnf);
    step_bounds=bound(link,steps,hnf);
    // Now add i,j,k links
    console.log('Steps:'+steps);
    for( i = 1; i < steps.length; i++ ) { // i=0 is header;
	lb=step_bounds[i][0];
	ub=step_bounds[i][1];
	ub_left=ub;
	lb_left=lb;
	costs=step_costs[i];
	for (c=0; c<costs.length;c++) {
	    rows.push[[p.origin,steps[i]].join('@'),
		      [p.terminal,steps[i]].join('@'),
		      c,
		      costs[c][0],
		      costs[c][1]]
	}
    }
    return rows;
}
