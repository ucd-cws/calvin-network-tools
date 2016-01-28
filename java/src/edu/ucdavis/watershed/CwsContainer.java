package edu.ucdavis.watershed;

import java.util.LinkedList;

import hec.io.PairedDataContainer;
import hec.io.TimeSeriesContainer;

public class CwsContainer {
	
	public TimeSeriesContainer timeSeriesContainer = null;
	public PairedDataContainer pairedDataContainer = null;
	public LinkedList<String> dates = new LinkedList<String>();
	
}
