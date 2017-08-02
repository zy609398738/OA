package com.bokesoft.oa.mid;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;

import com.bokesoft.yigo.common.util.TypeConvertor;
import com.bokesoft.yigo.mid.base.DefaultContext;
import com.bokesoft.yigo.mid.service.IExtService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

/**
 * 字符串转为二维码
 * 
 * @author chenbiao
 *
 */
public class StringToQRCode implements IExtService {
	@Override
	public Object doCmd(DefaultContext paramDefaultContext, ArrayList<Object> paramArrayList) throws Throwable {
		return stringToQRCode(paramDefaultContext, TypeConvertor.toString(paramArrayList.get(0)), TypeConvertor.toString(paramArrayList.get(1)));
	}

	/**
	 * 根据列名获得查询内容的下拉字符串
	 * 
	 * @param context
	 *            上下文对象
	 * @param stringText
	 *            字符串
	 * @return 返回文件路径
	 * @throws Throwable
	 */
	public static Boolean stringToQRCode(DefaultContext context, String stringText,String path) throws Throwable {
		Map<EncodeHintType, Object> hints = new HashMap<EncodeHintType, Object>();
		hints.put(EncodeHintType.MARGIN, 0);
		BitMatrix bitMatrix = new QRCodeWriter().encode(stringText, BarcodeFormat.QR_CODE, 256, 256, hints);
		int width = bitMatrix.getWidth();
		int height = bitMatrix.getHeight();
		BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
		for (int x = 0; x < width; x++) {
			for (int y = 0; y < height; y++) {
				image.setRGB(x, y, bitMatrix.get(x, y) == true ? Color.BLACK.getRGB() : Color.WHITE.getRGB());
			}
		}
		
		String QRPath=path.substring(0, path.lastIndexOf("/"));
		ImageIO.write(image, "png", new File("../../modules/yigo2/Data/"+QRPath+"/QRCode.png"));
		return true;
	}
}
