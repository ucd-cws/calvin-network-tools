package edu.ucdavis.watershed;

import java.util.Vector;

import hec.heclib.dss.CondensedReference;
import hec.heclib.dss.HecDss;
import hec.io.DataContainer;
import hec.io.TimeSeriesContainer;

public class DssReader {

	public static void main(String[] args) throws Exception {
		
		HecDss dssFile = Dss.open(args[0]);
		
		if( args.length > 1 ) {
			getData(dssFile, args[1]);
		} else {
			list(dssFile);
		}
	}
	
	public static void getData(HecDss dssFile, String requestPath) throws Exception {
		requestPath = requestPath.trim();
		Vector<CondensedReference> v= dssFile.getCondensedCatalog();
	
		for( CondensedReference p: v) {
			String path = p.getNominalPathname();
			
			if( path == requestPath ) {
				DataContainer dc = dssFile.get(p.getPathname(0));
				if( dc instanceof TimeSeriesContainer ) {
					System.out.println(path+": Timeseries");
				} else {
					System.out.println(path+": Paried Data");
				}
			}
			
		}
	}
	
	public static void list(HecDss dssFile) throws Exception {
		Vector<CondensedReference> v= dssFile.getCondensedCatalog();

		for( CondensedReference p: v) {
			String path = p.getNominalPathname();			
			
			DataContainer dc = dssFile.get(p.getPathname(0));
			if( dc instanceof TimeSeriesContainer ) {
				System.out.println(path+": Timeseries");
			} else {
				System.out.println(path+": Paried Data");
			}
		}
	}
}
