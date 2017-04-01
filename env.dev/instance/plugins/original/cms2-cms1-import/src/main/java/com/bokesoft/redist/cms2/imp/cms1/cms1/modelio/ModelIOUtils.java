package com.bokesoft.redist.cms2.imp.cms1.cms1.modelio;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.io.FileUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.bokesoft.cms2.basetools.util.Misc;
import com.bokesoft.cms2.core.utils.HtmlTmplUtil;
import com.bokesoft.cms2.impl.buildin.modelio.vo.BlockVO;
import com.bokesoft.cms2.impl.buildin.modelio.vo.BlockVO.BlockParam;
import com.bokesoft.cms2.impl.buildin.modelio.vo.PageVO;
import com.bokesoft.cms2.impl.buildin.modelio.vo.PageVO.DeliveryVO;
import com.bokesoft.cms2.model.Action;
import com.bokesoft.cms2.model.HtmlTmpl;
import com.bokesoft.cms2.model.Page.DeliveryOption;
import com.bokesoft.cms2.model.Page.Group;
import com.bokesoft.cms2.model.blocks.TmplBlock;
import com.bokesoft.redist.cms2.imp.cms1.cms1.model.Block.Param;
import com.bokesoft.redist.cms2.imp.cms1.cms1.pkg.ActionPkg;
import com.bokesoft.redist.cms2.imp.cms1.cms1.pkg.BlockPkg;
import com.bokesoft.redist.cms2.imp.cms1.cms1.pkg.HtmlTmplPkg;
import com.bokesoft.redist.cms2.imp.cms1.cms1.pkg.PagePkg;

public class ModelIOUtils {
	
	public static final SerializerFeature[] SERIALIZER_FEATURES_STANDARD = new SerializerFeature[]{
		SerializerFeature.PrettyFormat,
		SerializerFeature.DisableCircularReferenceDetect,
		SerializerFeature.WriteClassName
	};
	
	/**
	 * 取得fromsite配置目录下对应的json的文件名称
	 * @param billKey
	 * @param dataPaths
	 * @throws Throwable
	 */
	public static Map<String,List<String>> mirrorAllJsonResource(String fromsite){
		try {
			Map<String,List<String>> allMjsons=new HashMap<String,List<String>>();
			File fromsitefolder;

			fromsitefolder=new File(fromsite);
			if (fromsitefolder.exists()) {
				File[] dirFolder = fromsitefolder.listFiles();
				for(File folder:dirFolder){
					List<String> mcodes=new ArrayList<String>();
					Collection<File> dirData = FileUtils.listFiles(folder, null, false);
					List<File> tmp = new ArrayList<File>(dirData);
					Collections.sort(tmp, new Comparator<File>(){	//鍚屼竴涓�? design-data 鐩綍涓嬫寜鐓ф枃浠跺悕鎺掑簭
						public int compare(File f1, File f2) {
							return f1.getName().compareTo(f2.getName());
						}
					});
					for (File jsonfile : tmp) {
						if(!jsonfile.isDirectory()){
							String jsonpath = jsonfile.getAbsolutePath();							
							mcodes.add(jsonpath);
						}
					}
					String foldername = folder.getName();
					allMjsons.put(foldername,mcodes);
				}
			}
			return allMjsons;		
		}catch (Throwable e) {
			Misc.throwRuntime(e);
			return null;
		}	
	}

	
	/**
	 * 读取指定code的json文件，将文件内容作为字符串返回
	 * @param billKey
	 * @param code
	 * @param dataPaths
	 * @throws Throwable
	 */
	public static String readMirrorJson(String jsonpath){
		try {
			File jsonfile = new File(jsonpath);
			if (jsonfile.exists()){
				return FileUtils.readFileToString(jsonfile, "UTF-8");		
			}
		} catch (IOException e) {
			Misc.throwRuntime(e);
		}
		return null;
	}
	
	public static Map<String,String> transfrom2CMS2ActionJson(ActionPkg apkg,String datapath,String namespace,String folder){
		Map<String,String> result = new HashMap<String,String>();
		
		com.bokesoft.redist.cms2.imp.cms1.cms1.model.Action actionCms1 = apkg.getAction();
		Action actionCms2 = new Action();
		actionCms2.setActionExp(actionCms1.getActionExp());
		actionCms2.setActionUrl(actionCms1.getActionUrl());
		actionCms2.setCode(actionCms1.getCode());
		actionCms2.setName(actionCms1.getName());
		actionCms2.setNotes(actionCms1.getNotes());
		actionCms2.setAttributes(actionCms1.getAttributes());
		String dataText = JSON.toJSONString(actionCms2,SERIALIZER_FEATURES_STANDARD);
		String filename = actionCms2.getCode();
		result.put("filename", filename);
		result.put("dataText", dataText);
		return result;
	}


	public static Map<String,String> transfrom2CMS2BlockJson(BlockPkg bpkg, String tosite,
			String namespace, String string) {
		Map<String,String> result = new HashMap<String,String>();
		
		com.bokesoft.redist.cms2.imp.cms1.cms1.model.Block blockCms1 = bpkg.getBlock();
		BlockVO blockVo = new BlockVO();
		blockVo.setCode(blockCms1.getCode());
		blockVo.setName(blockCms1.getName());
		blockVo.setNotes(blockCms1.getNotes());
		List<Param> params = blockCms1.getParameters();
		List<BlockParam> blockParams = new ArrayList<BlockParam>();
		for(Param param:params){
			BlockParam bp = new BlockParam();
			bp.setCaption(param.getCaption());
			bp.setKey(param.getKey());
			bp.setType(BlockParam.COMMON_TYPE);
			blockParams.add(bp);
		}
		blockVo.setParams(blockParams);
		//FIX ME 是否需要考虑urlBlock和YigoBlock
		if(blockCms1 instanceof com.bokesoft.redist.cms2.imp.cms1.cms1.model.blocks.TmplBlock){
			com.bokesoft.redist.cms2.imp.cms1.cms1.model.blocks.TmplBlock tmplblockCms1 
				= (com.bokesoft.redist.cms2.imp.cms1.cms1.model.blocks.TmplBlock) blockCms1;
			TmplBlock blockCms2 = new TmplBlock();
			blockCms2.setFormulaText(tmplblockCms1.getFormulaText());
			blockCms2.setTmplText(tmplblockCms1.getTmplText());
			blockCms2.setCssClassName(tmplblockCms1.getCssClassName());
			blockCms2.setCssStyles(tmplblockCms1.getCssStyles());
			blockVo.setBlock(blockCms2);
		}
		String dataText = JSON.toJSONString(blockVo,SERIALIZER_FEATURES_STANDARD);
		String filename = blockVo.getCode();
		result.put("filename", filename);
		result.put("dataText", dataText);
		return result;
	}


	public static Map<String,String> transfrom2CMS2HtmlTplJson(HtmlTmplPkg hpkg,
			String tosite, String namespace, String string) {
		Map<String,String> result = new HashMap<String,String>();
		
		com.bokesoft.redist.cms2.imp.cms1.cms1.model.HtmlTmpl htmplCms1 = hpkg.getHtmltmpl();
		HtmlTmpl htmplCms2 = new HtmlTmpl();
		htmplCms2.setCode(htmplCms1.getCode());
		htmplCms2.setName(htmplCms1.getName());
		htmplCms2.setNotes(htmplCms1.getNotes());
		htmplCms2.setHtmlText(htmplCms1.getHtmlText());
		List<HtmlTmpl.Slice> slices = HtmlTmplUtil.analyzeHtml(htmplCms2.getHtmlText());
		htmplCms2.setSlices(slices);
		String dataText = JSON.toJSONString(htmplCms2,SERIALIZER_FEATURES_STANDARD);
		String filename = htmplCms2.getCode();
		result.put("filename", filename);
		result.put("dataText", dataText);
		return result;
	}
	
	public static Map<String,String> transfrom2CMS2PageJson(PagePkg ppkg, String tosite,
			String namespace, String string) {
		Map<String,String> result = new HashMap<String,String>();
		
		com.bokesoft.redist.cms2.imp.cms1.cms1.model.Page pageCms1 = ppkg.getPage();
		PageVO pageVo =new PageVO(); 
		pageVo.setCode(pageCms1.getCode());
		pageVo.setName(pageCms1.getName());
		pageVo.setTitle(pageCms1.getTitle());
		pageVo.setUrl(pageCms1.getUrl());
		pageVo.setTmplCode(pageCms1.getTmpl().getCode());
		pageVo.setAttributes(pageCms1.getAttributes());
		List<com.bokesoft.redist.cms2.imp.cms1.cms1.model.Page.Delivery> deliveries= pageCms1.getDeliveries();
		List<DeliveryVO> deliveryVos= new ArrayList<DeliveryVO>();
		for(com.bokesoft.redist.cms2.imp.cms1.cms1.model.Page.Delivery delivery:deliveries){
			DeliveryVO deliveryVo  = new DeliveryVO();
			deliveryVo.setGroupName(delivery.getGroupName());
			deliveryVo.setAreaCode(delivery.getAreaCode());
			deliveryVo.setBlockCode(delivery.getBlock().getCode());
			deliveryVo.setName(delivery.getName());
			deliveryVo.setParameters(delivery.getParameters());
			
			deliveryVo.setSequence(delivery.getSequence());
			deliveryVo.setCssClassName(delivery.getCssClassName());
			deliveryVo.setCssStyles(delivery.getCssStyles());
			Set<com.bokesoft.redist.cms2.imp.cms1.cms1.model.Page.DeliveryOption> cms1DeliveryOptions = delivery.getOptions();
			List<DeliveryOption> cms2DeliveryOptions = tranfrom2Cms2DeliveryOptions(cms1DeliveryOptions);
			deliveryVo.setOptions(cms2DeliveryOptions);
			deliveryVos.add(deliveryVo);
		}
		pageVo.setDeliveryVOs(deliveryVos);
		List<com.bokesoft.redist.cms2.imp.cms1.cms1.model.Page.Group> cms1groups = pageCms1.getGroups();
		List<Group> cms2groups = new ArrayList<Group>();
		for(com.bokesoft.redist.cms2.imp.cms1.cms1.model.Page.Group cms1group:cms1groups){
			Group cms2group = new Group();
			cms2group.setGroupName(cms1group.getGroupName());
			cms2groups.add(cms2group);
		}
		pageVo.setGroups(cms2groups);
		String dataText = JSON.toJSONString(pageVo,SERIALIZER_FEATURES_STANDARD);
		String filename = pageVo.getCode();
		result.put("filename", filename);
		result.put("dataText", dataText);
		return result;
	}


	private static List<DeliveryOption> tranfrom2Cms2DeliveryOptions(
			Set<com.bokesoft.redist.cms2.imp.cms1.cms1.model.Page.DeliveryOption> cms1DeliveryOptions) {
		
		List<DeliveryOption> cms2DeliveryOptions = new ArrayList<DeliveryOption>();
		//cms1DeliveryOptions是个list可能同时含有多个options,所以不能使用if - else if的结构
		if(cms1DeliveryOptions.size()>0){
			if(cms1DeliveryOptions.contains(com.bokesoft.redist.cms2.imp.cms1.cms1.model.Page.DeliveryOption.PureRaw)){
				cms2DeliveryOptions.add(DeliveryOption.PureRaw);
			}
			if(cms1DeliveryOptions.contains(com.bokesoft.redist.cms2.imp.cms1.cms1.model.Page.DeliveryOption.Hidden)){
				cms2DeliveryOptions.add(DeliveryOption.Hidden);
			}
			if(cms1DeliveryOptions.contains(com.bokesoft.redist.cms2.imp.cms1.cms1.model.Page.DeliveryOption.Raw)){
				cms2DeliveryOptions.add(DeliveryOption.Raw);
			}
			if(cms1DeliveryOptions.contains(com.bokesoft.redist.cms2.imp.cms1.cms1.model.Page.DeliveryOption.WithHeader)){
				cms2DeliveryOptions.add(DeliveryOption.WithHeader);
			}			
		}else{
			cms2DeliveryOptions.add(DeliveryOption.Raw);
		}
		return cms2DeliveryOptions;
	}
}

