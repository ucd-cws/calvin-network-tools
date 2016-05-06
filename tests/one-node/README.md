# One-Node Tests

These are simple tests of the matrix builder for a single node.  There is one reservoir and one non-reservior
node.

These examples can be replicated with the command 

```{bash}
for i in SR_WHI D94; 
do n=`echo $i | tr [:upper:] [:lower:]`; 
cnf --start=2001-08-01 --end=2001-10-01 matrix  --ts=. --fs=:tab: --max_ub=1000000 \
    --nodes=$n.nodes --matrix=$n.dat $i; 
done
```


## D94

## SR_WHI 