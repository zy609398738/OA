package com.bokesoft.ecomm.im.orig.view;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.drawable.AnimationDrawable;
import android.util.AttributeSet;
import android.view.View;
import android.widget.TextView;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.orig.utils.BKIMAudioHelper;

/**
 * Created by lzw on 14-9-22.
 * 语音播放按钮
 */
public class BKIMPlayButton extends TextView implements View.OnClickListener {
  private String path;
  private boolean leftSide;
  private AnimationDrawable anim;

  public BKIMPlayButton(Context context, AttributeSet attrs) {
    super(context, attrs);
    leftSide = getLeftFromAttrs(context, attrs);
    setLeftSide(leftSide);
    setOnClickListener(this);
  }

  /**
   * 设置语音按钮的方向
   * 因为聊天中左右 item 都可能有语音
   *
   * @param leftSide
   */
  public void setLeftSide(boolean leftSide) {
    this.leftSide = leftSide;
    stopRecordAnimation();
  }

  private boolean getLeftFromAttrs(Context context, AttributeSet attrs) {
    TypedArray typedArray = context.obtainStyledAttributes(attrs, R.styleable.bkim_chat_play_button);
    boolean left = true;
    for (int i = 0; i < typedArray.getIndexCount(); i++) {
      int attr = typedArray.getIndex(i);
      if (attr == R.styleable.bkim_chat_play_button_left) {
        left = typedArray.getBoolean(attr, true);
      }
    }
    return left;
  }

  /**
   * 设置语音文件位置
   *
   * @param path
   */
  public void setPath(String path) {
    this.path = path;
    stopRecordAnimation();
    if (isPlaying()) {
      BKIMAudioHelper.getInstance().addFinishCallback(new BKIMAudioHelper.AudioFinishCallback() {
        @Override
        public void onFinish() {
          stopRecordAnimation();
        }
      });
      startRecordAnimation();
    }
  }

  private boolean isPlaying() {
    return BKIMAudioHelper.getInstance().isPlaying() == true &&
      BKIMAudioHelper.getInstance().getAudioPath().equals(path);
  }

  @Override
  public void onClick(View v) {
    if (BKIMAudioHelper.getInstance().isPlaying() == true &&
      BKIMAudioHelper.getInstance().getAudioPath().equals(path)) {
      BKIMAudioHelper.getInstance().pausePlayer();
      stopRecordAnimation();
    } else {
      BKIMAudioHelper.getInstance().playAudio(path);
      BKIMAudioHelper.getInstance().addFinishCallback(new BKIMAudioHelper.AudioFinishCallback() {
        @Override
        public void onFinish() {
          stopRecordAnimation();
        }
      });
      startRecordAnimation();
    }
  }

  /**
   * 开始播放语音动画
   */
  private void startRecordAnimation() {
    setCompoundDrawablesWithIntrinsicBounds(leftSide ? R.drawable.bkim_chat_anim_voice_left : 0,
      0, !leftSide ? R.drawable.bkim_chat_anim_voice_right : 0, 0);
    anim = (AnimationDrawable) getCompoundDrawables()[leftSide ? 0 : 2];
    anim.start();
  }

  /**
   * 停止播放语音动画
   */
  private void stopRecordAnimation() {
    setCompoundDrawablesWithIntrinsicBounds(leftSide ? R.drawable.bkim_chat_voice_right3 : 0,
      0, !leftSide ? R.drawable.bkim_chat_voice_left3 : 0, 0);
    if (anim != null) {
      anim.stop();
    }
  }
}