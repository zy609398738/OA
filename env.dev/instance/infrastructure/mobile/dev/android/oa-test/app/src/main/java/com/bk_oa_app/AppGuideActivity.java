package com.bk_oa_app;

import android.app.Activity;
import android.os.Bundle;

import com.bokesoft.yeslibrary.guidepage.GuideActivity;
import com.bokesoft.yeslibrary.guidepage.GuideProxy;

import java.util.ArrayList;

public class AppGuideActivity extends GuideActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        initGuideImage();
        super.onCreate(savedInstanceState);
    }

    private void initGuideImage() {
        int[] imageIDs = BuildConfig.guideImages;
        ArrayList<Integer> imageArray = new ArrayList<>();
        for (int id : imageIDs) {
            imageArray.add(id);
        }
        GuideProxy.getGuideInstance().setImgIds(imageArray);
    }

    @Override
    protected void onSuccess() {
        setResult(Activity.RESULT_OK);
        finish();
    }
}
