package com.bokesoft.ecomm.im.orig.view;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.DialogInterface.OnDismissListener;
import android.graphics.Color;
import android.media.MediaRecorder;
import android.os.Handler;
import android.os.Message;
import android.util.AttributeSet;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager.LayoutParams;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;
import java.io.IOException;

import com.bokesoft.ecomm.im.android.R;
import com.bokesoft.ecomm.im.android.utils.PathUtils;
import com.bokesoft.ecomm.im.android.utils.LogUtils;


/**
 * 录音的按钮
 */
public class BKIMRecordButton extends Button {
  public static final int BACK_RECORDING = R.drawable.bkim_chat_voice_bg_pressed;
  public static final int BACK_IDLE = R.drawable.bkim_chat_voice_bg;
  public static final int SLIDE_UP_TO_CANCEL = 0;
  public static final int RELEASE_TO_CANCEL = 1;
  private static final int MIN_INTERVAL_TIME = 1000;
  private static int[] recordImageIds = {R.drawable.bkim_record_icon_voice0,
    R.drawable.bkim_record_icon_voice1, R.drawable.bkim_record_icon_voice2,
    R.drawable.bkim_record_icon_voice3, R.drawable.bkim_record_icon_voice4,
    R.drawable.bkim_record_icon_voice5};
  private TextView textView;
  private String outputPath = null;
  private RecordEventListener recordEventListener;
  private long startTime;
  private Dialog recordIndicator;
  private View view;
  private MediaRecorder recorder;
  private ObtainDecibelThread thread;
  private Handler volumeHandler;
  private ImageView imageView;
  private int status;
  private OnDismissListener onDismiss = new OnDismissListener() {

    @Override
    public void onDismiss(DialogInterface dialog) {
      stopRecording();
    }
  };

  public BKIMRecordButton(Context context) {
    super(context);
    init();
  }

  public BKIMRecordButton(Context context, AttributeSet attrs, int defStyle) {
    super(context, attrs, defStyle);
    init();
  }

  public BKIMRecordButton(Context context, AttributeSet attrs) {
    super(context, attrs);
    init();
  }

  public void setSavePath(String path) {
    outputPath = path;
  }

  public void setRecordEventListener(RecordEventListener listener) {
    recordEventListener = listener;
  }

  private void init() {
    volumeHandler = new ShowVolumeHandler();
    setBackgroundResource(BACK_IDLE);
  }

  @Override
  public boolean onTouchEvent(MotionEvent event) {
    if (outputPath == null)
      return false;
    int action = event.getAction();
    switch (action) {
      case MotionEvent.ACTION_DOWN:
        startRecord();
        break;
      case MotionEvent.ACTION_UP:
        if (status == RELEASE_TO_CANCEL) {
          cancelRecord();
        } else {
          finishRecord();
        }
        break;
      case MotionEvent.ACTION_MOVE:
        if (event.getY() < 0) {
          status = RELEASE_TO_CANCEL;
        } else {
          status = SLIDE_UP_TO_CANCEL;
        }
        setTextViewByStatus();
        break;
      case MotionEvent.ACTION_CANCEL:
        cancelRecord();
        break;
      default:
        break;
    }
    return true;
  }

  public int getColor(int id) {
    return getContext().getResources().getColor(id);
  }

  private void setTextViewByStatus() {
    if (status == RELEASE_TO_CANCEL) {
      textView.setTextColor(getColor(R.color.bkim_commom_read));
      textView.setText(R.string.bkim_chat_record_button_releaseToCancel);
    } else if (status == SLIDE_UP_TO_CANCEL) {
      textView.setTextColor(Color.WHITE);
      textView.setText(R.string.bkim_chat_record_button_slideUpToCancel);
    }
  }

  private void startRecord() {
    initRecordDialog();
    startTime = System.currentTimeMillis();
    setBackgroundResource(BACK_RECORDING);
    startRecording();
    recordIndicator.show();
  }

  private void initRecordDialog() {
    if (null == recordIndicator) {
      recordIndicator = new Dialog(getContext(), R.style.bkim_record_dialog_style);
      view = inflate(getContext(), R.layout.bkim_chat_record_layout, null);
      imageView = (ImageView) view.findViewById(R.id.imageView);
      textView = (TextView) view.findViewById(R.id.textView);
      recordIndicator.setContentView(view, new LayoutParams(
        ViewGroup.LayoutParams.WRAP_CONTENT,
        ViewGroup.LayoutParams.WRAP_CONTENT));
      recordIndicator.setOnDismissListener(onDismiss);

      LayoutParams lp = recordIndicator.getWindow().getAttributes();
      lp.gravity = Gravity.CENTER;
    }
  }

  private void removeFile() {
    File file = new File(outputPath);
    if (file.exists()) {
      file.delete();
    }
  }

  private void finishRecord() {
    stopRecording();
    recordIndicator.dismiss();
    setBackgroundResource(BACK_IDLE);

    long intervalTime = System.currentTimeMillis() - startTime;
    if (intervalTime < MIN_INTERVAL_TIME) {
      Toast.makeText(getContext(), getContext().getString(R.string.bkim_chat_record_button_pleaseSayMore), Toast.LENGTH_SHORT).show();
      removeFile();
      return;
    }

    int sec = Math.round(intervalTime * 1.0f / 1000);
    if (recordEventListener != null) {
      recordEventListener.onFinishedRecord(outputPath, sec);
    }
  }

  private void cancelRecord() {
    stopRecording();
    setBackgroundResource(BACK_IDLE);
    recordIndicator.dismiss();
    Toast.makeText(getContext(), getContext().getString(R.string.bkim_chat_cancelRecord),
      Toast.LENGTH_SHORT).show();
    removeFile();
  }

  private void startRecording() {
    outputPath = PathUtils.getRecordPathByCurrentTime(getContext());
    try {
      if (recorder == null) {
        recorder = new MediaRecorder();
        recorder.setAudioSource(MediaRecorder.AudioSource.DEFAULT);
        recorder.setOutputFormat(MediaRecorder.OutputFormat.DEFAULT);
        recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
        recorder.setOutputFile(outputPath);
        recorder.prepare();
      } else {
        recorder.reset();
        recorder.setOutputFile(outputPath);
      }
      recorder.start();
      thread = new ObtainDecibelThread();
      thread.start();
      recordEventListener.onStartRecord();
    } catch (IOException e) {
      LogUtils.logException(e);
    }
  }

  private void stopRecording() {
    if (thread != null) {
      thread.exit();
      thread = null;
    }
    if (recorder != null) {
      try {
        recorder.stop();
      } catch (Exception e) {
      } finally {
        recorder.release();
        recorder = null;
      }
    }
  }

  public interface RecordEventListener {
    public void onFinishedRecord(String audioPath, int secs);

    void onStartRecord();
  }

  private class ObtainDecibelThread extends Thread {
    private volatile boolean running = true;

    public void exit() {
      running = false;
    }

    @Override
    public void run() {
      while (running) {
        try {
          Thread.sleep(200);
        } catch (InterruptedException e) {
          LogUtils.logException(e);
        }
        if (recorder == null || !running) {
          break;
        }
        int x = recorder.getMaxAmplitude();
        if (x != 0) {
          int f = (int) (10 * Math.log(x) / Math.log(10));
          int index = (f - 18) / 5;
          if (index < 0) index = 0;
          if (index > 5) index = 5;
          volumeHandler.sendEmptyMessage(index);
        }
      }
    }

  }

  class ShowVolumeHandler extends Handler {
    @Override
    public void handleMessage(Message msg) {
      imageView.setImageResource(recordImageIds[msg.what]);
    }
  }
}
