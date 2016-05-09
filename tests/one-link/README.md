# One-Link Tests

These examples can be replicated with the command 

```{bash}
for i in SR_WHI-D5 SR_CLE-D94; 
do n=`echo $i | tr [:upper:] [:lower:]`; 
cnf --start=2001-08-01 --end=2001-10-01 matrix  --ts=. --fs=:tab: --max_ub=1000000 \
    --nodes=$n.nodes --matrix=$n.dat $i; 
done
```


## SR_CLE-D94

Note this link has no bounds so all the cost functions are always reported in the matrix formulation.

## SR_WHI-D5

This link has an upper bound, so the cost functions are truncated when they reach the upper bound of the link itself.
