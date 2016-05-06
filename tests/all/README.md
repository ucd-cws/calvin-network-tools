# All output

This directory contains some complete output files.  

This fist example creates a single water year run for the complete model
```{bash}
cnf --start=2002-09-15 --end=2003-09-15 matrix --ts=. --fs=:tab: --max_ub=1000000 \
  --nodes=all_wy2003.node --matrix=all_wy2003.dat
```

This second example creates a decade of data.
 
```{bash}
cnf --start=1990-09-15 --end=2000-09-15 matrix --ts=. --fs=:tab: --max_ub=1000000 \
  --nodes=all_wys90.node --matrix=all_wys90.dat
```

This third example creates 25 years of data.
 
```{bash}
cnf --start=1975-09-15 --end=2000-09-15 matrix --ts=. --fs=:tab: --max_ub=1000000 \
  --nodes=all_25.node --matrix=all_25.dat
```
