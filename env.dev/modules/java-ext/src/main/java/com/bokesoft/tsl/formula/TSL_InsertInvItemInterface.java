package com.bokesoft.tsl.formula;

import java.util.HashMap;
import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_InsertInvItemInterface extends BaseMidFunctionImpl {

	private static String ACTION = "ERP_Insert_InvItemInterface_To_BPM";

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
		String process_type = "CREATE";
		String process_status = "PENDING";
		String process_message = "";
		String row_version_number = "1";
		String created_by = "-1";
		String last_updated_by = "-1";
		String item_segment1 = "";
		String inventory_item_id = "";
		String description = "";
		String primary_uom_code = "";
		String category_id1 = "";
		String category_id2 = "";
		String planning_make_buy_code = "";
		String cost_of_sales_account = "";
		String buyer_name = "";
		String receipt_required_flag = "";
		String inspection_required_flag = "";
		String receiving_routing_id = "";
		String inventory_planning_code = "";
		String mrp_planning_code = "";
		String postprocessing_lead_time = "";
		String fixed_lead_time = "";
		String wip_supply_type = "";
		String shrinkage_rate = "";
		String full_lead_time = "";
		String template_id = "";
		String attribute17 = "";
		String attribute18 = "";
		String attribute19 = "";
		String attribute4 = "";
		// TaskID
		String source_id = headTable.getObject("InstanceID").toString();
		int rowCount = detailTable.size();
		for (int index = 0; index < rowCount; index++) {
			item_segment1 = TypeConvertor.toString(detailTable.getString(index, "ITEM_CODE"));
			inventory_item_id = TypeConvertor.toString(detailTable.getString(index, "MaterialNoId"));
			description = TypeConvertor.toString(detailTable.getString(index, "DESCRIPTION"));
			primary_uom_code = TypeConvertor.toString(detailTable.getString(index, "PRIMARY_UOM_CODE"));
			category_id1 = TypeConvertor.toString(detailTable.getString(index, "CATEGORY_ID1_ID"));
			category_id2 = TypeConvertor.toString(detailTable.getString(index, "CATEGORY_ID2_ID"));
			planning_make_buy_code = TypeConvertor.toString(detailTable.getString(index, "PLANNING_MAKE_BUY_CODE"));
			if (planning_make_buy_code.equalsIgnoreCase("制造")) {
				planning_make_buy_code = "1";
			} else if (planning_make_buy_code.equalsIgnoreCase("采购")) {
				planning_make_buy_code = "2";
			}
			cost_of_sales_account = TypeConvertor.toString(detailTable.getString(index, "COST_OF_SALES_ACCOUNT"));
			buyer_name = TypeConvertor.toString(detailTable.getString(index, "BUYER_ID"));
			receipt_required_flag = TypeConvertor.toString(detailTable.getString(index, "RECEIPT_REQUIRED_FLAG"));
			inspection_required_flag = TypeConvertor.toString(detailTable.getString(index, "INSPECTION_REQUIRED_FLAG"));
			receiving_routing_id = TypeConvertor.toString(detailTable.getString(index, "RECEIVING_ROUTING_ID"));
			inventory_planning_code = TypeConvertor.toString(detailTable.getString(index, "INVENTORY_PLANNING_CODE"));
			mrp_planning_code = TypeConvertor.toString(detailTable.getString(index, "MRP_PLANNING_CODE"));
			postprocessing_lead_time = TypeConvertor.toString(detailTable.getString(index, "POSTPROCESSING_LEAD_TIME"));
			fixed_lead_time = TypeConvertor.toString(detailTable.getString(index, "FIXED_LEAD_TIME"));
			wip_supply_type = TypeConvertor.toString(detailTable.getString(index, "WIP_SUPPLY_TYPE"));
			shrinkage_rate = TypeConvertor.toString(detailTable.getString(index, "SHRINKAGE_RATE"));
			full_lead_time = TypeConvertor.toString(detailTable.getString(index, "FULL_LEAD_TIME"));
			template_id = TypeConvertor.toString(detailTable.getString(index, "TEMPLATE_ID"));
			attribute17 = TypeConvertor.toString(detailTable.getString(index, "ATTRIBUTE1"));
			attribute18 = TypeConvertor.toString(detailTable.getString(index, "ATTRIBUTE2"));
			attribute19 = TypeConvertor.toString(detailTable.getString(index, "ATTRIBUTE3"));
			attribute4 = TypeConvertor.toString(detailTable.getString(index, "ATTRIBUTE4"));
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

			paramenter.put("item_segment1", item_segment1);
			paramenter.put("inventory_item_id", inventory_item_id);
			paramenter.put("description", description);
			paramenter.put("primary_uom_code", primary_uom_code);
			paramenter.put("category_id1", category_id1);
			paramenter.put("category_id2", category_id2);
			paramenter.put("planning_make_buy_code", planning_make_buy_code);
			paramenter.put("cost_of_sales_account", cost_of_sales_account);
			paramenter.put("buyer_name", buyer_name);
			paramenter.put("receipt_required_flag", receipt_required_flag);
			paramenter.put("inspection_required_flag", inspection_required_flag);
			paramenter.put("receiving_routing_id", receiving_routing_id);
			paramenter.put("inventory_planning_code", inventory_planning_code);
			paramenter.put("mrp_planning_code", mrp_planning_code);
			paramenter.put("postprocessing_lead_time", postprocessing_lead_time);
			paramenter.put("fixed_lead_time", fixed_lead_time);
			paramenter.put("wip_supply_type", wip_supply_type);
			paramenter.put("shrinkage_rate", shrinkage_rate);
			paramenter.put("full_lead_time", full_lead_time);
			paramenter.put("template_id", template_id);
			paramenter.put("source_code", source_code);
			paramenter.put("source_id", source_id);
			paramenter.put("source_line_id", source_line_id + "");
			paramenter.put("process_type", process_type);
			paramenter.put("process_status", process_status);
			paramenter.put("process_message", process_message);
			paramenter.put("row_version_number", row_version_number);
			paramenter.put("created_by", created_by);
			paramenter.put("last_updated_by", last_updated_by);
			paramenter.put("attribute17", attribute17);
			paramenter.put("attribute18", attribute18);
			paramenter.put("attribute19", attribute19);
			paramenter.put("attribute4", attribute4);
			// 执行BokeDee接口
			factory.executeAction(ACTION);
		}
		return true;
	}
}
