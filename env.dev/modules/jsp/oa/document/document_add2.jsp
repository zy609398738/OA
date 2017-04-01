<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="com.bokesoft.myerp.mid.BillMidLib.MBillContext,com.bokesoft.myerp.mid.web.util.WebContext"%>
<%@ page import="com.bokesoft.myerp.common.*,com.bokesoft.myerp.common.rowset.BKRowSet"%>
<!--新建弹出框  begin-->
<div class="pop" id="pop_creat">
	<a class="close"></a>
	<h4>流程分类</h4>
	<div class="pop_content clearfix pt_20">
			<div class="flowtypes">
				<table>
					<%
						String sql = "select * from CP_WF_WorkflowType where ID != -1 order by orderNum";
						MBillContext context = null;
						try {
							context = new MBillContext(request, response);
							context.setAttribute("noAlert", true);
							WebContext.setContext(context);
							BKRowSet rs;
							rs = context.getDBM().getResultSet(sql);
							rs.bkBeforeFirst();
							while (rs.bkNext()) {
								int id = rs.bkGetInt("ID");
								String name = rs.bkGetString("NAME");
								String code = rs.bkGetString("CODE");
					%>
					<tr>
						<td class="list-title" data-code="<%=code%>">
							<a href="#" data-id="<%=id%>"><%=name%></a>
						</td>
						<td>
							<div class="list-content clearfix" id= "Bill_<%=id%>"></div>
						</td>
					</tr>
					<%
							}
						} catch (Exception ex) {
                            if (context != null) {
                                try {
                                    context.setFail();
                                } catch (Throwable e) {
                                    e.printStackTrace();
                                }
                            }
							DebugUtil.error(ex);
						} finally {
							if (context != null) {
								try {
									context.close();
								} catch (Throwable e) {
									e.printStackTrace();
								}
							}
							WebContext.setContext(null);
						}
				%>
						
					
				</table>
			</div>
			<div id="notes" class="notes">
				</div>			
	</div>
</div>
<script>
    (function(jq){
        jq(function(){
            jq('.flowtypes .list-title a').each(function(){
                var id = jq(this).data('id');
                jq('#Bill_' + id).load('workflow_add_bill.jsp?ID=' + id);
            });

            jq('#pop_creat .close').click(function(){
                jq.fancybox.close(true);
            });
        });

    })(window.jQuery);
</script>