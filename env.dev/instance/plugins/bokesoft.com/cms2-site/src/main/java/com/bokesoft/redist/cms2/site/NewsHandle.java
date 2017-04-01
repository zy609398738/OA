package com.bokesoft.redist.cms2.site;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

import com.bokesoft.cms2.basetools.data.PagingSearchResult;
import com.bokesoft.cms2.impl.buildin.modelio.ModelIOConst;
import com.bokesoft.cms2.impl.buildin.modelio.reader.base.DataPathConfigurable;
import com.bokesoft.cms2.impl.buildin.modelio.util.DataFileBean;
import com.bokesoft.cms2.impl.buildin.modelio.util.ModelIOUtil;
import com.bokesoft.cms2.impl.buildin.modelio.vo.PageVO;
import com.bokesoft.cms2.impl.buildin.modelio.vo.PageVO.DeliveryVO;

public class NewsHandle extends DataPathConfigurable {
	private static final String NEWS_SOURCE="source";
	private static final String NEWS_AUTHOR="author";
	private static final String NEWS_TITLE="title";
	private static final String NEWS_DATE="date";
	private static final String NEWS_TYPE="type";
	private static final String NEWS_MAINPIC="mainPic";
	private static final String NEWS_CONTENT="content";

	private static List<File> dataPaths;
	@Override
	public void setDataPaths(String[] paths) throws IOException, URISyntaxException {
		super.setDataPaths(paths);
		//FIXME: Spring hack - 通过 Spring 注射来改变静态变量的做法不太合适
		NewsHandle.dataPaths = this.dataPathList;
	}
	
	/** 显示新闻详细的页面, 只有包含这个 block 的 page 才被看作新闻页面 */
	private static String newsDetailBlockCode = "";
	public void setNewsDetailBlockCode(String code){
		//FIXME: Spring hack - 通过 Spring 注射来改变静态变量的做法不太合适
		if (StringUtils.isNotBlank(code)){
			NewsHandle.newsDetailBlockCode = code;
		}
	}
	
	/**
	 * 获取新闻列表
	 * @param type 新闻类型
	 * @param size 获取新闻的条数
	 * @return
	 */
	public static List<NewsItem> getNewsList(String type, String size){
		return filterByPageSize(buildNewsList(type), size);
	}
	
	/**
	 * 构建分页的新闻列表
	 * @param type
	 * @param pageNoStr
	 * @param pageSizeStr
	 * @return
	 */
	public static PagingSearchResult<List<NewsItem>> getNewsList(String type, String pageNoStr, String pageSizeStr) {
		List<NewsItem> newsList=buildNewsList(type);
		newsList=filterByType(newsList,type);
		
		//设置当前页
		int pageNo=0;
		if(StringUtils.isNotBlank(pageNoStr)){
			pageNo=Integer.valueOf(pageNoStr);
		}
		
		//设置总条数
		int totalRecords=newsList.size();
		
		//设置总页数
		int pageSize=0;
		if(StringUtils.isNotBlank(pageSizeStr)){
			pageSize=Integer.valueOf(pageSizeStr);
		}
		
		int m=totalRecords%pageSize;
		int pageCount=0;
		if(m>0){
			pageCount=totalRecords/pageSize+1;
		 }else{
			pageCount=totalRecords/pageSize;
		 }
		
		//设置当前页返回的结果集
		List<NewsItem> result=new ArrayList<NewsItem>();
		if(pageNo>0){
			if(m==0){
				result= newsList.subList((pageNo)*pageSize,pageSize*(pageNo+1)); 
			}else{
				 if ((pageNo+1)==pageCount){
					 result= newsList.subList((pageNo)*pageSize,totalRecords);
				 }else{
					 result= newsList.subList((pageNo)*pageSize,pageSize*(pageNo+1));
				 }
			}
		}else{
			if(totalRecords>pageSize){
				result=newsList.subList(0,pageSize);
			}else{
				result=newsList.subList(0,totalRecords);
			}
		}
		
		
		PagingSearchResult<List<NewsItem>> pagingResult=new PagingSearchResult<List<NewsItem>>(pageNo, pageSize, totalRecords);
		pagingResult.setData(result);
		return pagingResult;
	}
	
	private static List<NewsItem> buildNewsList(String type){
		List<NewsItem> newsList=new ArrayList<NewsItem>();
		List<DataFileBean> dataFiles =
				ModelIOUtil.readAllDataFiles(ModelIOConst.FOLDER_NAME_Page, NewsHandle.dataPaths);
		for(DataFileBean dataFileBean : dataFiles) {
			PageVO pageModel=(PageVO) dataFileBean.getModel();
			
			List<DeliveryVO> deliveries=pageModel.getDeliveryVOs();
			for(DeliveryVO d: deliveries){
				String blockCode=d.getBlockCode();
				d.getParameters();
				if(newsDetailBlockCode.equalsIgnoreCase(blockCode)){
					NewsItem news=new NewsItem();
					news.setNewsPageUrl(pageModel.getUrl());
					
					Set<Map.Entry<String, String>> parameters = d.getParameters().entrySet();
					for (Map.Entry<String, String> entry : parameters) {
						String paramKey=entry.getKey();
						String parmaValue=entry.getValue();
						if(NEWS_SOURCE.equals(paramKey)){
							news.setNewsSource(parmaValue);
						}
						if(NEWS_AUTHOR.equals(paramKey)){
							news.setNewsAuthor(parmaValue);
						}
						if(NEWS_TITLE.equals(paramKey)){
							news.setNewsTitle(parmaValue);
						}
						if(NEWS_DATE.equals(paramKey)){
							news.setNewsTime(parmaValue);
						}
						if(NEWS_TYPE.equals(paramKey)){
							news.setNewsType(parmaValue);
						}
						if(NEWS_MAINPIC.equals(paramKey)){
							news.setNewsMainPic(parmaValue);
						}
						if(NEWS_CONTENT.equals(paramKey)){
							news.setNewsContent(parmaValue);
						}
					}
					newsList.add(news);
				}
			}
		}
		newsList=filterByType(newsList, type);
	    Collections.sort(newsList, new Comparator<NewsItem>(){
	        @Override
	        public int compare(NewsItem news1, NewsItem news2) {
	            try{
	                SimpleDateFormat df = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss",Locale.ENGLISH);
	                Date d1 = df.parse(news1.getNewsTime());
	                Date d2 = df.parse(news2.getNewsTime());
	                return  d1.compareTo(d2);
	            }catch(Exception e){
	               //do nothing
	            }         
	            return -1;                        
	        }  
	    });
	    
		return newsList;
	}
	
	/**
	 * 按照类型过滤新闻
	 * @param newsList
	 * @param type
	 * @return
	 */
	private static List<NewsItem> filterByType(List<NewsItem> newsList, String type){
		List<NewsItem> typeNews=new ArrayList<NewsItem>();
		if (StringUtils.isBlank(type)){
			typeNews.addAll(newsList);
		}else{
			for(NewsItem news:newsList){
				if(news.getNewsType().equals(type)){
					typeNews.add(news);
				}
			}
		}
		return typeNews;
	}
	
	/**
	 * 过滤获取最近的指定条数的新闻
	 * @param newsList
	 * @param size
	 * @return
	 */
	private static List<NewsItem> filterByPageSize(List<NewsItem> newsList, String size){
		int totalCounts=newsList.size();
		if(StringUtils.isNumeric(size)){
			int pageCount=Integer.valueOf(size);
			if(totalCounts>=pageCount){
				return newsList.subList(0, pageCount);
			}else{
				//不需要截取
				return newsList;
			}
		}
		return newsList;
	}
	
	public static class NewsItem {
		private String newsSource="";
		private String newsAuthor="";
		private String newsTitle="";
		private String newsType="";
		private String newsMainPic="";
		private String newsContent="";
		private String newsTime="";
		private String newsPageUrl="";
		
		public String getNewsSource() {
			return newsSource;
		}

		public void setNewsSource(String newsSource) {
			this.newsSource = newsSource;
		}

		public String getNewsAuthor() {
			return newsAuthor;
		}

		public void setNewsAuthor(String newsAuthor) {
			this.newsAuthor = newsAuthor;
		}

		public String getNewsTitle() {
			return newsTitle;
		}

		public void setNewsTitle(String newsTitle) {
			this.newsTitle = newsTitle;
		}

		public String getNewsType() {
			return newsType;
		}

		public void setNewsType(String newsType) {
			this.newsType = newsType;
		}

		public String getNewsMainPic() {
			return newsMainPic;
		}

		public void setNewsMainPic(String newsMainPic) {
			this.newsMainPic = newsMainPic;
		}

		public String getNewsContent() {
			return newsContent;
		}

		public void setNewsContent(String newsContent) {
			this.newsContent = newsContent;
		}

		public String getNewsTime() {
			return newsTime;
		}

		public void setNewsTime(String newsTime) {
			this.newsTime = newsTime;
		}

		public String getNewsPageUrl() {
			return newsPageUrl;
		}

		public void setNewsPageUrl(String newsPageUrl) {
			this.newsPageUrl = newsPageUrl;
		}
    }
}
