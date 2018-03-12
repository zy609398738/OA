package com.bokesoft.tsl.service;

import java.util.Map;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.LoadData;
import com.bokesoft.yigo.mid.service.IExtService2;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;

public class TSL_CheckSubPIContract implements IExtService2 {
	private static String[] headFields = { "OU_NAME", "TradeTerms", "Currency", "CustomerName", "Region", "SubRegion",
			"GoodsArrivalRegion", "ArrivalSubRegion", "PaymentTerms", "DeliveryDate", "Prepayment", "ContractYear",
			"Quarter", "SelectIsPerc", "RelatedParty", "IsReplaced", "RateCode", "RateRMB", "CustomerID", "RateUSD",
			"IsRegion", "OD" };

	@Override
	public Object doCmd(DefaultContext context, Map<String, Object> args) throws Throwable {
		String srcFormKey = TypeConvertor.toString(args.get("srcFormKey"));
		String trgFormKey = TypeConvertor.toString(args.get("trgFormKey"));
		long oid = TypeConvertor.toLong(args.get("oid"));

		IFormInfo srcFormInfo = FormInfoFactory.getFormInfo(srcFormKey);
		IFormInfo trgFormInfo = FormInfoFactory.getFormInfo(trgFormKey);

		LoadData ld = new LoadData(srcFormKey, oid);
		Document srcDocument = ld.load(new DefaultContext(context), null);

		DataTable srcDataTableHead = srcDocument.get(srcFormInfo.getHeadTableKey());

		Document document = context.getDocument();
		DataTable dataTableHead = document.get(trgFormInfo.getHeadTableKey());

		// 主表
		for (String fieldKey : headFields) {
			dataTableHead.setObject(fieldKey, srcDataTableHead.getObject(fieldKey));
		}

		dataTableHead.setObject("PreTotalAmount", srcDataTableHead.getObject("TotalAmount"));
		dataTableHead.setObject("PreTotalAmountRMB", srcDataTableHead.getObject("TotalAmountRMB"));
		dataTableHead.setObject("PreHowMuchImpact", srcDataTableHead.getObject("HowMuchImpact"));
		dataTableHead.setObject("PreHowMuchImpactUSD", srcDataTableHead.getObject("HowMuchImpactUSD"));
		dataTableHead.setObject("PreTotalAmountUSD", srcDataTableHead.getObject("TotalAmountUSD"));
		String creditTerms = srcDataTableHead.getString("CreditTerms");
		if (srcFormInfo.isChinaContract()) {
			String withinCreditTerm = srcDataTableHead.getString("WithinCreditTerm");
			String outofCreditTerm = srcDataTableHead.getString("OutofCreditTerm");
			if (withinCreditTerm != null && !withinCreditTerm.isEmpty()) {
				creditTerms = creditTerms + "-" + withinCreditTerm;
			} else if (outofCreditTerm != null && !outofCreditTerm.isEmpty()) {
				creditTerms = creditTerms + "-" + outofCreditTerm;
			}
		}

		if (srcFormInfo.isNonChinaContract()) {
			String OutofCredit = srcDataTableHead.getString("OutofCredit");
			if (OutofCredit != null && !OutofCredit.isEmpty()) {
				creditTerms = creditTerms + "-" + OutofCredit;
			}
		}

		dataTableHead.setObject("PreCreditTerms", creditTerms);
		dataTableHead.setObject("FromInstanceid", srcDataTableHead.getObject("InstanceID"));

		dataTableHead.setObject("OrginalContractBarcode", srcDataTableHead.getString("ContractBarcode"));
		dataTableHead.setObject("PreContractBarcodeID", srcDataTableHead.getString("ContractBarcodeID"));

		return document;
	}
}
