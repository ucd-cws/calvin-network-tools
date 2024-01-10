# PRM Command Line Tool

The ```cnf``` command line tool allows users to prepare their
[calvin-network-data](https://github.com/ucd-cws/calvin-network-data) for
running the HEC-PRM model or export as delimited matrix file.

The [HEC-PRM](http://www.hec.usace.army.mil/software/) code is distributed as a windows binary.   Further, HEC-PRM uses DSS formatted files as input.  We use the DSSVUE software to transfer data into and out of the DSS format.  While, DSSVue is written in JAVA, precompiled libraries for this package only work in the Windows environment.  For these two reasons, if you are running this software on MacOS or Linux, you will need to run a Windows emulator, like wine.

# Requirements

- [NodeJS](http://nodejs.org): use apt-get (linux) or install from website
- [git](https://git-scm.com/downloads)

# Quick Start

```bash
# pull down data (you may have already done this)
git clone https://github.com/ucd-cws/calvin-network-data

# install cnf cli via npm
npm install -g calvin-network-tools

# install and download of HEC-ROM library, 
# Sets up .prmconf file in home directory. follow prompts.
# will be asked for full path to data repo pulled above
cnf library init

```


# Run

```
cnf [command] [arg]
```

# Commands

- [Matrix](#matrix)
- [HEC-PRM](#hec-prm)
- [Library](#library)
- [Validate](#validate)
- [List](#list)
- [Apply Changes](#apply-changes)


## Matrix 

Create a delimited matrix file to run 3rd party solver.

Example:

Entire network
```
cnf matrix --format=csv --ts=. --to=network --max-ub=1000000000
```

Sub-network with limited time range and defined nodes
```
cnf matrix --verbose --format=csv --start=2002-10 --stop=2003-01 --ts=. --fs=, --to=network --outnodes=nodes --max-ub=1000000000 SR_SHA D5
```

Export network with manually-defined data repository path. In this case [calvin-network-data](https://github.com/ucd-cws/calvin-network-data) is located in /Users/msdogan/Documents/github/calvin-network-data/data folder
```
cnf matrix --data=/Users/msdogan/Documents/github/calvin-network-data/data  --verbose --format=csv --ts=. --fs=, --to=network_full --max-ub=1000000000
```

Export network with manually-defined data repository path in debug mode
```
cnf matrix --data=/Users/msdogan/Documents/github/calvin-network-data/data  --verbose --format=csv --start=2002-10 --stop=2003-01 --ts=. --fs=, --to=network --outnodes=nodes --max-ub=1000000000 --debug=All
```

Help
```
cnf matrix --help
```

## HEC PRM

Run HEC-PRM related command

Commands

- [Build](#hec-prm-build)
- [Run](#hec-prm-run)
- [Update Repo](#hec-prm-update-repo)
- [Show](#hec-prm-show)
- [Debug](#hec-prm-debug)


### HEC-PRM build 

Write HOBBES Network Format CALVIN data to dss file.  Requires the Calvin HEC Runtime (see [releases](https://github.com/ucd-cws/calvin-network-tools/releases) section)

Examples:

Basic
```
cnf hec-prm build --prefix out
 ```

Specify date range for TimeSeries data
```
cnf build --prefix partialRun --start 2000-01 --stop 2002-1
```

By default to files will be created in your current working directory.  If you would like
to specify the path to create the files, use the *--output* flag.

Help

```
cnf hec-prm build --help
```


### HEC-PRM Run

Run the hecprm.exe program with provided prefix files from the [build](hec-prm-build) command.  Wine is required.

```bash
cnf hec-prm run --prefix [prefix]
```

Help

```
cnf hec-prm run --help
```

### HEC-PRM Update Repo

Apply flow results from HEC-PRM run back to CALVIN data repository.

```bash
cnf hec-prm update-repo --prefix [prefix]
```

Help

```
cnf hec-prm update-repo --help
```

### HEC-PRM Show

Print a list of nodes as they are represented in the pri files.  You can pass 'ALL'
to print all nodes/links.

```bash
cnf hec-prm show ALL
```

Help

```
cnf hec-prm show --help
```

## HEC-PRM Debug

Commands
- [Show Build](#hec-prm-show-build)
- [DSS to JSON](#hec-prm-dss-to-json)

### HEC-PRM Show Build 

Print the JSON that will be passed to the DssWriter.  Optional flag *--showData*
will print the csv file data as well.  Otherwise just the path is printed.

Example
```bash
cnf hec-prm debug show-build [node1] [node1] ...
```

Help
```bash
cnf hec-prm debug show-build --help
```

### HEC-PRM DSS to JSON 

Dump DSS file to directory.  index.json file will contain all nodes by name. 
Each entry will then have a single json file representation in directory.

Example
```bash
cnf hec-prm debug dss-to-json -f [path/to/dss/file]
```

help
```bash
cnf hec-prm debug dss-to-json --help
```

## Library

Run cnf maintenance related command

Commands

- [Init](#library-init)
- [Update](#library-update)


### Library Init

Initialize the .prmconf file.  Downloads runtime if needed.

Init will ask for your full path to the data repo's /data folder (/path/to/repo/calvin-network-data/data).  Then it will download the runtime and
create a .prmconf file in your home dir containing the path to both the runtime
and the data repo so these do not need to be supplied every time you run a command.

```
cnf library init
```

### Library Update

Update cnf and CALVIN HEC-PRM Runtime to latest versions.

```
cnf library update
```

## Validate

Validate a CALVIN data is in HOBBES network format.  Prints the 
errors and number of nodes, links and regions found.

Example:

```
cnf validate
```

Help

```
cnf validate --help
```

## List

Print list of all nodes/links given as [Prmname],[Repo Path].
Pass 'ALL' to print all nodes/links.

Example:

```
cnf list [node1] [node2] ...
```

Help

```
cnf list --help
```

## Apply Changes

Using the [Calvin Network App](http://cwn.casil.ucdavis.edu/) (repo [here](https://github.com/ucd-cws/calvin-network-app)),
you can download all tabular data for a node/link in a single excel file using the
'Download Excel Data File' button. ex: [https://cwn.casil.ucdavis.edu/#info/north-coast,lower-klamath,sr_cle](https://cwn.casil.ucdavis.edu/#info/north-coast,lower-klamath,sr_cle).

Using this file you can make modifications to the underlying data for a node.  Once you are ready to
apply those modifications back to the [data repo](https://github.com/ucd-cws/calvin-network-data),
you simply run this command passing the path to the excel file.  You should be able to use *git*
to make sure all changes were apply correctly to the data repo.


Example:

```
cnf apply-changes -x [path]
```

Help

```
cnf apply-changes --help
```


# ADVANCED Stuff

## .prmconf file
All arguments for prm commands can be passed via command line parameter or stored in a JSON formatted .prmconf file.
This file should be stored in your accounts home directory be default.  If you
wish to supply a config file that is not located in your home directory, you can
do so with --config [path/to/config/file] parameter.

Again, the quick start command above will configure this file for you.

## Calvin HEC Runtime

[Download the HEC Runtime](https://github.com/ucd-cws/calvin-network-tools/releases)

For your convenience and to reduce pain and suffering, we have created a
package with all required libraries to run the cnf tool minus NodeJS (and wine).
The package can be found [here](https://github.com/ucd-cws/calvin-network-tools/releases) in the releases section.

Currently this runtime is REQUIRED to run the **build** command.  You need to
download and unzip the package.  Then specify the path to the unzipped folder in **build** using the *--runtime* flag.  Or you can simply run **prm init** and this will download and
install the runtime as well as create a .prmconf file in your home folder.


### The Runtime contains:

- [Java 32-Bit](http://java.com/en/download/manual.jsp)
- [HecDss Java Library](http://www.hec.usace.army.mil/software/hec-dssvue/)
  - The required jars are bundled with HEC-DSSVUE
  - jars are found in /path/to/install/dir/HEC/HEC-DSSVue/lib;
- DssWriter.jar
 - Custom csv to paired/timeseries data DSS writer java code
- HecPrm Executable


### Linux / OS X

To use the Calvin HEC Runtime, wine is required for Linux and OS X.

- [wine](https://www.winehq.org/)
  - Linux: use apt-get or other package manager
  - OS X: use [homebrew](http://brew.sh/)
    - brew install wine


## DSSVUE

You will most likely want to review your DSS files from time to time.  [HEC-DSSVue](http://www.hec.usace.army.mil/software/hec-dssvue/) is the most common software for that.  The download section of the [HEC-DSSVue](http://www.hec.usace.army.mil/software/hec-dssvue/) includes a windows and a linux version available for download.

For linux, if you have root access, consider unzipping the hec-dssvue201 directory int ```/usr/local/lib```, and copying the hec-dssvue.sh file to ```/usr/local/bin/dssvue```, with the proper modification of ```PROG_ROOT```.  This allows access to the program for all users.  A few other minor tweaks seem to be required.

```
$ diff -u1 /usr/local/lib/hec-dssvue201/hec-dssvue.sh /usr/local/bin/dssvue
--- /usr/local/lib/hec-dssvue201/hec-dssvue.sh	2013-12-06 07:38:29.244310551 -0800
+++ /usr/local/bin/dssvue	2015-10-22 15:52:52.451576726 -0700
@@ -6,3 +6,3 @@
 then
-	if [[ "$1" =~ .*\.py ]]
+	if [[ "$1" =~ "*.py" ]]
 	then
@@ -36,3 +36,3 @@
 # PROG_ROOT=/usr/local/hec/hec-dssvue
-PROG_ROOT=.
+PROG_ROOT=/usr/local/lib/hec-dssvue201
 JAVA_EXE=$PROG_ROOT/java/bin/java
@@ -48,3 +48,3 @@
 -DLOGFILE=$APPDATA/logs/hec-dssvue.log \
--Dpython.path=$PROG_ROOT/jar/sys/jythonlib.jar/lib:jar/sys/jythonUtils.jar \
+-Dpython.path=$PROG_ROOT/jar/sys/jython.jar/Lib \
 -Dpython.home=$APPDATA/pythonHome \
@@ -56,5 +56,4 @@
 -DCWMS_EXE=$PROG_ROOT \
--DPLUGINS=$PROG_ROOT/plugins \
 -Djava.security.policy=$PROG_ROOT/config/java.policy \
--cp $JARDIR/*:$JARDIRSYS/*:$JARDIRHELP/*:plugins/* \
+-cp $JARDIR/*:$JARDIRSYS/*:$JARDIRHELP/*:${PROG_ROOT}/plugins/* \
 hec.dssgui.HecDssVue $* \
```
