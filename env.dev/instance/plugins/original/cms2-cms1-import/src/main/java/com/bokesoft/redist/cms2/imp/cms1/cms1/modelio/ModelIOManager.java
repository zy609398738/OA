package com.bokesoft.redist.cms2.imp.cms1.cms1.modelio;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.bokesoft.cms2.basetools.util.Misc;
import com.bokesoft.cms2.impl.buildin.modelio.reader.ModelIOPageReader;
import com.bokesoft.redist.cms2.imp.cms1.cms1.pkg.ActionPkg;
import com.bokesoft.redist.cms2.imp.cms1.cms1.pkg.BlockPkg;
import com.bokesoft.redist.cms2.imp.cms1.cms1.pkg.HtmlTmplPkg;
import com.bokesoft.redist.cms2.imp.cms1.cms1.pkg.PagePkg;
import com.bokesoft.redist.cms2.imp.cms1.cms1.pkg.intf.NormalPkg;
/**
 * The manager to handle all model I/O works
 */
public class ModelIOManager {
	private static final Logger log = LoggerFactory.getLogger(ModelIOManager.class);
	
	private final static String PARENT_NODETYPE = "1";
	private final static String CMS1_ROOT_PATH="com.bokesoft.cms.designer.modelio.ModelIOManager_TREE_ROOT";
	private final static String OLD_CMS1_PKG_PATH = "com.bokesoft.cms.designer.pkg";
	private final static String IMP_CMS1_PKG_PATH = "com.bokesoft.redist.cms2.imp.cms1.cms1.pkg";
	private final static String OLD_CMS1_MODEL_PATH = "com.bokesoft.cms.model";
	private final static String IMP_CMS1_MODEL_PATH = "com.bokesoft.redist.cms2.imp.cms1.cms1.model";
	private static Map<String,String> namespaceMap = new HashMap<String,String>();
	
	/**
	 * 根据fromsite提供的uri,找到对应的json配置文件集合,以(文件名.文件集合),Map<String,List<String>>形式返回
	 * @param billKey
	 * @param ctx
	 * @param dataPaths
	 * @throws Throwable
	 */
	public static Map<String,List<String>> mirrorAllJsonResource(String fromsite){
		try{
			Map<String,List<String>> allMjsons = ModelIOUtils.mirrorAllJsonResource(fromsite);
			return allMjsons;
		}catch (Throwable e) {
			Misc.throwRuntime(e);
			return null;
		}
	}
	
	public static void cms2ImportCms1(String fromsite,String tosite,String namespace) throws IOException{
		log.info("[cms2-cms1-impo] >>>> cms2导入cms1的配置工程开始");
		Map<String,List<String>> mirrorAllJsons = ModelIOManager.mirrorAllJsonResource(fromsite);
		if (!mirrorAllJsons.isEmpty()) {
			for (String folderName : mirrorAllJsons.keySet()) {
				List<String> jsonpaths = mirrorAllJsons.get(folderName);
				//需要去转化的json,对于只作为parent的json放置到一个map中查找对应的关系
				List<String> effjsonpaths = getEnabledJsonResource(jsonpaths);
				for(String jsonpath:effjsonpaths){
					mirror2Cms2(tosite,namespace,folderName,jsonpath);
				}
			}
		}
		ModelIOPageReader.reset();
	}
	
	
	private static NormalPkg getNormalPkgByPath(String jsonpath) {
		String jsonStr=ModelIOUtils.readMirrorJson(jsonpath);
		NormalPkg np = null;
		if(null != jsonStr){
			try{				
				jsonStr = jsonStr.replaceAll(OLD_CMS1_PKG_PATH, IMP_CMS1_PKG_PATH);
				jsonStr = jsonStr.replaceAll(OLD_CMS1_MODEL_PATH, IMP_CMS1_MODEL_PATH);
				np = JSON.parseObject(jsonStr,NormalPkg.class);
			}catch(Throwable e){
				log.error(">>> json parse error",e);
			}
		}
		return np;
	}
	
	private static List<String> getEnabledJsonResource(List<String> jsonpaths) {
		List<String> result = new ArrayList<String>();
		for(String jsonpath:jsonpaths){
			NormalPkg np = getNormalPkgByPath(jsonpath);
			if(null != np ){
				String nodeType = np.getNodeType();				
				if(PARENT_NODETYPE.equals(nodeType)){
					String parentcode = np.getParentCode();
					String code = "";
					if(np instanceof ActionPkg){
						code = ((ActionPkg) np).getAction().getCode();
					}else if(np instanceof BlockPkg){
						code = ((BlockPkg) np).getBlock().getCode();
					}else if(np instanceof HtmlTmplPkg){
						code = ((HtmlTmplPkg) np).getHtmltmpl().getCode();
					}else if(np instanceof PagePkg){
						code = ((PagePkg) np).getPage().getCode();						
					}		
					namespaceMap.put(code, parentcode);
				}else{
					result.add(jsonpath);
				}				
			}
		}
		return result;
	}

	public static void mirror2Cms2(String tosite, String namespace, String foldername,String jsonpath) throws IOException {

		NormalPkg np = getNormalPkgByPath(jsonpath); 
		Map<String,String> jsonInfo = null;
		String toSiteFolder = "";
		if(np instanceof ActionPkg){
			toSiteFolder = "actions";
			jsonInfo = ModelIOUtils.transfrom2CMS2ActionJson((ActionPkg) np,tosite,namespace,"action");
		}else if(np instanceof BlockPkg){
			toSiteFolder = "blocks";
			jsonInfo = ModelIOUtils.transfrom2CMS2BlockJson((BlockPkg) np,tosite,namespace,"action");
		}else if(np instanceof HtmlTmplPkg){
			toSiteFolder = "htmltmpls";
			jsonInfo = ModelIOUtils.transfrom2CMS2HtmlTplJson( (HtmlTmplPkg) np,tosite,namespace,"action");
		}else if(np instanceof PagePkg){
			toSiteFolder = "pages";
			jsonInfo = ModelIOUtils.transfrom2CMS2PageJson((PagePkg) np,tosite,namespace,"action");
		}			
		String filepath = joinPath(joinPath(tosite, toSiteFolder),namespace);
		String parentcode = np.getParentCode();
		if(null != parentcode && !(CMS1_ROOT_PATH.equals(parentcode))){
			parentcode = getAbsoluteParent(parentcode);
			filepath = joinPath(filepath,parentcode);
		}
		String filename = jsonInfo.get("filename");
		filepath = joinPath(filepath,filename+".json");
		File newDataFile = new File(filepath);
		String dataText = jsonInfo.get("dataText");
		FileUtils.write(newDataFile, dataText, "UTF-8");
		log.info(" >>>> ["+jsonpath+"]文件转换成功,已转换至:"+filepath);
	}
	
	private static String getAbsoluteParent(String code) {
		String parentcode = namespaceMap.get(code);
		if(null != parentcode && !(CMS1_ROOT_PATH.equals(parentcode))){
			return getAbsoluteParent(parentcode)+File.separator+code;
		}else{
			return code;
		}
	}

	private static String joinPath(String datapath, String namespace){
		if (! datapath.endsWith("/")){
			datapath += "/";
		}
		if (namespace.startsWith("/")){
			namespace = namespace.substring(1);
		}
		String dataFile = datapath+namespace;
		return dataFile;
	}

	public static void checkFromSiteisEnabled(String fromsite) {
		File fromsitefolder=new File(fromsite);
		if(!fromsitefolder.exists()){
			Misc.throwRuntime(new RuntimeException("FromSite:"+fromsite+",不存在!")); 
		}
	}
}
