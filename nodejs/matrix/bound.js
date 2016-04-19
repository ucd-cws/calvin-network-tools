// Given a link, and the time steps,
// return the LB and UB at each timestep.
// List is in format of [lb,ub]

module.exports = function(link,steps,hnf) {
    var step_bound = [];
    var month,month_cost={};
    var bounds,i,bound;
    
    var bm=[];			// Temporary bounds

    var p=link.properties;
    
    var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    function getMonth(dateString) {
	var m = parseInt(dateString.split('-')[1])-1;
	return months[m];
    }
    // Start with no bounds
    steps.forEach(function(step) { steps_bound.push([0,null]); });

    for (i=0;i<p.bounds.length;i++) {
	bound = p.bounds[i];
	
	switch(bound.type) {
	case 'NOB':		// We are good
	    break;
	case 'LBC':
	    for (var i=0;i<=steps.length;i++) {
		if (steps_bound[i][0]===null || steps_bound[i][0]<bound.bound) {
		    steps_bound[i][0]=bound.bound;
		}
	    }
	    break;
	case 'LBM':
	case 'LBT':
	    hnf.expand(link, ['bounds.'+i+'.bound'], function(){
		bm={};
		link.bounds[i].bound.forEach(function(b) {
		    bm[b[0]]=b[1];
		});
		for (var i=0;i<=steps.length;i++) {
		    // Almost the same code for LBM and LBT
		    bound=(bound.type==='LBM')?bm[getMonth(steps[i])]:bm[steps[i]];
		    if ((typeof(bound)!=='undefined' && bound!==null ) &&
			(steps_bound[i][0]===null || steps_bound[i][0]<bound)) {
			steps_bound[i][0]=bound;
		    }
		}
	    });
	    break;
	case 'UBC':
	    for (var i=0;i<=steps.length;i++) {
		if (steps_bound[i][1]===null || steps_bound[i][1]>bound.bound ) {
		    steps_bound[i][1]=bound.bound;
		}
	    }
	    break;
	case 'UBM':
	case 'UBT':
	    hnf.expand(link, ['bounds.'+i+'.bound'], function(){
		bm={};
		link.bounds[i].bound.forEach(function(b) {
		    bm[b[0]]=b[1];
		});
		for (var i=0;i<=steps.length;i++) {
		    // Almost the same code for BM and BT
		    bound=(bound.type==='UBM')?bm[getMonth(steps[i])]:bm[steps[i]];
		    if ((typeof(bound)=='undefined' &&  bound!==null ) &&
			(steps_bound[i][1]===null || steps_bound[i][1]>bound)) {
			steps_bound[i][1]=bound;
		    }
		}
	    });
	    break;
	case 'EQC':
	    hnf.expand(link, ['bounds.'+i+'.bound'], function(){
		bm={};
		link.bounds[i].bound.forEach(function(b) {
		    bm[b[0]]=b[1];
		});
		for (var i=0;i<=steps.length;i++) {
		    bound=bm[steps[i]];
		    if (typeof(bound)!=='undefined' && bound!==null) {
			if (steps_bound[i][0]===null ||
			    steps_bound[i][0]<bound )
			{
			    steps_bound[i][0]=bound;
			}
			if (steps_bound[i][1]===null ||
			    steps_bound[i][1]>bound ) {
			    steps_bound[i][1]=bound;
			}
		    }
		}
	    });
	    break;
	default :
	    throw new UserException('Bad Cost Type'+link.properties.hobbes.networkId);
	}
	return step_bound;
    }
}
