# North Example

This is a simple example of a small set of nodes in the North part of the model, that have a nice bottleneck of a few outbound nodes.  This example can be run like this:

```{bash}
nodes='A101 C2 C5 C87 CVPM01G CVPM01S D5 D73 D74 D94 EXT_REDDIN GW_01
 HGP01 HGR01 HNP101 HP101 HSD101 HSU101D5 HSU101D74 HSU101SR3 HU101
 HXI101 INT_REDDIN SR_CLE SR_SHA SR_WHI U101 WTP101';
cnf --start=2001-09-15 --end=2002-10-15 matrix  --ts=. --fs=:tab: --max_ub=1000000 \
    --nodes=north.nodes --matrix=north.dat $nodes; 
```
