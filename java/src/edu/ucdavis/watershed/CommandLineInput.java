package edu.ucdavis.watershed;

import java.util.LinkedList;

public class CommandLineInput {

	public boolean export = false; // are we exporting;
	public String exportRoot = "";
	public String path = ""; // dss file path
	public LinkedList<Config> data = null;
	public String regex = "";

	public CommandLineInput() {}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public LinkedList<Config> getData() {
		return data;
	}

	public void setData(LinkedList<Config> data) {
		this.data = data;
	}
	
	public boolean isExport() {
		return export;
	}

	public void setExport(boolean export) {
		this.export = export;
	}

	public String getExportRoot() {
		return exportRoot;
	}

	public void setExportRoot(String exportRoot) {
		this.exportRoot = exportRoot;
	}
	
	public String getRegex() {
		return regex;
	}

	public void setRegex(String regex) {
		this.regex = regex;
	}

	
}
