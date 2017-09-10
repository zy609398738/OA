<smooks-resource-list xmlns="http://www.milyn.org/xsd/smooks-1.1.xsd" xmlns:jb="http://www.milyn.org/xsd/smooks/javabean-1.1.xsd">
<#list freeMarkerData.target as data>
	<jb:bindings beanId="${data.beanId}" class="com.bokesoft.dee.mule.util.CaseInsensitiveHashMap" createOnElement="${data.createOnElement}"> 
 <#list data.listDetail as itemKey>
		    <#if itemKey.class="List"||itemKey.class="Map">
		     <jb:wiring property="${itemKey.beanId}" beanIdRef="${itemKey.beanId}"/>
		     <#elseif (itemKey.class="Date"||itemKey.class="SqlTimeStamp")&&itemKey.format!="">
		     <jb:value property="${itemKey.beanId}" data="${itemKey.createOnElement}" decoder="${itemKey.class}">
		     	<jb:decodeParam name="format">${itemKey.format}</jb:decodeParam>
			 </jb:value>
			 <#elseif (itemKey.class="Date"||itemKey.class="SqlTimeStamp")&&itemKey.format="">
		     <jb:value property="${itemKey.beanId}" data="${itemKey.createOnElement}"/>
			 <#elseif itemKey.class="String">
			 <jb:value property="${itemKey.beanId}" data="${itemKey.createOnElement}"/>
		     <#else>
		     <jb:value property="${itemKey.beanId}" data="${itemKey.createOnElement}" decoder="${itemKey.class}"/>
		     </#if>
 </#list>
	</jb:bindings>
</#list>
<#list freeMarkerData.target2 as data>
	<jb:bindings beanId="${data.beanId}" class="java.util.ArrayList" createOnElement="${data.createOnElement}"> 
		    <jb:wiring beanIdRef="${data.mapDetail.beanId}"/>
	</jb:bindings>
</#list>
</smooks-resource-list>

