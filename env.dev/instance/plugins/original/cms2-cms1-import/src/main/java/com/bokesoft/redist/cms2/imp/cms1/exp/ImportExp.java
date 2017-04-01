package com.bokesoft.redist.cms2.imp.cms1.exp;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import com.bokesoft.cms2.basetools.util.Misc;
import com.bokesoft.cms2.core.ctx.CmsActionContext;
import com.bokesoft.cms2.core.ctx.CmsRequestContext;
import com.bokesoft.redist.cms2.imp.cms1.cms1.modelio.ModelIOManager;

public class ImportExp {
	private static final String VAR_FROMSITE = "fromsite";
	private static final String VAR_TOSITE = "tositeIndex";
	private static final String VAR_NAMESPACE = "namespace";
	
	public static final String EXP_IMPORT = 
			"#!spring:T("+ImportExp.class.getName()+").importJson()";
	
	private ImportExp(){
		//private constructor to prevent new instance
	}
	
	private static CmsRequestContext getCtx() {
		CmsRequestContext ctx = CmsRequestContext.getThreadInstance();
		return ctx;
	}
	
   /** 数据文件存储的目录列表 */
	private static List<File> dataPaths = null;
	
	/** 数据文件存储的目录列表(字符串) */
	private static List<String> dataPathStrs = null;
	
	/** 数据文件存储的目录列表(返回给页面使用) */
	private static List<String> dataPath4Select = null;
	
	/** 供子类直接使用, 获得通过 Spring 配置的数据存储目录 */
    protected List<File> dataPathList= new ArrayList<File>();
		
	public void setDataPaths(String[] paths) throws IOException, URISyntaxException {
		if (null==paths) paths = new String[]{};
		for (int i = 0; i < paths.length; i++) {
			//FIXME: 目前 ModelIO 仅支持文件系统(file:...)
			URL u = new URL(paths[i]);
			File f = new File(u.getFile());
			this.dataPathList.add(f);
		}
		//FIXME: Spring hack - 通过 Spring 注射来改变静态变量
		ImportExp.dataPaths =  this.dataPathList;
	}
	
	public List<File> getDataPaths() {
		return dataPaths;
	}	
	
	//获取dataPath返回
	public static List<String> getDataPaths4Select(){
		if(null == dataPath4Select){
			dataPath4Select = new ArrayList<String>(); 
			for(File file:dataPaths){
				dataPath4Select.add("'"+file.getAbsolutePath().replace("\\", "/")+"'");
			}
		}		
		return dataPath4Select;
	}
	
	//获取dataPath返回
	public static List<String> getToStieDataPaths(){
		if(null == dataPathStrs){
			dataPathStrs = new ArrayList<String>();
			for(File file:dataPaths){
				dataPathStrs.add(file.getAbsolutePath());
			}
		}
		return dataPathStrs;
	}
	
	public static void importJson() throws IOException{
		CmsActionContext ctx = (CmsActionContext) getCtx();
		String fromsite = (String) ctx.getVar(VAR_FROMSITE);
		int tositeIndex = Integer.valueOf((String) ctx.getVar(VAR_TOSITE));
		String namespace = (String) ctx.getVar(VAR_NAMESPACE);
		String tosite = getToStieDataPaths().get(tositeIndex);
		if(tosite == null || tosite.trim().length()==0 ) {
			Misc.throwRuntime(new RuntimeException("toSite没有选择"));
		}
		if(namespace ==null || namespace.trim().length()==0){
			Misc.throwRuntime(new RuntimeException("namespace没有填写"));
		}
		ModelIOManager.checkFromSiteisEnabled(fromsite);
		
		ModelIOManager.cms2ImportCms1(fromsite, tosite, namespace);
		ctx.setData("result","sucess");
		ctx.setViewer("json");
	}
	
}
