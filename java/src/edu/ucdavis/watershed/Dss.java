package edu.ucdavis.watershed;

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Vector;

import com.fasterxml.jackson.databind.ObjectMapper;

import hec.data.meta.Catalog;
import hec.dssgui.CombinedDataManager;
import hec.heclib.dss.CondensedReference;
import hec.heclib.dss.HecDSSUtilities;
import hec.heclib.dss.HecDss;
import hec.io.DataContainer;
import hec.io.PairedDataContainer;
import hec.io.TimeSeriesContainer;

import java.io.File;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.temporal.ChronoUnit;

public class Dss {
	
	@SuppressWarnings("deprecation")
	//public static Date EPOCH = new Date(0, 0, 1, 0, 0, 0);
	public static LocalDateTime EPOCH = LocalDateTime.of(1899, Month.of(12), 31, 0, 0, 0);

	public static HecDss open(String file) throws Exception {
		HecDSSUtilities.setMessageLevel(0);
		return HecDss.open(file);
	}

	public static void write(Config config, CsvData data, HecDss dssFile, String file) throws Exception {
		if( config.getType().equals("paired") ) {
			writePairedData(config, data, dssFile);
		} else {
			writeTimeSeriesData(config, data, dssFile, file);
		}
	}

	public static void writePairedData(Config config, CsvData data, HecDss dssFile) throws Exception {

		PairedDataContainer pdc = new PairedDataContainer();

		if( config.label != null ) {
			pdc.labels = new String[] {"", config.label};

		}
		if( config.date != null ) {
			pdc.date = config.date;
		}

		if( config.location != null ) {
			pdc.location = config.location;
		}

		if( config.xunits != null ) {
			pdc.xunits = config.xunits;
		}

		if( config.xtype != null ) {
			pdc.xtype = pdc.xtype;
		}

		if( config.xparameter != null ) {
			pdc.xparameter = pdc.xparameter;
		}

		pdc.xOrdinate = config.xOrdinate;

		if( config.yunits != null ) {
			pdc.yunits = config.yunits;
		}

		if( config.ytype != null ) {
			pdc.ytype = config.ytype;
		}

		if( config.yparameter != null ) {
			pdc.yparameter = config.yparameter;
		}

		pdc.yOrdinate = config.yOrdinate;

		pdc.fullName = config.path;

		pdc.xOrdinates = data.firstColumn;
		pdc.yOrdinates = data.columns;

		pdc.numberCurves = config.numberCurves;
		pdc.numberOrdinates = pdc.xOrdinates.length;

		dssFile.put(pdc);
	}

	public static void writeTimeSeriesData(Config config, CsvData csv, HecDss dssFile, String file) throws Exception {
		TimeSeriesContainer ts = new TimeSeriesContainer();
	
		ts.fullName = config.path;
		ts.fileName = file;
		
		ts.times = new int[csv.data.size()];
		for( int i = 0; i < csv.data.size(); i++ ) {
			ts.times[i] = calcTime(csv.data.get(i).name, i == 0 ? true : false);
		}
		ts.startTime = ts.times[0];
		ts.endTime = ts.times[ts.times.length-1];
		
		ts.values = csv.columns[0];
		ts.numberValues = ts.values.length;
				
		if( config.getParameter() != null ) {
			ts.parameter = config.getParameter(); //partE;
		}
		if( config.getLocation() != null ) {
			ts.location = config.getLocation(); //partE;
		}
		
		ts.type = config.getXtype();
		ts.units = config.getUnits();
	
		dssFile.put(ts);
	}
	
	public static void exportJson(HecDss dssFile, String directory, String regex) throws Exception {
		int count = 0;
		
		HashMap<String, HashMap<String,Integer>> map = new HashMap<String, HashMap<String,Integer>>();
		Vector<CondensedReference> v = dssFile.getCondensedCatalog();
		ObjectMapper mapper = new ObjectMapper();
		
		cleanDirectory(new File(directory));
		new File(directory).mkdir();
		
		for( CondensedReference path: v) {
			
			CwsContainer ts = new CwsContainer();
			DataContainer dc;
			String name;
			String parameter;
			
			try {
				String hecpath = path.getNominalPathname();
				
				if( !regex.contentEquals("") && regex != null ) {
					if( !hecpath.matches(regex) ) continue;
				}
				
				dc = dssFile.get(hecpath, true);
				
				if( dc instanceof TimeSeriesContainer ) {
					ts.timeSeriesContainer = (TimeSeriesContainer) dc;
					name = ts.timeSeriesContainer.getLocationName();
					parameter = ts.timeSeriesContainer.getParameterName();
					
					if( ts.timeSeriesContainer.times == null ) {
						System.out.println("Ignoring: "+path.getNominalPathname());
						continue;
					}
					
					for( int i = 0; i < ts.timeSeriesContainer.times.length; i++ ) {
						ts.dates.add(Dss.calcDate(ts.timeSeriesContainer.times[i]));
					}
				} else {
					ts.pairedDataContainer = (PairedDataContainer) dc;
					parameter = "pairedData";
					name = ts.pairedDataContainer.location;
				}
			
			} catch(Exception e2) {
				continue;
			}
			
			mapper.writeValue(new File(directory+File.separatorChar+count+".json"), ts);
		
			if( !map.containsKey(name) ) {
				map.put(name, new HashMap<String, Integer>());
			}
			map
				.get(name)
				.put(parameter, count);
			
			count += 1;
		}
		
		mapper.writeValue(new File(directory+File.separatorChar+"index.json"), map);
	}
	
	public static boolean cleanDirectory(File dir) {
	    if (dir.isDirectory()) {
	        String[] children = dir.list();
	        for (int i=0; i<children.length; i++) {
	            boolean success = cleanDirectory(new File(dir, children[i]));
	            if (!success) {
	                return false;
	            }
	        }
	    }
	    return dir.delete();
	}
	
	public static String calcDate(int time) {
		LocalDateTime ldt = EPOCH.plusMinutes((long) time);
		return ldt.toString();
	}
	
	public static int calcTime(String date, boolean start) {
		String[] parts = date.split("-");
		
		int year = Integer.parseInt(parts[0]);
		int month = Integer.parseInt(parts[1]);
		int day = Integer.parseInt(parts[2]);
		
		LocalDateTime d = LocalDateTime.of(year, Month.of(month), day, 0, 0, 0);
		
		long diff = ChronoUnit.MINUTES.between(EPOCH, d);
		
		// HACK.  If we are on the first date and the month doesn't have 31 days, add one
		// day cause this system is fubar and Quinn came up with craziness below.
		if( start ) {
			if( month == 2 || month == 4 || month == 6 || month == 9 || month == 11 ) {
				diff += 1440;
			}
		}
		
		return (int) diff;
	}

}


/*
// Time Series
parameter|type|units|count
EVAP_RATE(FT)|PER-AVER|FT|49
FLOW_CALIB(KAF)|PER-AVER|KAF|1
FLOW_DIV(KAF)|PER-AVER|KAF|1999
FLOW_EQC(KAF)|PER-AVER|KAF|47
FLOW_GW(KAF)|PER-AVER|KAF|32
FLOW_INTER(KAF)|PER-AVER|KAF|30
FLOW_LBT(KAF)|PER-AVER|KAF|33
FLOW_LOC(KAF)|PER-AVER|KAF|50
FLOW_LOSS(KAF)|PER-AVER|KAF|22
FLOW_UBT(KAF)|PER-AVER|KAF|3
FLOW_UBT(KAF)-TARG|PER-AVER|KAF|134
FLOW_UNIMP(KAF)|PER-AVER|KAF|46
STOR|INST-VAL|KAF|85
STOR_LBT(KAF)|PER-AVER|KAF|2
STOR_UBT(KAF)|PER-AVER|KAF|8
*/
