package com.bokesoft.oa.mid;

import java.io.File;
import java.util.ArrayList;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 获取邮件模板文件名称的字符串
 * 
 * @author chenbiao
 *
 */
public class GetFileNameStr implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return getFileNameStr(TypeConvertor.toString(paramArrayList.get(0)));
	}

	/**
	 * 获取邮件模板文件名称的字符串
	 * @return 文件名字符串
	 * @throws Throwable
	 */
	public static String getFileNameStr(String path){   
        // get file list where the path has   
        File file = new File(path);   
        // get the folder list   
        File[] array = file.listFiles();   
        
        String fileStr="";  
        for(int i=0;i<array.length;i++){   
            if(array[i].isFile()){   
            	fileStr=fileStr+","+  array[i].getName();  
            } 
        }
        if (fileStr.length() > 0) {
        	fileStr = fileStr.substring(1);
		}
		return fileStr;   
    }   
}
