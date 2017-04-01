package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;

import com.bokesoft.yigo.meta.bpm.process.ProcessDefinitionProfile;
import com.bokesoft.yigo.meta.bpm.total.MetaBPM;
import com.bokesoft.yigo.meta.bpm.total.MetaProcessDeployInfoCollection;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

/**
 * 根据流程填充流程的列表
 * 
 * @author minjian
 *
 */
public class FillListByBPM implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return fillListByBPM(paramDefaultContext);
	}

	/**
	 * 根据流程填充流程的列表
	 * 
	 * @return 填充成功返回true
	 * @throws Throwable
	 */
	public Document fillListByBPM(DefaultContext context) throws Throwable {
		Document doc = context.getDocument();
		DataTable dt = doc.get(0);
		dt.clear();
		//取流程配置对象
		MetaBPM metaBPM = context.getVE().getMetaFactory().getMetaBPM();
		//获得已部署流程集合
		MetaProcessDeployInfoCollection deployInfoCol = metaBPM.getMetaBPMDeployInfoCollection();
		//获得所有流程的集合
		HashMap<String, ProcessDefinitionProfile> profileMap = metaBPM.getProfileMap();
		for (Iterator<Entry<String, ProcessDefinitionProfile>> iterator = profileMap.entrySet().iterator(); iterator
				.hasNext();) {
			Entry<String, ProcessDefinitionProfile> e = iterator.next();
			ProcessDefinitionProfile p = e.getValue();
			String key = p.getKey();
			dt.append();
			dt.setString("WorkflowName", p.getCaption());
			dt.setString("WorkflowKey", key);
			dt.setInt("WorkflowVersion", p.getVersion());
			// 流程状态有两个，0表示新建，1表示已部署
			if (deployInfoCol.containsKey(key)) {
				dt.setInt("WorkFlowState", 1);
			} else {
				dt.setInt("WorkFlowState", 0);
			}
		}
		return doc;
	}
}
