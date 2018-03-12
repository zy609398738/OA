package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import com.bokesoft.oa.base.OAContext;
import com.bokesoft.oa.mid.wf.base.RightSel;
import com.bokesoft.oa.mid.wf.base.RightSelField;
import com.bokesoft.oa.mid.wf.base.RightSelFieldMap;
import com.bokesoft.oa.mid.wf.base.RightSelOperation;
import com.bokesoft.oa.mid.wf.base.RightSelOperationMap;
import com.bokesoft.oa.mid.wf.base.WorkflowTypeDtl;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.bpm.process.perm.MetaEnablePerm;
import com.bokesoft.yigo.meta.bpm.process.perm.MetaEnablePermItem;
import com.bokesoft.yigo.meta.bpm.process.perm.MetaOptPerm;
import com.bokesoft.yigo.meta.bpm.process.perm.MetaOptPermItem;
import com.bokesoft.yigo.meta.bpm.process.perm.MetaPerm;
import com.bokesoft.yigo.meta.bpm.process.perm.MetaVisiblePerm;
import com.bokesoft.yigo.meta.bpm.process.perm.MetaVisiblePermItem;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

public class GetSponsorRight implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getSponsorRight(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)));
	}

	public static MetaPerm getSponsorRight(DefaultContext context, String formKey) throws Throwable {
		OAContext oaContext = new OAContext(context);
		// 如果未指定配置的Key,直接返回
		if (formKey == null) {
			return null;
		}
		WorkflowTypeDtl workflowTypeDtl = oaContext.getWorkflowTypeDtlMap().getWorkflowTypeDtl(formKey, "");
		if (workflowTypeDtl == null) {
			return null;
		}
		MetaPerm metaPerm = new MetaPerm();
		MetaOptPerm optPerm = new MetaOptPerm();
		metaPerm.setOptPerm(optPerm);
		MetaVisiblePerm visiblePerm = new MetaVisiblePerm();
		metaPerm.setVisiblePerm(visiblePerm);
		MetaEnablePerm enablePerm = new MetaEnablePerm();
		metaPerm.setEnablePerm(enablePerm);
		Set<String> optSet = new HashSet<String>();
		Set<String> visibleSet = new HashSet<String>();
		Set<String> enableSet = new HashSet<String>();
		RightSel sponsorRightSel = workflowTypeDtl.getSponsorRightSel();
		if(sponsorRightSel==null){
			return metaPerm;
		}
		RightSelOperationMap rightSelOperationMap = sponsorRightSel.getRightSelOperationMap();
		for (RightSelOperation rightSelOperation : rightSelOperationMap.values()) {
			if (rightSelOperation.getOperationEnable() != 1) {
				continue;
			}
			String key = rightSelOperation.getOperationKey();
			if (optSet.contains(key)) {
				continue;
			} else {
				optSet.add(key);
			}
			MetaOptPermItem metaOptPermItem = new MetaOptPermItem();
			metaOptPermItem.setKey(key);
			optPerm.add(metaOptPermItem);
		}
		RightSelFieldMap rightSelFieldMap = sponsorRightSel.getRightSelFieldMap();
		for (RightSelField rightSelField : rightSelFieldMap.values()) {
			if (rightSelField.getFieldVisible() != 1) {
				String key = rightSelField.getFieldKey();
				if (visibleSet.contains(key)) {
					continue;
				} else {
					visibleSet.add(key);
				}
				MetaVisiblePermItem metaVisiblePermItem = new MetaVisiblePermItem();
				metaVisiblePermItem.setKey(key);
				visiblePerm.add(metaVisiblePermItem);
			}
			if (rightSelField.getFieldEnable() == 1) {
				String key = rightSelField.getFieldKey();
				if (enableSet.contains(key)) {
					continue;
				} else {
					enableSet.add(key);
				}
				MetaEnablePermItem metaEnablePermItem = new MetaEnablePermItem();
				metaEnablePermItem.setKey(key);
				enablePerm.add(metaEnablePermItem);
			}
		}
		return metaPerm;
	}
}