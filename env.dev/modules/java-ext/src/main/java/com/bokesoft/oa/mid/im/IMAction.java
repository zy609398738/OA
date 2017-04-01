package com.bokesoft.oa.mid.im;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpSession;

import jodd.servlet.ServletUtil;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSON;
import com.bokesoft.cms2.core.ctx.CmsActionContext;
import com.bokesoft.cms2.core.ctx.CmsRequestContext;
import com.bokesoft.r2.cms2.adapter.yigo2.support.Yigo2MidExp;
import com.bokesoft.r2.cms2.adapter.yigo2.tools.Yigo2Helper;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.connection.IDBManager;
import com.bokesoft.yigo.struct.datatable.DataTable;

/**
 * IM对应调用数据的方法
 * 
 * @author minjian
 *
 */
public class IMAction {
	/**
	 * 头像相对地址
	 */
	public final static String ImagePath = "a/cms2-yigo2-adapter/cms/view-yigo-file";

	/**
	 * 返回当前用户身份认证信息的服务(相对)地址; 返回数据格式: { userCode: "XXXX", //当前用户的编号 userName:
	 * "XXXX", //当前用户的名称(用于显示) userIcon: /..." //当前用户的头像, 相对或者绝对 URL userToken:
	 * "XXXX" //token令牌 }
	 * 
	 * @throws Throwable
	 */
	public static void identity(DefaultContext context) throws Throwable {
		CmsActionContext ctx = CmsRequestContext.getThreadInstance(CmsActionContext.class);
		IDBManager dbm = context.getDBManager();
		Long operatorId = Yigo2MidExp.GetLoginOperator();
		String userSql = "select o.code,o.name,e.Photo as  ICON from sys_operator o join OA_Employee_H e on e.oid=o.empid where o.oid=?";
		DataTable dt = dbm.execPrepareQuery(userSql, operatorId);
		if (dt.size() <= 0) {
			userSql = "select o.code,o.name,''  ICON from sys_operator o where o.oid=?";
			dt = dbm.execPrepareQuery(userSql, operatorId);
		}
		Map<String, String> result = new HashMap<String, String>();
		if (operatorId != null && operatorId > 0) {
			result.put("userCode", dt.getString("code"));
			result.put("userName", dt.getString("name"));
			String icon = getIcon(dt);
			result.put("userIcon", icon);
		} else {
			result.put("userCode", dt.getString("code"));
			result.put("userName", "");
			result.put("userIcon", "");
		}

		// FIXME 通知IM服务器存储该用户的Token
		HttpSession currSession = ctx.getRequest().getSession(false);
		result.put("userToken", currSession != null ? currSession.getId() : "");
		// 通知IM服务器存储该用户的Token
		// Env env = context.getEnv();
		// String clientID = env.getClientID();
		// FIXME 以后应该改为直接从context中获取clientID
		Cookie cookie = ServletUtil.getCookie(ctx.getRequest(), Yigo2Helper.YIGO2_CLIENT_ID);
		String cookie_clientID = cookie.getValue();
		result.put("userToken", cookie_clientID);

		ctx.setData(result);
		ctx.setViewer("json");
	}

	/**
	 * 返回用户信息的服务(相对)地址: 因为 messager 的 websocket 服务器不保留用户信息,
	 * 因此客户端需要通过这个服务获取相关的用户信息; 请求的数据格式: {users: [userCode1, userCode2, ...]}
	 * 返回数据格式: { “XXXX": { //以用户的 code 为 key name: "XXXX", //用户名称(用于显示) icon:
	 * "/.../user01.png", //用户的头像, 相对或者绝对 URL }, ... }
	 * 
	 * @throws Throwable
	 */
	public static void userinfo(DefaultContext context) throws Throwable {
		CmsActionContext ctx = CmsRequestContext.getThreadInstance(CmsActionContext.class);
		String users = (String) ctx.getVar("users");
		Map<String, Map<String, String>> result = getUserInfo(context, users);
		ctx.setData(result);
		ctx.setViewer("json");
	}

	private static Map<String, Map<String, String>> getUserInfo(DefaultContext context, String users) throws Throwable {
		IDBManager dbm = context.getDBManager();
		Map<String, Map<String, String>> result = new HashMap<String, Map<String, String>>();
		if (StringUtils.isBlank(users)) {
			return result;
		}
		List<String> codeList = JSON.parseArray(users, String.class);
		int codeSize = codeList.size();
		if (codeSize <= 0) {
			return result;
		}
		List<String> varList = new ArrayList<String>();
		for (int i = 0; i < codeSize; i++) {
			varList.add("?");
		}
		// String sql = "SELECT * FROM ("+
		// " SELECT CONCAT(ID, '') AS CODE, CASE"+
		// " WHEN TRIM(IFNULL(MemberNickName,''))<>'' THEN MemberNickName"+
		// " WHEN TRIM(IFNULL(`Name`,''))<>'' THEN `Name`"+
		// " WHEN TRIM(IFNULL(Email,''))<>'' THEN Email"+
		// " WHEN TRIM(IFNULL(`Code`,''))<>'' THEN `Code`"+
		// " ELSE ID"+
		// " END AS NAME"+
		// " FROM cp_ec01_member_basicinfo"+
		// " UNION"+
		// " SELECT CONCAT(BillDtlID, '') AS CODE, CASE"+
		// " WHEN TRIM(IFNULL(OperatorNickName,''))<>'' THEN OperatorNickName"+
		// " WHEN TRIM(IFNULL(OperatorName,''))<>'' THEN OperatorName"+
		// " WHEN TRIM(IFNULL(OperatorAccount,''))<>'' THEN OperatorAccount"+
		// " ELSE BillDtlID"+
		// " END AS NAME"+
		// " FROM cp_ec01_store_operator"+
		// ") U "+
		// " WHERE U.CODE IN (" + StringUtils.join(varList, ", ") + ")";
		String codeStr = StringUtils.join(varList, ", ");
		String sql = "select o.code,o.name,e.Photo as  ICON from sys_operator o join OA_Employee_H e on e.oid=o.empid where o.oid in("
				+ codeStr + ")";
		DataTable dt = dbm.execPrepareQuery(sql, codeList.toArray());
		if (dt.size() <= 0) {
			sql = "select o.code,o.name from sys_operator o where o.oid in(" + codeStr + ")";
			dt = dbm.execPrepareQuery(sql, codeList.toArray());
		}
		dt.beforeFirst();
		while (dt.next()) {
			Map<String, String> user = new HashMap<String, String>();
			String code = dt.getString("code");
			String name = dt.getString("name");
			// String sqlIcon = " SELECT AVATARPICTURE as ICON FROM
			// cp_ec01_member_basicinfo where id = ?";
			// DataTable iconDt = dbm.execPrepareQuery(sqlIcon, new
			// Object[]{code});
			// iconDt.beforeFirst();
			// while(iconDt.next()){
			// icon = iconDt.getString("ICON");//FIXME 头像相对地址未添加
			// }
			user.put("name", name);

			String icon = getIcon(dt);
			user.put("icon", icon);
			result.put(code, user);
		}
		return result;
	}

	/**
	 * 根据数据获得用户头像图片地址
	 * 
	 * @param dt
	 *            数据集
	 * @return 用户头像图片地址
	 */
	private static String getIcon(DataTable dt) {
		String icon = dt.getString("ICON");
		if (icon == null) {
			icon = "";
		}
		if (icon.length() > 0) {
			icon = ImagePath + File.separator + dt.getString("ICON");
		}
		return icon;
	}

	/**
	 * 返回聊天伙伴信息的服务(相对)地址: 聊天伙伴及其分组信息; 返回数据格式: [{ groupName: "XXXX", //分组名称
	 * users: [{ //分组包含的用户 code: "XXXX", //用户 code name: "XXXX", //用户名称(用于显示)
	 * icon: "/.../user01.png", //用户的头像, 相对或者绝对 URL }, ...] }, ...]
	 * 
	 * @throws Throwable
	 */
	@SuppressWarnings("unchecked")
	public static void buddies(DefaultContext context) throws Throwable {
		IDBManager dbm = context.getDBManager();
		List<Object> groupList = new ArrayList<Object>();
		CmsActionContext ctx = CmsRequestContext.getThreadInstance(CmsActionContext.class);

		// Long operatorId = Yigo2MidExp.GetLoginOperator();

		// String sql = "SELECT * FROM ("+
		// " SELECT"+
		// " (SELECT MemberID FROM cp_ec01_store_basicinfo WHERE ID=C.ID) AS
		// MemberID,"+
		// " CASE "+
		// " WHEN G.ID<=0 THEN '(未分组)'"+
		// " ELSE G.`NAME`"+
		// " END AS GROUPNAME,"+
		// " CONCAT(C.ClientID, '') AS CODE, "+
		// " CASE"+
		// " WHEN TRIM(IFNULL(M.MemberNickName,''))<>'' THEN M.MemberNickName"+
		// " WHEN TRIM(IFNULL(M.`Name`,''))<>'' THEN M.`Name`"+
		// " WHEN TRIM(IFNULL(M.Email,''))<>'' THEN M.Email"+
		// " WHEN TRIM(IFNULL(M.`Code`,''))<>'' THEN M.`Code`"+
		// " ELSE M.ID"+
		// " END AS NAME,"+
		// " M.AVATARPICTURE as ICON"+
		// " FROM CP_EC40_StoreCustomer C, cp_ec01_member_basicinfo M,
		// cp_ec01_member_category G"+
		// " WHERE C.ClientID=M.ID AND C.categoryID=G.ID"+
		// " ORDER BY C.ID, IF(G.ID>0,G.CODE,'~')"+
		// ") CAT"+
		// " WHERE MemberID=?";
		String sql = "select o.code,o.name,e.Photo as  ICON,d.name as GROUPNAME from sys_operator o join OA_Employee_H e on e.oid=o.empid join OA_Department_H d on d.OID=o.DeptID where o.oid>0 and o.enable=1 and e.oid>0 and e.enable=1 and d.oid>0 and d.enable=1";
		DataTable dt = dbm.execPrepareQuery(sql);
		// String sqlBlack = "select m.ID as CODE,m.name as NAME,m.AvatarPicture
		// as ICON FROM "+
		// " (SELECT b.MemberID as UserCode,s.MemberID as StoreCode "+
		// " from ec40_blacklist b,cp_ec01_store_basicinfo s"+
		// " WHERE b.SourceStoreID=s.ID "+
		// " AND s.MemberID=?)"+
		// " as t,cp_ec01_member_basicinfo m "+
		// " WHERE t.UserCode = m.ID";
		// DataTable blackDt = dbm.execPrepareQuery(sqlBlack, operatorId);
		// List<Map<String, String>> usersBlack = new
		// ArrayList<Map<String,String>>();
		// blackDt.beforeFirst();
		// while(blackDt.next()){
		// Map<String, String> userBlack = new HashMap<String, String>();
		// userBlack.put("code", blackDt.getString("CODE"));
		// userBlack.put("name", blackDt.getString("NAME"));
		// String icon = blackDt.getString("ICON");
		// if(icon!=null&&!icon.equals("")){
		// icon = "/$img/" + icon;
		// userBlack.put("icon", icon); //FIXME 头像相对地址未添加
		// }
		// usersBlack.add(userBlack);
		// }
		Map<String, Map<String, Object>> groups = new HashMap<String, Map<String, Object>>();
		Map<String, Object> group = new HashMap<String, Object>();
		dt.beforeFirst();
		while (dt.next()) {
			String groupName = dt.getString("GROUPNAME");
			group = groups.get(groupName);
			if (null == group) {
				group = new HashMap<String, Object>();
				group.put("groupName", groupName);
				group.put("users", new ArrayList<Map<String, String>>());
				groups.put(groupName, group);
				groupList.add(group);
			}
			List<Map<String, String>> users = (List<Map<String, String>>) group.get("users");
			Map<String, String> user = new HashMap<String, String>();
			// if(usersBlack.size()>0){
			// boolean isNotRepeat = true;
			// for(int i=0;i<usersBlack.size();i++){
			// if(usersBlack.get(i).get("code").equals(dt.getString("CODE"))){
			// isNotRepeat = false;
			// }
			// }
			// if(isNotRepeat){
			// user.put("code", dt.getString("CODE"));
			// user.put("name", dt.getString("NAME"));
			// String icon = dt.getString("ICON");
			// if(icon!=null&&!icon.equals("")){
			// icon = "/$img/" + icon;
			// user.put("icon", icon); //FIXME 头像相对地址未添加
			// }
			// users.add(user);
			// }
			// }else{
			user.put("code", dt.getString("code"));
			user.put("name", dt.getString("name"));
			String icon = getIcon(dt);
			user.put("icon", icon);
			users.add(user);
			// }
		}
		// if(usersBlack.size()>0){
		// group = groups.get("黑名单");
		// if(null==group){
		// group = new HashMap<String, Object>();
		// group.put("groupName","黑名单");
		// group.put("groupType", "blacklist");
		// group.put("users", usersBlack);
		// groups.put("黑名单", group);
		// groupList.add(group);
		// }
		// }
		ctx.setData(groupList);
		ctx.setViewer("json");
	}
	//
	// private String choiceNotBlank(String ... str){
	// for (int i = 0; i < str.length; i++) {
	// String s = str[i];
	// if (StringUtils.isNotBlank(s)){
	// return s;
	// }
	// }
	// return "";
	// }
}
