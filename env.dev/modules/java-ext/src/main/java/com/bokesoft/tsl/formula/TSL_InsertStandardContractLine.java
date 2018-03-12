package com.bokesoft.tsl.formula;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;

import com.bokesoft.tsl.common.TSL_BokeDeeFactory;
import com.bokesoft.yes.common.struct.MultiKey;
import com.bokesoft.yes.common.struct.MultiKeyNode;
import com.bokesoft.yes.tools.dic.DictCacheUtil;
import com.bokesoft.yigo.common.def.DataType;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_InsertStandardContractLine extends BaseMidFunctionImpl {

	private static String ACTION = "BPM_INSERT_StandardContractINF_TO_ERP";

	@Override
	public Object evalImpl(String name, DefaultContext context, Object[] args, IExecutor arg3) throws Throwable {
		Document document = context.getDocument();
		DataTable headTable = document.get("B_STDContrTMPL");
		DataTable detailTable = document.get("B_STDContrTMPLDDTL");
		String billkey = TypeConvertor.toString(args[0]);
		String flow = TypeConvertor.toString(args[1]);
		String node = TypeConvertor.toString(args[2]);
		String oid = TypeConvertor.toString(args[3]);
		HashMap<MultiKey, ArrayList<Integer>> map = new HashMap<MultiKey, ArrayList<Integer>>();
		int rowCount2 = detailTable.size();
		for (int rowIndex = 0; rowIndex < rowCount2; rowIndex++) {
			MultiKey key = new MultiKey();
			key.addValue(new MultiKeyNode(DataType.LONG, detailTable.getLong("OID")));
			key.addValue(new MultiKeyNode(DataType.STRING, detailTable.getString("itemcode")));
			ArrayList<Integer> list = map.get(key);
			if (list == null) {
				list = new ArrayList<Integer>();
				map.put(key, list);
			}

			list.add(rowIndex);
		}
		Iterator<ArrayList<Integer>> it = map.values().iterator();

		while (it.hasNext()) {
			// 明细ID
			String interface_id = "";
			// 合同任务ID
			String task_id = TypeConvertor.toString(headTable.getObject("InstanceID"));
			// 合同号
			String contract_number = TypeConvertor.toString(headTable.getObject("ContractBarcode"));
			// 制单人
			String employee_id = TypeConvertor.toString(headTable.getObject("CreatorCode"));
			// 供应商1
			String vendor_id = TypeConvertor.toString(headTable.getObject("SupperierNumber"));
			// 供应商2
			String vendorid = TypeConvertor.toString(headTable.getObject("NSupplierID"));
			// 付款方式ID1
			String terms_id = TypeConvertor.toString(headTable.getObject("Payment_TermID"));
			// 付款方式ID2
			String termsid = TypeConvertor.toString(headTable.getObject("NPaymentID"));
			// 贸易条款
			String fob = TypeConvertor.toString(headTable.getObject("FOBName"));
			// 创建日期
			Date contract_creationdate = TypeConvertor.toDate(headTable.getObject("BillDate"));
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			String contract_creation_date = sdf.format(contract_creationdate);
			// 是否含税
			String vat = "";
			// 料号ID
			String inventory_item_id = "";
			// 料号
			String item_number = "";
			// 币种
			String currency_code = "";
			// 单价
			BigDecimal unitprice = BigDecimal.ZERO;
			BigDecimal unit_price = BigDecimal.ZERO;
			BigDecimal unit_price_vat = BigDecimal.ZERO;
			// IOid
			String organization_id = "";
			// 总价
			String total_amount = "";
			// 数量
			String quantity = "";
			// 运费
			BigDecimal freight = BigDecimal.ZERO;
			// 税率
			BigDecimal tax = BigDecimal.ZERO;
			BigDecimal tax_code = BigDecimal.ZERO;
			BigDecimal bignum1 = new BigDecimal("1");
			BigDecimal bignum2 = new BigDecimal("100");
			// 到货地点id
			String ship_to_location_id = "";
			ArrayList<Integer> list = it.next();
			for (int rowIndex : list) {
				interface_id = TypeConvertor.toString(detailTable.getObject(rowIndex, "OID"));
				inventory_item_id = TypeConvertor.toString(detailTable.getObject(rowIndex, "itemcodeID"));
				item_number = TypeConvertor.toString(detailTable.getObject(rowIndex, "itemcode"));
				currency_code = DictCacheUtil.getDictValue(context.getVE(), "Dict_Currency",
						TypeConvertor.toLong(detailTable.getObject(rowIndex, "Currency")), "Code").toString();
				organization_id = TypeConvertor.toString(detailTable.getObject(rowIndex, "IOIDline"));
				total_amount = TypeConvertor.toString(detailTable.getObject(rowIndex, "Total_Amount"));
				quantity = TypeConvertor.toString(detailTable.getObject(rowIndex, "Qty"));
				ship_to_location_id = TypeConvertor.toString(detailTable.getObject(rowIndex, "didianID"));
				unitprice = TypeConvertor.toBigDecimal(detailTable.getObject(rowIndex, "Unit_Price"));
				vat = TypeConvertor.toString(detailTable.getObject(rowIndex, "InCluding_Tax"));
				tax = TypeConvertor.toBigDecimal(detailTable.getObject(rowIndex, "Tax"));
				if (tax.equals(BigDecimal.ZERO)) {
					tax = new BigDecimal("1.17");
					tax_code = new BigDecimal("0");
				} else {
					tax_code = tax.divide(bignum2);
					tax = bignum1.add(tax_code);
				}
				freight = TypeConvertor.toBigDecimal(detailTable.getObject("yunfei"));
				if (vat.equalsIgnoreCase("N") || !unitprice.equals(BigDecimal.ZERO)) {
					if (!freight.equals(BigDecimal.ZERO)) {
						unit_price = unitprice.add(freight);
						unit_price_vat = unit_price.multiply(tax);
					} else {
						unit_price = unitprice;
						unit_price_vat = tax.multiply(unitprice);
					}
				} else if (vat.equalsIgnoreCase("Y") || !unitprice.equals(BigDecimal.ZERO)) {
					if (!freight.equals(BigDecimal.ZERO)) {
						unit_price_vat = unitprice.add(freight);
						unit_price = unit_price_vat.divide(tax);
					} else {
						unit_price = unitprice.divide(tax);
						unit_price_vat = unitprice;
					}
				}
			}
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
			paramenter.put("interface_id", interface_id);
			paramenter.put("task_id", task_id);
			paramenter.put("contract_number", contract_number);
			paramenter.put("employee_id", employee_id);
			if (!vendor_id.isEmpty() && !vendor_id.equalsIgnoreCase("null")) {
				paramenter.put("vendor_id", vendor_id);
			} else {
				paramenter.put("vendor_id", vendorid);
			}
			paramenter.put("vat", vat);
			if (!terms_id.isEmpty() && !terms_id.equalsIgnoreCase("null")) {
				paramenter.put("terms_id", terms_id);
			} else {
				paramenter.put("terms_id", termsid);
			}
			paramenter.put("inventory_item_id", inventory_item_id);
			paramenter.put("item_number", item_number);
			paramenter.put("currency_code", currency_code);
			paramenter.put("unit_price", unit_price.toPlainString());
			paramenter.put("unit_price_vat", unit_price_vat.toPlainString());
			paramenter.put("organization_id", organization_id);
			paramenter.put("contract_creation_date", contract_creation_date);
			paramenter.put("total_amount", total_amount);
			paramenter.put("quantity", quantity);
			paramenter.put("freight", freight.toPlainString());
			paramenter.put("tax_code", tax_code.toPlainString());
			paramenter.put("ship_to_location_id", ship_to_location_id);
			paramenter.put("fob", fob);
			// 执行BokeDee接口
			factory.executeAction(ACTION);
		}
		return true;
	}

}
