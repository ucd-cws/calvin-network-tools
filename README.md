# PRM Command Line Tool

The ```prm``` command line tool allows users to prepare their
[calvin-network-data](https://github.com/ucd-cws/calvin-network-data) for
running the HEC-PRM model code.

The [HEC-PRM](http://www.hec.usace.army.mil/software/) code is distributed as a windows binary.   Further, HEC-PRM uses DSS formatted files as input.  We use the DSSVUE software to transfer data into and out of the DSS format.  While, DSSVue is written in JAVA, precompiled libraries for this package only work in the Windows environment.  For these two reasons, if you are running this software on MacOS or Linux, you will need to run a Windows emulator, like wine.

## Requirements

- [NodeJS](http://nodejs.org)
  - use apt-get (linux) or install from website
- [git](https://git-scm.com/downloads)

## Quick Start

Make sure you have pulled the [data repo](https://github.com/ucd-cws/calvin-network-data).

Fastest way to a build.

```bash
# You will need NodeJS and git.

# pull down data (you may have already done this)
git clone https://github.com/ucd-cws/calvin-network-data

# install prm cli via npm
npm install -g calvin-network-tools

prm init
# runs install and download of library, follow prompts.
# will be asked for full path to data repo pulled above
```

This will:
 - install npm dependencies
 - pull and extract the runtime
 - setup the .prmconf file with runtime and data repo locations

### Calvin HEC Runtime

[Download the HEC Runtime](https://github.com/ucd-cws/calvin-network-tools/releases)

For your convenience and to reduce pain and suffering, we have created a
package with all required libraries to run the prm tool minus NodeJS (and wine).
The package can be found [here](https://github.com/ucd-cws/calvin-network-tools/releases) in the releases section.

Currently this runtime is REQUIRED to run the **build** command.  You need to
download and unzip the package.  Then specify the path to the unzipped folder in **build** using the *--runtime* flag.  Or you can simply run **prm init** and this will download and
install the runtime as well as create a .prmconf file in your home folder.


#### The Runtime contains:

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


## Install Node Modules

The quick start command above will do this as well.

```
cd /path/to/repo && npm install
```

## Run

```
node prm [command] [arg]
```

### .prmconf file
All arguments for prm commands can be passed via command line parameter or stored in a JSON formatted .prmconf file.
This file should be stored in your accounts home directory be default.  If you
wish to supply a config file that is not located in your home directory, you can
do so with --config [path/to/config/file] parameter.

Again, the quick start command above will configure this file for you.

## Commands

- [init](#init)
- [Crawl](#crawl---data-directory)
- [Build](#build---prefix-prefix---runtime-pathtohecruntime---data-pathtodatarepo)
- [Run](#run)
- [Show](#show-prmname-prmname-)
- [List](#list-prmname-prmname-)
- [Show Build](#showbuild-prmname)
- [Apply Excel Changes](#excel--x-path)

### init

Init will ask for your full path to the data repo's /data folder (/path/to/repo/calvin-network-data/data).  Then it will download the runtime and
create a .prmconf file in your home dir containing the path to both the runtime
and the data repo so these do not need to be supplied every time you run a command.

### crawl --data [directory]
Test crawl a data directory.  Prints the errors, number for nodes/links and number of regions found.

### build --prefix [prefix] --runtime [/path/to/hec/runtime] --data [/path/to/data/repo]
Write CSV file(s) to dss file.  Requires the Calvin HEC Runtime (see [releases](https://github.com/ucd-cws/calvin-network-tools/releases) section)

Example
```
prm build --prefix out --runtime ~/Desktop/HEC_Runtime --data ~/dev/calvin-network-data/data
 ```

By default to files will be created in your current working directory.  If you would like
to specify the path to create the files, use the *--output* flag.

#### Specify date range for TimeSeries data
##### --start [date] --stop [date]

example:
```
prm build --prefix partialRun --start 2000-01 --stop 2002-1
```

#### Debug build

##### --verbose
Optionally you can add *--verbose* to dump the hec-dss libraries output.

##### --debugRuntime
The PRM NodeJS code uses a json file to pass information to the dssWriter jar file.
Normally this file is removed after the jar is finished executing.  To debug to this file,
you can specify *--debugRuntime* and the file will not be removed after execution.



### Run

```bash
prm run --prefix [prefix] --runtime [/path/to/hec/runtime]
```

Run the hecprm.exe program with provided prefix files.  Wine is required.

### show [prmname] [prmname] ...
Print a list of nodes as they are represented in the pri files.  You can pass 'ALL'
to print all nodes/links.

### list [prmname] [prmname] ...
Print all nodes/link.  Format:
prmname,/full/path/to/file

You can pass 'ALL' to print all nodes/links.

### showBuild [prmname]
Print the JSON that will be passed to the DssWriter.  Optional flag *--showData*
will print the csv file data as well.  Otherwise just the path is printed.

### excel -x [path]

Using the [Calvin Network App](http://cwn.casil.ucdavis.edu/) (repo [here](https://github.com/ucd-cws/calvin-network-app)),
you can download all tabular data for a node/link in a single excel file using the
'Download Excel Data File' button. ex: [http://cwn.casil.ucdavis.edu/#info/SR_CLE-D94](http://cwn.casil.ucdavis.edu/#info/SR_CLE-D94).

Using this file you can make modifications to the underlying data for a node.  Once you are ready to
apply those modifications back to the [data repo](https://github.com/ucd-cws/calvin-network-data),
you simply run this command passing the path to the excel file.  You should be able to use *git*
to make sure all changes were apply correctly to the data repo.


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
