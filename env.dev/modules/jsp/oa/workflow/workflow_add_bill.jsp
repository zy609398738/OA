<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="com.bokesoft.myerp.mid.BillMidLib.MBillContext,com.bokesoft.myerp.mid.web.util.WebContext"%>
<%@ page import="com.bokesoft.myerp.common.*,com.bokesoft.myerp.common.rowset.BKRowSet"%>
<%@ page import="com.bokesoft.myerp.common.datatype.VariantConvertor"%>
<%
	String ID = request.getParameter("ID");
	if (!StringUtil.isBlankOrNull(ID)){
		MBillContext context = null;
		try {
            context = new MBillContext(request, response);
            context.setAttribute("noAlert", true);
            WebContext.setContext(context);

			LinkedHashMap billKeys = new LinkedHashMap();
			int corpID=context.getEnv().getCorpID();
			String sql1 = "select * from cp_wf_workflowtype_bill where id = " + ID + " order by orderNum";
			int operatorID = context.getEnv().getOperatorID();
			BKRowSet rs;
			rs = context.getDBM().getResultSet(sql1);
			rs.bkBeforeFirst();
			while (rs.bkNext()) {
				int wfid = rs.bkGetInt("WFID");
				String billType = rs.bkGetString("BILLTYPE");
				BKRowSet rs2;
				String sql2="select * from oa_opt a left join oa_optsel b on a.billid = b.billid where a.tag1 = 'START' and tag2='"+billType+"' and tag3='"+corpID+"' and a.sourceid = " + wfid;
				rs2 = context.getDBM().getResultSet(sql2);
				rs2.bkBeforeFirst();
				// 如果设置了权限，需要判断当前用户是否有权限
				if (rs2.bkSize() > 0 ) {
					String optIDS = "";
					while (rs2.bkNext()) {
						int optID = rs2.bkGetInt("OPTID");
						optIDS += optID + ",";
					}
					optIDS = optIDS.substring(0,optIDS.length() - 1);
					if (optIDS.equals("0")) {
						//选择人员后再删除，在oa_optsel表会保留OPTID字段为空的值bkGetInt后取值为0，此时应认为没做权限限制 by zr in 2014-9-2
						billKeys.put(rs.bkGetString("BILLKEY"),rs.bkGetString("WORKFLOWNAME"));
						continue;
					}
					// 目前这判断了gp_operator、CP_Org_Company、CP_Org_Department三个表，如果有别的表还需要查询别的表
					//组织改为判断CP_Org_Administrative表
					//String sql3 = "select ID from ("+
					//		" Select a.ID From  CP_Org_Administrative a left join gp_operator b on a.id = b.deptid where  a.id in (" + optIDS + ") and b.id=" + operatorID +
					//		" union all select ID FROM gp_operator where id in (" + optIDS + ") and ID = " + operatorID +
					//	")";
					//上面的注释掉，权限改为统一调用获得查询操作员ID的Sql的公式
					String exp="wf.WorkFlowAction.GetOperatorSql("+wfid+",{START},{"+billType+"},"+corpID+")";
					String sql3=VariantConvertor.toString(context.evaluate(exp, "执行获得查询操作员ID的Sql公式"));
					sql3=sql3 + " And ID = " + operatorID;
					BKRowSet rs3 = context.getDBM().getResultSet(sql3);
					rs3.bkBeforeFirst();
					if (rs3.bkSize() > 0) {
						billKeys.put(rs.bkGetString("BILLKEY"),rs.bkGetString("WORKFLOWNAME"));
					}
				} else { // 如果没有设置权限，默认显示
					billKeys.put(rs.bkGetString("BILLKEY"),rs.bkGetString("WORKFLOWNAME"));
				}
			}
			%>
			<div id="doc-create-bill-<%=ID%>" class="in_cont" style="display:block;">
			<%
				Iterator i = billKeys.keySet().iterator();
				while(i.hasNext()) {
				String billKey = (String)i.next();
			%>
				<a href="workflow_add.jsp?type=<%=billKey%>" class="doc-create-bill">
					<%=billKeys.get(billKey)  %>
				</a>
			<%
				}
			%>
			</div>
			<%
			context.setComplete();
		}catch(Throwable ex){
            if (context != null) {
                try {
                    context.setFail();
                } catch (Throwable e) {
                    e.printStackTrace();
                }
            }
			DebugUtil.error(ex);
		}finally {
			if (context != null) {
				try {
					context.close();
				} catch (Throwable e) {
					e.printStackTrace();
				}
			}
			WebContext.setContext(null);
		}
	}	
%>
<script>
    (function(jq) {
        jq(function(){
            jq('.doc-create-bill').loadToWorkspace();
        })
    })(window.jQuery);

</script>