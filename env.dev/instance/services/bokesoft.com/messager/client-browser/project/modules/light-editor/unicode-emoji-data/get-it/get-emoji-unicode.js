/** The data structure to store every kinds of emoji images urls */
var emojiData = [];
var emojiCssAndroid = [];
var emojiCssApple = [];
var emojiCssSamsung = [];

/** The emoji in OPPO */
var emojiOPPO = "😊😍😘😳😡😓😲😭😁😱😖😉😏😜😰😢😚😄😪😣😔😠😌😝😂😥😃😨😒😷😞👿👽👀👃👄👂❤💔💘💝💜💛💚💙💩👍👎👊✌👌💪👆👇👈👉✊👐🙏🙌👏👧👦👩👨👶👵👴👳👲👱👸👷💂👮🙆🙅💇💆💁👯👫🎎🚶🏃💃💑💏👼💀🐱🐶🐭🐹🐰🐺🐸🐯🐨🐻🐷🐮🐗🐵🐴🐍🐦🐔🐧🐛🐙🐠🐳🐬☀☔🌙✨⭐⚡☁⛄🌊❗❓💤💦🎵🔥🌹🌺🌻🌷🌸💐🍀🌾🍃🍂🍁🎍🌴🌵🎅👻🎃🎄🔔🎉🎈💿📷🎥💻📺🔓🔒🔑💡📬🛀💰🔫💊💣⚽🏈🏀🎾🎿🏄🏊🏆👾🎤🎸👙👑🌂👜💄💅💍🎁💎☕🎂🍰🍺🍻🍸🍵🍶🍔🍟🍝🍜🍧🍦🍡🍙🍘🍞🍛🍚🍲🍱🍣🍎🍓🍉🍆🍅🍊🚀🚄🚉🚃🚗🚕🚓🚒🚑🚙🚲🏁🚹🚺⭕❌";


/**
 * Get url of emoji from http://unicode.org/emoji/charts/full-emoji-list.html (Full Emoji Data, v3.0)
 *
 *  - Open "get-it/Full Emoji Data, v3.0/index.html" in Chrome;
 *  - F12 to show development tools
 *  - Run this javascript in Console.
 */

var trList = $("table").children[0].children;

var _findImageUrl = function(emoji){
    var size = trList.length;
    for (var i=0; i<size; i++){
        var tr = trList[i];
        //Test TH or TD
        var c0Tag = tr.children[0].tagName;
        if ("TD"==c0Tag){   //It's data line
            var char = tr.children[2].innerText;
            if (char==emoji){
                return {
                    images: {
                        chart:      tr.children[3].children[0].src,
                        apple:      tr.children[4].children[0].src,
                        android:    tr.children[5].children[0].src,
                        twitter:    tr.children[6].children[0].src,
                        htc:        tr.children[7].children[0].src,
                        facebook:   tr.children[8].children[0].src,
                        windows:    tr.children[9].children[0].src,
                        samsung:    tr.children[10].children[0].src
                    },
                    name: tr.children[15].innerText
                };
            }
        }
    }
    return null;
}

//Can't use emojiOPPO.charAt(...) because of unicode
var index = 0;
for (let emoji of emojiOPPO ) {
    index ++;
    console.info("["+index+"]==> ", emoji);
    var result = _findImageUrl(emoji);
    if (!result){
        throw "Can't find images for '"+emoji+"'!"
    }

    var className = "light-editor-emojiface" + index;
    emojiData.push({
        char: emoji,
        name: result.name,
        className: className
    });

    var _buildCss = function(emoji, className, imgType){
    	var imgUrl = result.images[imgType];
    	
    	//Resize to 30*30
    	var img = new Image();
    	img.src = imgUrl;
    	var canvas = document.createElement("canvas");
    	canvas.width = 30;
    	canvas.height = 30;
    	var ctx = canvas.getContext("2d");
    	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    	imgUrl = canvas.toDataURL("image/png")
    	
        return "/*"+emoji+"*/\n."+className + "-"+imgType + "{\n\tbackground-image: url("+imgUrl+")\n}"
    }
    emojiCssAndroid.push(_buildCss(emoji, className, "android"));
    emojiCssApple.push(_buildCss(emoji, className, "apple"));
    emojiCssSamsung.push(_buildCss(emoji, className, "samsung"));
}

window.localStorage["data.js"] = "/** emoji-data */ module.exports =" + JSON.stringify(emojiData, null, 2) + ";";
window.localStorage["emoji-android.css"] = "/** emoji-css-android */\n" + emojiCssAndroid.join("\n");
window.localStorage["emoji-apple.css"] = "/** emoji-css-apple */\n" + emojiCssApple.join("\n");
window.localStorage["emoji-samsung.css"] = "/** emoji-css-samsung */\n" + emojiCssSamsung.join("\n");

alert("Strip emoji finish, see data javascript and css from localStorage.");
