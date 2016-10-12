module.exports = function(program, run) {
    var cmd = program
        .command('matrix')
        .description('Create a network matrix')
        .option('-f, --format <csv|tsv|dot|png>', 'Output Format, dot | png (graphviz required)',/^(csv|tsv|dot|png)$/,'tsv')
        .option('-N, --no-header','Supress Header')
        .option('-S, --ts <sep>','Time step separator, default=@')
        .option('-F, --fs <sep>','Field Separator, default=,')
        .option('-s, --start [YYYY-MM]', 'Specify start date for TimeSeries data')
        .option('-t, --stop [YYYY-MM]', 'Specify stop date for TimeSeries data')
        .option('-M, --max-ub <number>','Replace null upperbound with a big number.  Like 1000000')
        .option('-d, --debug [nodes]', 'Set debug nodes.  Either "ALL", "*" or comma seperated list of prmnames (no spaces)')
        .option('-d, --data [repo/path/data]', 'path to Calvin Network /data folder')
        .option('-T, --to <filename>','Send matrix to filename, default=STDOUT')
        .option('-O, --outnodes <filename>','Send list of nodes to filename, default=no output, can use STDOUT')
        .option('-p, --outbound-penalty <json>','Specify a penalty function for outbound boundary conditions. eg. [[10000,"-10%"],[0,0],[-10000,"10%"]]')
        .action(run);
    
    return cmd;
}

/*

The idea for the outbound penalty is 
 --outbound_penalty='[[10000,"-10%"],[0,0],[-10000,"10%"]]'
 
 */