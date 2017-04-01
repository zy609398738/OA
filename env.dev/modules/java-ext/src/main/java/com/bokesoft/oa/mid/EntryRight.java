package com.bokesoft.oa.mid;

import java.util.ArrayList;

import com.bokesoft.yes.mid.base.MidVE;
import com.bokesoft.yes.struct.rights.EntryRights;
import com.bokesoft.yes.tools.rights.IRightsProvider;
import com.bokesoft.yes.tools.rights.IRightsProviderFactory;
import com.bokesoft.yes.tools.rights.RightsProviderFactory;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 根据路径判断是否有权限
 * 
 * @author zkh
 *
 */

public class EntryRight implements IExtService {

	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return entryRight(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)));
	}

	/**
	 * 
	 * @param Context
	 *            中间层对象
	 * @param path
	 *            菜单路径
	 * @return 有权限返回true,否则false
	 * @throws Throwable
	 */
	public static Boolean entryRight(DefaultContext context, String path) throws Throwable {
		IRightsProviderFactory iRghProFac = RightsProviderFactory.getInstance();
		MidVE midVe = context.getVE();
		IRightsProvider iRghProvider = iRghProFac.newRightsProvider(midVe);
		EntryRights entryRights = iRghProvider.getEntryRights();
		Boolean flag = entryRights.hasEntryRights(path);
		return flag;
	}

}
