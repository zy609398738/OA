<?xml version="1.0" encoding="utf-8"?>
<bokedee_receive_data>
	<receivePackages list="true">
		<#list freeMarkerData as item>
		<receivePackage>
			<#if (item.eventid)?has_content>
			<eventID>${item.eventid}</eventID>
			<#else>
			<eventID></eventID>
			</#if><#if (item.actiontype)?has_content>
			<actionType><![CDATA[${item.actiontype}]]></actionType>
			<#else>
			<actionType></actionType>
			</#if><#if (item.createtime)?has_content>
			<createTime>${item.createtime}</createTime>
			<#else>
			<createTime></createTime>
			</#if><#if (item.expiretime)?has_content>
			<expireTime>${item.expiretime}</expireTime>
			<#else>
			<expireTime></expireTime>
			</#if><#if (item.ssource)?has_content>
			<source><![CDATA[${item.ssource}]]></source>
			<#else>
			<source></source>
			</#if><#if (item.rtarget)?has_content>
			<target><![CDATA[${item.rtarget}]]></target>
			<#else>
			<target></target>
			</#if><#if (item.bizdata2)?has_content>
			<bizData><![CDATA[${item.bizdata2}]]></bizData>
			<#else>
			<bizData></bizData>
			</#if>
		</receivePackage>
		</#list>
	</receivePackages>
</bokedee_receive_data>
