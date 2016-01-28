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
		
		Dss.exportJson(dssFile, "E:\\S09I05", "");
		
		// JM
		//HecDss dssFile = Dss.open("E:\\wy2002_jTS.dss");
		
	/*	Vector<String> v =  dssFile.getPathnameList();
		//Vector<String> v = dssFile.getCatalogedPathnames();
		for( String path: v) {
			System.out.println(path);
			
			CwsTimeSeriesContainer ts = new CwsTimeSeriesContainer();
			ts.timeSeriesContainer = (TimeSeriesContainer) dssFile.get(path);
			
			for( int i = 0; i < ts.timeSeriesContainer.times.length; i++ ) {
				ts.dates.add(Dss.calcDate(ts.timeSeriesContainer.times[i]));
			}
			
			String jsonInString = mapper.writeValueAsString(ts);
			System.out.println(jsonInString);
			mapper.writeValue(new File("E:\\S09I05\\test.json"), ts);
			break;

			//t = 1;
		}
	System.out.print(t);*/
		//TimeSeriesContainer ts = (TimeSeriesContainer) dssFile.get("/HEXT2014/C131_SINK G12/FLOW_LOSS(KAF)/01JAN1920/1MON/CALSIM - D889/",true);
		//TimeSeriesContainer ts = (TimeSeriesContainer) dssFile.get("/S09I04/GW-01/STOR/01JAN1920 - 01JAN2000/1MON//",true);
		
		// JM
		//TimeSeriesContainer ts = (TimeSeriesContainer) dssFile.get("/INIT/SR_BLB/STOR/01JAN1920 - 01JAN2000/1MON//",true);
		//TimeSeriesContainer ts = (TimeSeriesContainer) dssFile.get("//C29/FLOW_LOC(KAF)/01JAN1920 - 01JAN2000/1MON/DEFAULT/",true);
		//System.out.print(dssFile.getStartTime());
		/*for( int i = 0; i < ts.times.length; i++ ) {
			System.out.println(ts.times[i]);
		}*/
		t =1;
		t++;
	}
}
