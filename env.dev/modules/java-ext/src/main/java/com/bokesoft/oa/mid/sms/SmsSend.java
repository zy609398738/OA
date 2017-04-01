package com.bokesoft.oa.mid.sms;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.ArrayList;

import com.bokesoft.yes.common.util.StringUtil;
import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;

/**
 * 短信发送<br/>
 * 只适用于http://sms3.mobset.com/SDK/Sms_Send.asp短信平台
 * 
 * @author minjian
 * 
 */
public class SmsSend implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return smsSend(paramArrayList);
	}

	/**
	 * 短信发送
	 * 
	 * @param paras
	 *            参数数组
	 * @param paras
	 *            [0] 企业ID，可选参数。如果不附加此参数，将使用默认企业ID。
	 * @param paras
	 *            [1] 登录用户名，可选参数。如果不附加此参数，将使用默认用户名。
	 * @param paras
	 *            [2] 帐号密码，可选参数。如果不附加此参数，将使用默认密码。
	 * @param paras
	 *            [3] 发送目标号码，多个号码可以使用;号分隔，号码不要超过50个，过多号码容易产生超时，从而造成不断重复发送。
	 * @param paras
	 *            [4] 发送的短信内容
	 * @param paras
	 *            [5] 可选参数：扩展号码。如果有，会在发送的特服号后添加上此号码（受不同运营商及不同地区影响，可扩展号码的长度是不定的，
	 *            建议使用前进行不同长度的附加码测试）
	 * @param paras
	 *            [6] 可选参数：定时发送时间。格式为"2005-05-05 12:00:00"
	 * @param paras
	 *            [7] 可选参数：是否以长短信方式发送，为1时是。长短信有以下特点： 1、分开多条发送的短信在手机屏幕上显示的是一整条。
	 *            2、每条拆分的短信最多支持67个字。 3、某些手机可能无法收到或无法显示长短信。 4、小灵通不支持长短信。
	 * @param paras
	 *            [8] 可选参数：是否以弹出窗口方式返回信息，为1时返回，此参数在通过浏览器调用时有用。
	 * @param paras
	 *            [9] 可选参数：发送目标号码的分隔符。
	 * @return 返回发送结果
	 * @throws Throwable
	 */
	public static String smsSend(ArrayList<Object> paras) throws Throwable {
		String corpID = "300607";
		if (paras.size() > 0) {
			if (!StringUtil.isBlankOrNull(paras.get(0))) {
				corpID = TypeConvertor.toString(paras.get(0));
			}
		}
		corpID = "CorpID=" + corpID;

		String loginName = "Admin";
		if (paras.size() > 1) {
			if (!StringUtil.isBlankOrNull(paras.get(1))) {
				loginName = TypeConvertor.toString(paras.get(1));
			}
		}
		loginName = "&LoginName=" + loginName;

		String passwd = "q1w2e3r4";
		if (paras.size() > 2) {
			if (!StringUtil.isBlankOrNull(paras.get(2))) {
				passwd = TypeConvertor.toString(paras.get(2));
			}
		}
		passwd = "&passwd=" + passwd;

		String sendNo = "";
		if (paras.size() > 3) {
			if (!StringUtil.isBlankOrNull(paras.get(3))) {
				sendNo = "&send_no=" + TypeConvertor.toString(paras.get(3));
			}
		}
		if (sendNo.length() <= 0) {
			throw new Error("发送的短信号码不能为空。");
		}

		String msg = "";
		if (paras.size() > 4) {
			if (!StringUtil.isBlankOrNull(paras.get(4))) {
				msg = "&msg=" + URLEncoder.encode(TypeConvertor.toString(paras.get(4)), "GBK");
			}
		}
		if (msg.length() <= 0) {
			throw new Error("发送的短信内容不能为空。");
		}

		String addNum = "";
		if (paras.size() > 5) {
			if (!StringUtil.isBlankOrNull(paras.get(5))) {
				addNum = "&AddNum=" + TypeConvertor.toString(paras.get(5));
			}
		}
		String timer = "";
		if (paras.size() > 6) {
			if (!StringUtil.isBlankOrNull(paras.get(6))) {
				timer = "&Timer=" + TypeConvertor.toString(paras.get(6));
			}
		}
		String longSms = "";
		if (paras.size() > 7) {
			if (!StringUtil.isBlankOrNull(paras.get(7))) {
				longSms = "&LongSms=" + TypeConvertor.toString(paras.get(7));
			}
		}
		String retMsg = "";
		if (paras.size() > 8) {
			if (!StringUtil.isBlankOrNull(paras.get(8))) {
				retMsg = "&RetMsg=" + TypeConvertor.toString(paras.get(8));
			}
		}

		String sendSplit = "";
		if (paras.size() > 9) {
			if (!StringUtil.isBlankOrNull(paras.get(9))) {
				sendSplit = TypeConvertor.toString(paras.get(9));
				sendNo = StringUtil.replaceAll(sendNo, sendSplit, ";");
			}
		}
		// String contexts =
		// "陈华腾2007第一个月成绩:语文89数学104英语97物理0化学0生物97政治97历史100地理96总分0";
		String urls = "http://sms3.mobset.com/SDK/Sms_Send.asp?" + corpID + loginName + passwd + sendNo + msg + addNum
				+ timer + longSms + retMsg;
		String txt = SMSsend(urls);
		System.out.print("短信发送结果:" + txt);
		return txt;
	}

	public static String SMSsend(String url) throws Throwable {
		String result = "";
		// try {

		URL U = new URL(url);
		URLConnection connection = U.openConnection();
		connection.connect();
		BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
		String line;
		while ((line = in.readLine()) != null) {
			result += line;
		}
		in.close();
		// } catch (Exception e) {
		// System.out.println("没有结果！" + e);
		// result = "产生异常";
		// }
		return result;
	}
}
