package com.bokesoft.ecomm.im.orig.viewholder;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.orig.view.BKIMPlayButton;
import com.bokesoft.ecomm.im.android.ui.viewholder.ChatItemHolder;

/**
 * TODO (未实现仅供参考) Audio 类型的消息
 * 聊天页面中的语音 item 对应的 holder
 */
public class IMChatItemAudioHolder extends ChatItemHolder {

  protected BKIMPlayButton playButton;
  protected TextView durationView;

  private static double itemMaxWidth = 0;
  private static int itemMinWidth = 200;

  public IMChatItemAudioHolder(Context context, ViewGroup root, boolean isLeft) {
    super(context, root, isLeft);
  }

  @Override
  public void initView() {
    super.initView();
    if (isLeft) {
      conventLayout.addView(View.inflate(getContext(), R.layout.bkim_chat_item_left_audio_layout, null));
    } else {
      conventLayout.addView(View.inflate(getContext(), R.layout.bkim_chat_item_right_audio_layout, null));
    }
    playButton = (BKIMPlayButton) itemView.findViewById(R.id.chat_item_audio_play_btn);
    durationView = (TextView) itemView.findViewById(R.id.chat_item_audio_duration_view);

    if (itemMaxWidth <= 0) {
      itemMaxWidth = itemView.getResources().getDisplayMetrics().widthPixels * 0.6;
    }
  }

  @Override
  public void bindData(Object o) {
    super.bindData(o);
//    if (o instanceof AVIMAudioMessage) {
//      AVIMAudioMessage audioMessage = (AVIMAudioMessage) o;
//      durationView.setText(String.format("%.0f\"", audioMessage.getDuration()));
//      double duration = audioMessage.getDuration();
//      int width = getWidthInPixels(duration);
//      if (width > 0) {
//        playButton.setWidth(width);
//      }
//
//      String localFilePath = audioMessage.getLocalFilePath();
//      if (!TextUtils.isEmpty(localFilePath)) {
//        playButton.setPath(localFilePath);
//      } else {
//        String path = PathUtils.getAudioCachePath(getContext(), audioMessage.getMessageId());
//        playButton.setPath(path);
//        BKIMLocalCacheUtils.downloadFileAsync(audioMessage.getFileUrl(), path);
//      }
//    }
  }

  private int getWidthInPixels(double duration) {
    if (itemMaxWidth <= 0) {
      return 0;
    }
    double unitWidth = itemMaxWidth / 100;
    if (duration < 2) {
      return itemMinWidth;
    } else if (duration < 10) {
      return itemMinWidth + (int) (unitWidth * 5 * duration);
    } else {
      return itemMinWidth + (int) (unitWidth * 50) + (int) (unitWidth * (duration - 10));
    }
  }
}