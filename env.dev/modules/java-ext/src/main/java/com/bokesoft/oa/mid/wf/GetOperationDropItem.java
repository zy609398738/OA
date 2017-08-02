package com.bokesoft.oa.mid.wf;

import java.util.ArrayList;
import java.util.Iterator;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.meta.base.KeyPairCompositeObject;
import com.bokesoft.yigo.meta.commondef.MetaOperation;
import com.bokesoft.yigo.meta.commondef.MetaOperationCollection;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 获得操作的下拉字符串
 * 
 * @author zkh
 *
 */
public class GetOperationDropItem implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getOperationDropItem(paramDefaultContext,TypeConvertor.toString(paramArrayList.get(0)));
	}

	/**
	 * 获得操作的下拉字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param formKey
	 *            单据的Key
	 * @return 操作的下拉字符串
	 * @throws Throwable
	 */
	public String getOperationDropItem(DefaultContext context, String formKey) throws Throwable {
		MetaOperationCollection moc=context.getVE().getMetaFactory().getMetaForm(formKey).getOperationCollection();
		String dropItem="";
		Iterator<KeyPairCompositeObject> i=moc.iterator();
		while(i.hasNext()){
			MetaOperation mo = (MetaOperation) i.next();
			dropItem=dropItem+";"+mo.getKey()+","+mo.getCaption();
		}
		if(dropItem.length()>0){
			dropItem=dropItem.substring(1);
		}
		return dropItem;
	}
}
