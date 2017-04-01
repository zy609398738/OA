package com.bokesoft.r2.cms2.adapter.yigo2.support;

import java.security.AccessControlException;

import org.apache.commons.lang3.StringUtils;

import com.bokesoft.cms2.adapter.BackendWorker;
import com.bokesoft.cms2.basetools.util.Misc;
import com.bokesoft.cms2.core.ctx.CmsActionContext;
import com.bokesoft.cms2.designer.cms.acl.AbstractDesignerActionAccessListener;
import com.bokesoft.r2.cms2.adapter.yigo2.Yigo2BackendWorker;
import com.bokesoft.r2.cms2.adapter.yigo2.tools.Yigo2Helper;
import com.bokesoft.yigo.common.def.ScriptType;
import com.bokesoft.yigo.mid.base.DefaultContext;

/**
 * 集成 Yigo 权限的 CMS 设计器操作权限控制程序
 */
public class Yigo2DesignerActionAccessListener extends AbstractDesignerActionAccessListener {
	/**
	 * 用于检查 CMS 设计器操作权限的 Yigo 公式名称;<br/>
	 * 
	 * 此公式在调用时会传入两个参数：1.数据目录名(字符串), 2.是否写操作(boolean);<br/>
	 * 
	 * 公式返回行为类似“检查公式”，即返回 非空字符串 代表操作权限检查失败; 返回 true 或者 空字符串 代表允许执行。
	 */
	public static final String CMS_DESIGNER_CHECK_PERM = "CMS_DESIGNER_CHECK_PERM";
	
	@Override
	protected void checkPermission(String folderName, boolean writable, CmsActionContext ctx) {
		if (ctx.isDevelopMode()){
			return;	//开发模式不作检查
		}else{
	        BackendWorker worker = ctx.getBackend();
	        if (null==worker || !(worker instanceof Yigo2BackendWorker)) {
	        	throw new RuntimeException(
	        			"Unsuppored backendWorker type: "+ (null==worker ? "(null)" : worker.getClass()));
	        }
	        try {
	        	DefaultContext yigo2Ctx = Yigo2Helper.getYigo2Context(ctx);
	            String formula = CMS_DESIGNER_CHECK_PERM+"('"+folderName+"', "+writable+")";
	            
	            Object result = yigo2Ctx.getMidParser().eval(ScriptType.Formula, formula);
	            
	            checkResult(result, folderName);
	        }catch (Throwable e) {
	        	Misc.throwRuntime(e);
	        }
		}
	}
	
	private void checkResult(Object result, String folderName){
        if (null==result){
        	//返回 null 代表允许执行
        	return;
        }

        if (result instanceof Boolean){
        	boolean hasAcl = (Boolean) result;
        	if (hasAcl){
        		return;
        	}else{
            	throw new AccessControlException("您没有访问 "+folderName+" 的权限");
        	}
        }
        
    	String sResult = result.toString();
    	if (StringUtils.isBlank(sResult)){
    		//返回空字符串代表允许执行
    		return;
    	}else{
        	throw new AccessControlException("您没有访问 "+folderName+" 的权限: " + sResult);
    	}
	}

}
