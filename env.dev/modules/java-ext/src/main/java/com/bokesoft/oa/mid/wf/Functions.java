package com.bokesoft.oa.mid.wf;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.dataobject.MetaDataObject;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.document.SaveData;
import com.bokesoft.yigo.mid.parser.BaseMidFunctionImpl;
import com.bokesoft.yigo.parser.BaseFunImplCluster;
import com.bokesoft.yigo.parser.IExecutor;
import com.bokesoft.yigo.struct.datatable.DataTable;
import com.bokesoft.yigo.struct.document.Document;
import com.bokesoft.yigo.tools.document.DocumentUtil;


public class Functions extends BaseFunImplCluster {

	   public Functions(){
			super();
		}
	   public Object[][] getImplTable() {
			  return new Object[][]  
				  {
				  {"CirculationDialog", new CirculationDialogImpl()}
				  };
		}
	   private class CirculationDialogImpl extends BaseMidFunctionImpl{

		@Override
		public Object evalImpl(String arg0, DefaultContext context, Object[] arg2, IExecutor arg3) throws Throwable {
			Document doc = context.getDocument();
			DataTable dataTable = doc.get("OA_CirculationDialog");
			String sql ="select * from OA_CirculationDialog where OID=?";
			DataTable daTable2 = context.getDBManager().execPrepareQuery(sql, dataTable.getLong("OID"));
			MetaDataObject metaDataObject = context.getVE().getMetaFactory().getDataObject("OA_Read");
			Document d=null;
			String 	ReadUsers = null;
			String[] readers = null;
			daTable2.beforeFirst();
			while(daTable2.next()){
				 ReadUsers = daTable2.getString("OptIDs");
				 readers = ReadUsers.split(",");
			for(String reader:readers){
				Long ReadUser = TypeConvertor.toLong(reader); 
				d = DocumentUtil.newDocument(metaDataObject);
				d.setNew();
				DataTable targetTable = d.get("OA_Read");
				targetTable.append();
				targetTable.setObject("ReadUser", ReadUser);
				targetTable.setObject("Status", daTable2.getInt("Status"));
				targetTable.setObject("SendUser", daTable2.getLong("SendUser"));
				targetTable.setObject("SendTime", daTable2.getDateTime("SendTime"));
				targetTable.setObject("Opinion", daTable2.getString("Opinion"));
				targetTable.setObject("BillKey", daTable2.getString("BillKey"));
				targetTable.setObject("BillOID", daTable2.getLong("BillOID"));
				SaveData saveData = new SaveData(metaDataObject, null, d);
				saveData.save(context);
			}
			}
			return null;
		}
		   
	   }
}
