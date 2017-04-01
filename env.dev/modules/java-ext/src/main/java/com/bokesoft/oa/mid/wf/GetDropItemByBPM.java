package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;

import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.bpm.process.ProcessDefinitionProfile;
import com.bokesoft.yigo.meta.bpm.total.MetaBPM;
import com.bokesoft.yigo.meta.bpm.total.MetaProcessDeployInfo;
import com.bokesoft.yigo.meta.bpm.total.MetaProcessDeployInfoCollection;
import com.bokesoft.yigo.meta.bpm.total.MetaProcessMap;
import com.bokesoft.yigo.meta.bpm.total.MetaProcessMapCollection;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 获得所有流程的下拉字符串
 * 
 * @author minjian
 *
 */
public class GetDropItemByBPM implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		String type = "";
		if (paramArrayList != null && paramArrayList.size() > 0) {
			type = TypeConvertor.toString(paramArrayList.get(0));
		}
		Boolean suffixVersion = false;
		if (paramArrayList != null && paramArrayList.size() > 1) {
			suffixVersion = TypeConvertor.toBoolean(paramArrayList.get(1));
		}
		return getDropItemByBPM(paramDefaultContext, type, suffixVersion);
	}

	/**
	 * 获得流程的下拉字符串，由"流程名称,流程Key"组成
	 * 
	 * @param context
	 *            中间层对象
	 * @param type
	 *            "Process"表示已关联流程,"Deploy"表示已部署流程，默认表示全部
	 * @param suffixVersion
	 *            后缀添加流程版本，默认为不加
	 * @return 流程的下拉字符串
	 * @throws Throwable
	 */
	public String getDropItemByBPM(DefaultContext context, String type, Boolean suffixVersion) throws Throwable {
		String dropItem = "";
		if (type.equalsIgnoreCase("Process")) {
			dropItem = getDropItemByProcess(context, suffixVersion);
		} else if (StringUtil.isBlankOrStrNull("Deploy")) {
			dropItem = getDropItemByDeploy(context, suffixVersion);
		} else {
			dropItem = getDropItemByBPM(context, suffixVersion);
		}
		return dropItem;
	}

	/**
	 * 获得所有流程的下拉字符串，包括已部署的流程，未部署的流程，由"流程名称,流程Key"组成
	 * 
	 * @param context
	 *            中间层对象
	 * @return 所有流程的下拉字符串
	 * @throws Throwable
	 */
	public String getDropItemByBPM(DefaultContext context, Boolean suffixVersion) throws Throwable {
		String dropItem = "";
		MetaBPM metaBPM = context.getVE().getMetaFactory().getMetaBPM();
		HashMap<String, ProcessDefinitionProfile> profileMap = metaBPM.getProfileMap();
		for (Iterator<Entry<String, ProcessDefinitionProfile>> iterator = profileMap.entrySet().iterator(); iterator
				.hasNext();) {
			Entry<String, ProcessDefinitionProfile> e = iterator.next();
			ProcessDefinitionProfile p = e.getValue();
			dropItem = getDropItem(dropItem, p, suffixVersion);
		}
		dropItem = dropItem.substring(1);
		return dropItem;
	}

	/**
	 * 获得已部署流程的下拉字符串，由"流程名称,流程Key"组成
	 * 
	 * @param context
	 *            中间层对象
	 * @return 已部署流程的下拉字符串
	 * @throws Throwable
	 */
	public String getDropItemByDeploy(DefaultContext context, Boolean suffixVersion) throws Throwable {
		String dropItem = "";
		MetaBPM metaBPM = context.getVE().getMetaFactory().getMetaBPM();
		HashMap<String, ProcessDefinitionProfile> profileMap = metaBPM.getProfileMap();
		MetaProcessDeployInfoCollection deployInfoCol = metaBPM.getMetaBPMDeployInfoCollection();
		for (Iterator<MetaProcessDeployInfo> iterator = deployInfoCol.iterator(); iterator.hasNext();) {
			MetaProcessDeployInfo e = iterator.next();
			String key = e.getKey();
			ProcessDefinitionProfile p = profileMap.get(key);
			if (p == null) {
				throw new Error("流程=" + key + "，为空");
			}
			dropItem = getDropItem(dropItem, p, suffixVersion);
		}
		dropItem = dropItem.substring(1);
		return dropItem;
	}

	/**
	 * 获得已关联流程的下拉字符串，由"流程名称,流程Key"组成
	 * 
	 * @param context
	 *            中间层对象
	 * @return 已关联流程的下拉字符串
	 * @throws Throwable
	 */
	public String getDropItemByProcess(DefaultContext context, Boolean suffixVersion) throws Throwable {
		String dropItem = "";
		MetaBPM metaBPM = context.getVE().getMetaFactory().getMetaBPM();
		HashMap<String, ProcessDefinitionProfile> profileMap = metaBPM.getProfileMap();
		MetaProcessMapCollection deployInfoCol = metaBPM.getMetaProcessMapCollection();
		for (Iterator<MetaProcessMap> iterator = deployInfoCol.iterator(); iterator.hasNext();) {
			MetaProcessMap e = iterator.next();
			String key = e.getKey();
			ProcessDefinitionProfile p = profileMap.get(key);
			if (p == null) {
				throw new Error("流程=" + key + "，为空");
			}
			dropItem = getDropItem(dropItem, p, suffixVersion);
		}
		dropItem = dropItem.substring(1);
		return dropItem;
	}

	/**
	 * 获得流程的下拉项字符串
	 * 
	 * @param dropItem下拉项字符串
	 * @param p
	 *            流程对象
	 * @return 下拉项字符串
	 */
	private String getDropItem(String dropItem, ProcessDefinitionProfile p, Boolean suffixVersion) {
		if (suffixVersion) {
			dropItem = dropItem + ";" + p.getKey() + "_V" + p.getVersion() + "," + p.getCaption() + "_版本("
					+ p.getVersion() + ")";
		} else {
			dropItem = dropItem + ";" + p.getKey() + "," + p.getCaption();
		}
		return dropItem;
	}
}
