<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="com.bokesoft.myerp.mid.BillMidLib.MBillContext,com.bokesoft.myerp.mid.web.util.WebContext"%>
<%@ page import="com.bokesoft.myerp.common.*,com.bokesoft.myerp.common.rowset.BKRowSet"%>
<%@ taglib uri="/WEB-INF/map-html.tld" prefix="yigo" %>

<div class="span3 aside_left" id="aside_left">
        <h2 class="doc-title"><span>公文管理</span></h2>
 <div class="row">
			  <%
	String ID = request.getParameter("ID");
	if (true){
		MBillContext context = null;
		try {
            context = new MBillContext(request, response);
            context.setAttribute("noAlert", true);
            WebContext.setContext(context);

			LinkedHashMap billKeys = new LinkedHashMap();
			String sql1 = "select * from cp_wf_workflowtype_bill where BillKey in ('OA_SpoFile','OA_ForeignLan') " ;
			int operatorID = context.getEnv().getOperatorID();
			BKRowSet rs;
			rs = context.getDBM().getResultSet(sql1);
			rs.bkBeforeFirst();
			while (rs.bkNext()) {
				int wfid = rs.bkGetInt("WFID");
				String billType = rs.bkGetString("BILLTYPE");
				BKRowSet rs2;
				String sql2="select * from oa_opt a left join oa_optsel b on a.billid = b.billid where a.tag1 = 'START' and tag2='"+billType+"' and a.sourceid = " + wfid;
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
					// 目前这判断了gp_operator、CP_Org_Company、CP_Org_Department三个表，如果有别的表还需要查询别的表
					//组织改为判断CP_Org_Administrative表
					String sql3 = "select ID from ("+
							" Select a.ID From  CP_Org_Administrative a left join gp_operator b on a.id = b.deptid where  a.id in (" + optIDS + ") and b.id=" + operatorID +
							" union all select ID FROM gp_operator where id in (" + optIDS + ") and ID = " + operatorID +
						")";
					//System.out.println(sql3);
					BKRowSet rs3 = context.getDBM().getResultSet(sql3);
					rs3.bkBeforeFirst();
					if (rs3.bkSize() > 0) {
						billKeys.put(rs.bkGetString("BILLKEY"),rs.bkGetString("WORKFLOWNAME"));
					}
				} else { // 如果没有设置权限，默认显示
					billKeys.put(rs.bkGetString("BILLKEY"),rs.bkGetString("WORKFLOWNAME"));
				}
			}
				Iterator i = billKeys.keySet().iterator();
				while(i.hasNext()) {
				String billKey = (String)i.next();
				%>
				<a href="add_document.jsp?type=<%=billKey%>" id="issue_document" class="create_file_btn">
					<%=billKeys.get(billKey)  %>
				</a>
				<%
				}
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
				
					<!--<a class="create_file_btn jb_btn" href="#">创建简报</a>-->

                </div> 		
    <div class="block">
        <dl id="main-menu">
            <dt><span class="gw">审批列表</span></dt>
			<yigo:context>
            <dd class="todoBtns">
				<div class="row">
					<a class="ws-load" href="document_forme.jsp?workflowtype=1&wftype=2">
						<span>待办公文</span>
						<em class="num counter to-do"></em>
					</a>
				</div>
				<div class="row">
					<a class="ws-load" href="document_forread.jsp?workflowtype=3&wftype=2">
						<span>待阅公文</span>
						<em class="num counter to-read"></em>
					</a>
				</div>
				<div class="row">
					<a class="ws-load" href="document_forme.jsp?workflowtype=2&wftype=2">
						<span>退回公文</span>
						<em class="num counter reject"></em>
					</a>
				</div>			
            </dd>
			<dt><span class="yc">已处理文件</span></dt>
            <dd>
                <div class="row">
					<p><a class="ws-load" href="document_forme.jsp?workflowtype=3&wftype=2"><span>已办公文</span></a></p>
					<p><a class="ws-load" href="document_forme.jsp?workflowtype=4&wftype=2"><span>已阅公文</span></a></p>
                </div>
            </dd>
			</yigo:context>
			<dt><span class="gr">个人列表</span></dt>
            <dd>
                <div class="row">
					<p><a class="ws-load" href="document_forme.jsp?workflowtype=5&wftype=2"><span>我发起流程</span></a></p>
					<p><a class="ws-load" href="document_forme.jsp?workflowtype=6&wftype=2"><span>草稿箱</span></a></p>
					<p><a class="ws-load" href="document_query.jsp?wftype=2"><span>公文查询中心</span></a></p>
				</div>
			</dd>
			<dt><span class="hy">环境设置</span></dt>
            <dd>
                <div class="row">
                    <p><a class="ws-load" href="document_agent.jsp"><span>参数设置</span></a></p>
                    <p><a class="ws-load" href="document_agent.jsp"><span>代理设置</span></a></p>
                    <p><a class="ws-load" href="document_commonviews.jsp"><span>常用意见</span></a></p>
                </div>
            </dd>
			
        </dl>
    </div>
	<div class="aside_left_bottom_img"></div>
</div>
