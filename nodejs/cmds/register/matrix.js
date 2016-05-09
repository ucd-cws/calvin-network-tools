module.exports = function(program, run) {
    var cmd = program
        .command('matrix')
        .description('Create a network matrix')
        .option('-f, --format <csv|tsv>', 'Output Format',/^(csv|tsv)$/,'tsv')
        .option('--no-header','Supress Header')
        .option('-S, --ts <sep>','Time step separator, default=@')
        .option('-F, --fs <sep>','Field Separator, default=,')
        .option('--max_ub <number>','Replace null upperbound with a big number.  Like 1000000')
        .option('--matrix <filename>','Send matrix to filename, default=STDOUT')
        .option('--nodes <filename>','Send list of nodes to filename, default=no output, can use STDOUT')
        .option('--outbound_penalty <json>','Specify a penalty function for outbound boundary conditions. eg. [[10000,"-10%"],[0,0],[-10000,"10%"]]')
        .action(run);
}

/*

The idea for the outbound penalty is 
 --outbound_penalty='[[10000,"-10%"],[0,0],[-10000,"10%"]]'
 
 */