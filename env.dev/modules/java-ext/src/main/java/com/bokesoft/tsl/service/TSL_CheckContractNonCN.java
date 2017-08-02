package com.bokesoft.tsl.service;

import java.util.Map;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.LoadData;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_CheckContractNonCN implements IExtService2 {
	private static String[] headFields = { "OU_NAME", "TradeTerms", "Currency",
			"CustomerName", "Region", "SubRegion", "GoodsArrivalRegion",
			"ArrivalSubRegion", "PaymentTerms", "DeliveryDate",
			"StandardOrNot", "Prepayment", "ContractYear", "Quarter",
			"TotalCM_RMB", "SelectIsPerc", "TotalAmount", "TotalAmountRMB",
			"HowMuchImpact", "HowMuchImpactUSD", "RelatedParty", "CreditTerms",
			"OutOfCredit","IsReplaced", "TotalCM",
			"RateCode", "RateRMB", "TotalAmountUSD", "CustomerID", "Cur_CODE",
			"RateUSD", "IsRegion","ContractBarcodeID" };
	private static String[] dtlFields = { "Model", "ModelDesc", "Remark",
			"PINo", "Power", "ASP", "ASPUSD", "ASPRMB", "IsPerc", "COGS",
			"NakedPrice", "Amount", "AmountUSD", "AmountRMB",
			"ProductCategory", "LineID", "FactoryStorage", "LogisticsInland",
			"LogisticsSea", "StorageRegion", "LogisticsRegion", "CM" };
	private static String[] spFields = { "Description", "Amount", "AmountUSD",
			"AmountRMB" };
	private static String[] otsFields = { "Description", "Amount",
			"AmountUSD", "AmountRMB" };


	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args)
			throws Throwable {
		String formKey = TypeConvertor.toString(args.get("formKey"));
		long oid = TypeConvertor.toLong(args.get("oid"));

		String headTableKey = null;
		String dtlTableKey = null;
		String spTableKey = null;
		String otsTableKey = null;


		if (formKey.equalsIgnoreCase("B_SalContrNonCN")) {
			headTableKey = "B_SalContrNonCN";
			dtlTableKey = "B_SalContrNonCNDtl";
			spTableKey = "B_SalContrNonCNSP";
			otsTableKey = "B_SalContrNonCNOts";


		} else {
			headTableKey = "B_FrmContrNonCN";
			dtlTableKey = "B_FrmContrNonCNDtl";
			spTableKey = "B_FrmContrNonCNSP";
			otsTableKey = "B_FrmContrNonCNOts";

		}

		LoadData ld = new LoadData(formKey, oid);
		Document srcDocument = ld.load(new DefaultContext(context), null);

		DataTable srcDataTableHead = srcDocument.get(headTableKey);
		DataTable srcDataTableDtl = srcDocument.get(dtlTableKey);
		DataTable srcDataTableSP = srcDocument.get(spTableKey);
		DataTable srcDataTableOts = srcDocument.get(otsTableKey);


		Document document = context.getDocument();
		DataTable dataTableHead = document.get("B_SalContrChgNonCN");
		DataTable dataTableDtl = document.get("B_SalContrChgNonCNDtl");
		DataTable dataTableSP = document.get("B_SalContrChgNonCNSP");
		DataTable dataTableOts = document.get("B_SalContrChgNonCNOts");
		

		// 主表
		for (String fieldKey : headFields) {
			dataTableHead.setObject(fieldKey,
					srcDataTableHead.getObject(fieldKey));
		}

		// 第一个明细表
		srcDataTableDtl.beforeFirst();
		dataTableDtl.deleteAll();
		while (srcDataTableDtl.next()) {
			dataTableDtl.append();

			for (String fieldKey : dtlFields) {
				System.out.println(fieldKey);
				dataTableDtl.setObject(fieldKey,
						srcDataTableDtl.getObject(fieldKey));
			}
		}

		// 第二个明细表
		srcDataTableSP.beforeFirst();
		dataTableSP.deleteAll();
		while (srcDataTableSP.next()) {
			dataTableSP.append();

			for (String fieldKey : spFields) {
				System.out.println(fieldKey);
				dataTableSP.setObject(fieldKey,
						srcDataTableSP.getObject(fieldKey));
			}
		}
		// 第三个明细表
		srcDataTableOts.beforeFirst();
		dataTableOts.deleteAll();
		while (srcDataTableOts.next()) {
			dataTableOts.append();

			for (String fieldKey : otsFields) {
				System.out.println(fieldKey);
				dataTableOts.setObject(fieldKey,
						srcDataTableOts.getObject(fieldKey));
			}
		}
		return document;
	}
}
