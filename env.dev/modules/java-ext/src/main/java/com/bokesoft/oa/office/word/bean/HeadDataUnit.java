package com.bokesoft.oa.office.word.bean;

import java.util.List;

public class HeadDataUnit extends ColumnDataUnit{
	private List<OptionDataUnit> optionList;

	public List<OptionDataUnit> getOptionList() {
		return optionList;
	}

	public void setOptionList(List<OptionDataUnit> optionList) {
		this.optionList = optionList;
	}
}
