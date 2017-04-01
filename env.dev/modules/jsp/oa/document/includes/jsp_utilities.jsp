<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.io.IOException" %>
<%!
    /**
     * 将分页所需要的当前URI<b>x-RequestURI</b>, 分页参数名等分别以<b>x-RequestURI</b>, <b>x-paramName-page</b>设置到request中
     *
     * @param request
     */
    public void setupRequestAttributesForPagination(HttpServletRequest request, String containerCssSelector) {
        String paramNamePage = "page";
        Map<String, ?> params = request.getParameterMap();
        StringBuilder queryString = new StringBuilder();
        for (Map.Entry<String, ?> param : params.entrySet())  {
            if (!param.getKey().equals("page")) {
                Object paramValue = param.getValue();
                if (paramValue instanceof Object[]) {
                    for (Object pValue : (Object[]) paramValue) {
                        queryString.append("&").append(param.getKey()).append("=").append(pValue);
                    }
                } else {
                    queryString.append("&").append(param.getKey()).append("=").append(paramValue);
                }
            }
        }

        String requestUri = request.getRequestURI();
        if (queryString.length() > 0) {
            queryString.setCharAt(0, '?');
            requestUri += queryString.toString();
        }

        request.setAttribute("x-requestURI", requestUri);
        request.setAttribute("x-paramName-page", paramNamePage);
        request.setAttribute("x-container", containerCssSelector);
    }

    private static final Map<String, String> poorBillIndex = new HashMap<String, String>();
    static {
        poorBillIndex.put("fromMeList", "我发起的流程");
        poorBillIndex.put("DoneList", "已办事宜");
        poorBillIndex.put("OADraft","草稿箱");
        poorBillIndex.put("OARead","已阅事项");
    }

    public void setupRequestAttributeForBillMeta(HttpServletRequest request) {
        String billKey = request.getParameter("billKey");
        if (billKey == null || billKey.equals("")) {
            return;
        }

        request.setAttribute("x-billKey", billKey);

        String billName = poorBillIndex.get(billKey);
        if (billName != null && !billName.equals("")) {
            request.setAttribute("x-billName", billName);
        }
    }

    private static String nvl(String value, String defaultValOnNull) {
        return value == null ? defaultValOnNull : value;
    }

    public boolean redirectOnNonAjaxRequest(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!"XMLHttpRequest".equalsIgnoreCase(req.getHeader("X-Requested-With"))){
            try {
                resp.setHeader("X-Forwarded-For", "yes");
                req.getRequestDispatcher("index.jsp").forward(req, resp);
                return true;
            } catch (ServletException e) {
                e.printStackTrace();
            }
        }
        return false;
    }
%>