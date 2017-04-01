package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.HashMap;

import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.bpm.process.ProcessDefinitionProfile;
import com.bokesoft.yigo.meta.bpm.total.MetaBPM;
import com.bokesoft.yigo.meta.bpm.total.MetaProcessDeployInfoCollection;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 获得流程的属性
 * 
 * @author minjian
 *
 */
public class GetWorkflowAttribute implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getWorkflowAttribute(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)),
				TypeConvertor.toInteger(paramArrayList.get(1)), TypeConvertor.toString(paramArrayList.get(2)));
	}

	/**
	 * 获得流程的属性
	 * 
	 * @param context
	 *            中间层对象
	 * @param profileKey
	 *            流程的Key
	 * @param version
	 *            流程的版本
	 * @param attributeName
	 *            属性名称
	 * @return 流程的属性
	 * @throws Throwable
	 */
	public static Object getWorkflowAttribute(DefaultContext context, String profileKey, Integer version,
			String attributeName) throws Throwable {
		if (StringUtil.isBlankOrNull(profileKey)) {
			return "";
		}
		String workflowKey = profileKey;
		ProcessDefinitionProfile profile = null;
		// 如果流程版本为0，直接使用流程的Key获得流程对象
		if (version <= 0) {
			profile = getProfile(context, profileKey);
			workflowKey = profile.getKey();
			version = profile.getVersion();
		} else {// 否则，根据流程的Key+流程的版本后缀获得流程对象
			profileKey = workflowKey + "_V" + version;
			profile = getProfile(context, profileKey);
		}
		Object attribute = "";
		//
		if (attributeName.equalsIgnoreCase("Caption")) {
			attribute = profile.getCaption();
		} else if (attributeName.equalsIgnoreCase("Key")) {
			attribute = profile.getKey();
		} else if (attributeName.equalsIgnoreCase("Version")) {
			attribute = profile.getVersion();
		} else if (attributeName.equalsIgnoreCase("State")) {
			MetaBPM metaBPM = context.getVE().getMetaFactory().getMetaBPM();
			MetaProcessDeployInfoCollection deployInfoCol = metaBPM.getMetaBPMDeployInfoCollection();
			// 流程状态有两个，0表示新建，1表示已部署
			if (deployInfoCol.containsKey(workflowKey)) {
				attribute = 1;
			} else {
				attribute = 0;
			}
		}
		return attribute;
	}

	/**
	 * 根据流程Key获得流程配置对象
	 * 
	 * @param context
	 *            中间层对象
	 * @param workflowKey
	 *            流程的Key
	 * @return 流程信息对象
	 * @throws Throwable
	 */
	public static ProcessDefinitionProfile getProfile(DefaultContext context, String workflowKey) throws Throwable {
		// 取流程配置对象
		MetaBPM metaBPM = context.getVE().getMetaFactory().getMetaBPM();
		// 获得所有流程的集合
		HashMap<String, ProcessDefinitionProfile> profileMap = metaBPM.getProfileMap();
		return profileMap.get(workflowKey);
	}
}
