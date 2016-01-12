package edu.ucdavis.watershed;

import java.io.File;
import java.util.Vector;

import com.fasterxml.jackson.databind.ObjectMapper;

import hec.heclib.dss.HecDss;
import hec.io.TimeSeriesContainer;


public class Test {
	public static void main(String[] args) throws Exception {		
		//try {
		int t= 0;
		HecDss dssFile = Dss.open("E:\\S09I05\\S09I05TS.dss");
		
		// JM
		//HecDss dssFile = Dss.open("E:\\wy2002_jTS.dss");
		
		/*Vector<String> v =  dssFile.getPathnameList();
		for( String path: v) {
			System.out.println(path);
		//	TimeSeriesContainer ts = (TimeSeriesContainer) dssFile.get(path);
t++;
			//t = 1;
		}
	System.out.print(t);	*/
		//TimeSeriesContainer ts = (TimeSeriesContainer) dssFile.get("/HEXT2014/C131_SINK G12/FLOW_LOSS(KAF)/01JAN1920/1MON/CALSIM - D889/",true);
		//TimeSeriesContainer ts = (TimeSeriesContainer) dssFile.get("/S09I04/GW-01/STOR/01JAN1920 - 01JAN2000/1MON//",true);
		
		// JM
		//TimeSeriesContainer ts = (TimeSeriesContainer) dssFile.get("/INIT/SR_BLB/STOR/01JAN1920 - 01JAN2000/1MON//",true);
		TimeSeriesContainer ts = (TimeSeriesContainer) dssFile.get("//C29/FLOW_LOC(KAF)/01JAN1920 - 01JAN2000/1MON/DEFAULT/",true);
		System.out.print(dssFile.getStartTime());
		/*for( int i = 0; i < ts.times.length; i++ ) {
			System.out.println(ts.times[i]);
		}*/
		t =1;
		t++;
	}
}
