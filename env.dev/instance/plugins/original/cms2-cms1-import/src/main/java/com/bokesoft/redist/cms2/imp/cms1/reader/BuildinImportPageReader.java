package com.bokesoft.redist.cms2.imp.cms1.reader;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bokesoft.cms2.basetools.util.Misc;
import com.bokesoft.cms2.core.ctx.CmsRequestContext;
import com.bokesoft.cms2.core.reader.ext.ExtendedPageReader;
import com.bokesoft.cms2.core.utils.HtmlTmplUtil;
import com.bokesoft.cms2.designer.cms.BuildinDesignerPageReader;
import com.bokesoft.cms2.model.HtmlTmpl;
import com.bokesoft.cms2.model.Page;

public class BuildinImportPageReader implements ExtendedPageReader{
	private static Logger log = LoggerFactory.getLogger(BuildinDesignerPageReader.class);

 	private Map<String, Page> urlPageTable = null;
 	private Map<String, Page> codePageTable = null;
		
	@Override
	public Page getPageByUrl(String url, CmsRequestContext ctx) {
		if (null==urlPageTable){
			doLoad(ctx);
		}
		Page p = urlPageTable.get(url);
		return p;
	}

	@Override
	public Page getPageByCode(String code, CmsRequestContext reqContext) {
		if (null==codePageTable){
			doLoad(reqContext);
		}
		Page p = codePageTable.get(code);
		return p;
	}

	@Override
	public List<String> findAllUrls(CmsRequestContext reqContext) {
		List<String> readerUrls = new ArrayList<>();
		doLoad(reqContext);//Reload every time, to make changes immediately
		for(String url : this.urlPageTable.keySet()){
			readerUrls.add(url);
		}
		return readerUrls;	
	}
	
	private void doLoad(CmsRequestContext ctx){
		urlPageTable = new HashMap<String, Page>();
		codePageTable = new HashMap<String, Page>();

		doLoadPage();
	}
	
	private void doLoadPage(){
        log.debug("loading page: importpage");
        Page p = new Page();
        p.setCode("CMS2-CMS1-IMPORT");
        p.setUrl("/cms2-cms1-imp.page");
		p.setName("CMS2-CMS1-IMPORT");
		p.setTitle("CMS2-CMS1-IMPORT");
        HtmlTmpl t = new HtmlTmpl();
        String html = readClassResource(this.getClass(),"/cms2-imp-cms1/buildin/importPage.html");
        t.setHtmlText(html);
        List<HtmlTmpl.Slice> slices = HtmlTmplUtil.analyzeHtml(t.getHtmlText());
		t.setSlices(slices);
        p.setTmpl(t);
		
		this.urlPageTable.put(p.getUrl(), p);
		this.codePageTable.put(p.getCode(), p);
	}
	
	private String readClassResource(Class<?> clazz, String file) {
		try {
			String s = IOUtils.toString(clazz.getResourceAsStream(file), "UTF-8");
			return s;
		} catch (IOException e) {
			Misc.throwRuntime(e);
			return null;
		}
	}
}
