// The following Nodes are included in the formulation
// Any node with an inflow is added
// Any storage node flows from timestep to timestep
// Storage Nodes have Initial and Finals

function(item,inflows) {
    hnf.expand(item, ['inflows.default.inflow'],function(){
	var inflow = item.properties.inflows.default.inflow;

	for( var i = 1; i < inflow.length; i++ ) {
            if (( ! config.start || config.start<inflow[i][0]) &&
		(! config.end || inflow[i][0]<config.end)) {
		inf_at=['INFLOW',inflow[i][0]].join('@');
		inflow_source[inf_at]++;
             row=[inf_at,
                  [id,inflow[i][0]].join('@'),
                  0,1,
                  inflow[i][1],
                  inflow[i][1]].join(',');
		rows.push(row);
	    }
	}
    });
}
