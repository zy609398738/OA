package com.bokesoft.yigo.rt01.utils;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.bokesoft.myerp.common.SharedBundle;
import com.bokesoft.myerp.dev.mid.IMidContext;

public class FileUtils {
	public static final String DEFAULT_FILE_LOCATION_IN_CONFIG = "Module/SCM";
	
	private static List<File> ROOT_DIRECTORIES = null;
	private static List<File> _getRootDirectories(){
		if (null!=ROOT_DIRECTORIES){
			return ROOT_DIRECTORIES;
		}
		//Lazy load ...
		ROOT_DIRECTORIES = new ArrayList<File>();
		File[] roots = File.listRoots();
		for (int i = 0; i < roots.length; i++) {
			ROOT_DIRECTORIES.add(roots[i]);
		}
		return ROOT_DIRECTORIES;
	}
	
	/**
	 * 判断当前操作系统是不是window
	 * @return
	 */
	public static boolean isWindows() {
		boolean flag = false;
		if (System.getProperties().getProperty("os.name").toUpperCase().indexOf("WINDOWS") != -1) {
			flag = true;
		}
		return flag;
	}

	/**
	 * 判断一个路径字符串是否是一个相对路径
	 * @param path
	 * @return
	 */
	public static boolean isAbstractPath(String path){
		List<File> roots = _getRootDirectories();
		try{
			for (File root: roots){
				String rootPath = root.getCanonicalPath();
				rootPath.replace("\\", "/");
				if (isWindows()){
					path = path.toLowerCase();
					rootPath = rootPath.toLowerCase();
				}
				if (path.startsWith(rootPath)){
					return true;
				}
			}
			return false;
		}catch(IOException e){
			throw new RuntimeException(e);
		}
	}
	
	/**
	 * 按照顺序将路径加起来
	 * @param path
	 * @return
	 */
	public static String joinPath(String ... paths){
		List<String> tmp = new ArrayList<String>();
		int length = paths.length;
		for(int i=0; i<length; i++){
			String path = paths[i];
			path.replace("\\", "/");
			if (i>0/*Not the first*/ &&
					path.startsWith("/")){
				path = path.substring(1);
			}
			if (i!=length-1/*Not the last*/
					&& path.endsWith("/")){
				path = path.substring(0, path.length()-1);
			}
			if (StringUtils.isNotBlank(path)){
				tmp.add(path);
			}
		}
		return StringUtils.join(tmp, "/");
	}
	
	/**
	 * 获取当前 Yigo 实例的所有配置目录列表, 第一个是主配置
	 * @param ctx
	 * @return
	 */
	public static List<File> getConfigPathList(IMidContext ctx){
		List<File> cfgPaths = new ArrayList<File>();
		
		String mainCfgPath = SharedBundle.getConfigPath("");
		cfgPaths.add(new File(mainCfgPath));
		
		Map<String, String> adds = SharedBundle.getAdditionalConfigMap();
		for (String additionPath: adds.values()) {
			cfgPaths.add(new File(additionPath));
		}
		
		//必须包含主配置目录
		if (cfgPaths.size()<1){
			throw new RuntimeException("获取[配置目录列表]错误 - 找不到主配置目录");
		}
		
		return cfgPaths;
	}
	
	/**
	 * 基于配置文件目录获取指定的文件, 支持基于 配置目录/Module/SCM({@link #DEFAULT_FILE_LOCATION_IN_CONFIG}) 为基础的相对目录, 也支持绝对目录
	 * @param ctx
	 * @param file
	 * @param prefixPath 路径前缀, 如果 file 是相对路径的话, 这个参数可以指定它是相对与配置文件目录的某个子目录下
	 * @return
	 */
	public static File getFileInConfig(IMidContext ctx, String file, String prefixPath){
		if (isAbstractPath(file)){
			return new File(file);
		}
		
		try{
			List<File> cfgList = getConfigPathList(ctx);
			
			for(File cfg: cfgList){
				File f = new File( joinPath(cfg.getCanonicalPath(), prefixPath, file) );
				if (f.exists()){
					return f;
				}
			}
			
			//找不到, 返回主配置目录下的文件名
			File mainCfg = cfgList.get(0);
			File f = new File( joinPath(mainCfg.getCanonicalPath(), prefixPath, file) );
			return f;
		}catch(IOException e){
			throw new RuntimeException(e);
		}
	}
}
