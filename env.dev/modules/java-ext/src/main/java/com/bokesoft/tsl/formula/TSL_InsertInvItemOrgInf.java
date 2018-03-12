package com.bokesoft.tsl.formula;

import java.util.HashMap;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yes.tools.dic.DictCacheUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_InsertInvItemOrgInf extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_Insert_InvItemOrg_To_BPM";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_MaterialDistribute");
		DataTable detailTable = document.get("B_MaterialDistributeDtl");

		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);

		// 默认值：EFLOW
		String source_code = "EFLOW";
		// 默认固定值“PENDING”
		String process_status = "PENDING";
		// 默认固定值“-1”
		String process_message = "-1";
		// 默认固定值“1”
		String row_version_number = "1";
		// 默认固定值“-1”
		String created_by = "-1";
		// 默认固定值“1291”
		String last_updated_by = "-1";
		// 默认固定值“1291”
		String last_update_login = "-1";
		// TaskID
		String source_id = headTable.getObject("InstanceID").toString();

		String[] organization_ids = null;
		int rowCount = detailTable.size();
		for (int index = 0; index < rowCount; index++) {
			organization_ids = TypeConvertor.toString(detailTable.getString(index, "OrganizationCode")).split(",");
			for (String organization_id : organization_ids) {
				if (!organization_id.isEmpty()) {
					String code = (String) DictCacheUtil.getDictValue(context.getVE(), "Dict_DistOrg", TypeConvertor.toLong(organization_id), "OU_ID");
					int source_line_id = index + 1;
					// 接口调用
					TSL_BokeDeeFactory factory = new TSL_BokeDeeFactory();
					if (!flow.isEmpty() && flow != null) {
						factory.addParameter("flow", flow);
					}
					if (!node.isEmpty() && node != null) {
						factory.addParameter("node", node);
					}
					if (!billkey.isEmpty() && billkey != null) {
						factory.addParameter("billkey", billkey);
					}
					if (!oid.isEmpty() && oid != null) {
						factory.addParameter("oid", oid);
					}
					HashMap<String, String> paramenter = factory.getParameter();
					paramenter.put("organization_id", code);
					paramenter.put("source_code", source_code);
					paramenter.put("source_id", source_id);
					paramenter.put("source_line_id", source_line_id + "");
					paramenter.put("process_status", process_status);
					paramenter.put("process_message", process_message);
					paramenter.put("row_version_number", row_version_number);
					paramenter.put("created_by", created_by);
					paramenter.put("last_updated_by", last_updated_by);
					paramenter.put("last_update_login", last_update_login);
					// 执行BokeDee接口
					factory.executeAction(ACTION);
				}
			}
		}

		return true;
	}
}