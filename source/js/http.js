var debug = true

var config = {
    khwOfficialWebsite: 'http://www.kahuanwang.com/',
    commonUrl: '',
    yzmUrl: '',  //生产环境：http://www.kahuanwang.com/sms/m/h，开发环境：http://xfjr.ledaikuan.cn:9191/
    shareUrlPrefix: ''
}

if (debug) {
    config.commonUrl = 'http://xfjr.ledaikuan.cn:9292/ca/c/i';
    config.yzmUrl = 'http://xfjr.ledaikuan.cn:9191/',
    config.shareUrlPrefix = 'http://xfjr.ledaikuan.cn/kahuanwang/activity/source/pages/register.html?ic='
} else {
    config.commonUrl = ''
    config.yzmUrl = ''
    config.shareUrlPrefix = ''
}

/* 
 * 弹框和加载方法
 * Shade.dialog.closeDialog();//关闭对话框
 * Shade.dialog.openDialog();//显示对话框
 * Shade.dialog.dialogTips;//自定义内容
 * Shade.loading.hideLoading();//隐藏加载层
 * Shade.loading.showLoading();//显示加载层
*/
var Shade = {
    dialog : {
        init : function(msg,callback){
            Shade.dialog.closeDialog(callback);
            Shade.dialog.dialogTips(msg);
            Shade.dialog.openDialog();
        },
        openDialog : function(){
            $(".shade").fadeIn().children(".dialog").fadeIn();
            $("html,body").css({"height":"100%","overflow-y":"hidden"});
        },
        closeDialog : function(callback){
            $(".dialog button").one("click",function(){
                $(".shade").fadeOut().children(".dialog").fadeOut();
                $("html,body").css({"height":"auto","overflow-y":"auto"});
                if(callback){
                    callback();
                }
            });
        },
        dialogTips : function(text){
            $(".dialog div[data-role=dialog-content]>p").text(text);
        }
    },
    loading : {
        showLoading : function(){
            $(".shade").show()
            $('.self-indicator-wrapper').show()
            $("html,body").css({"height":"100%","overflow-y":"hidden"});
        },
        hideLoading : function(){
            $(".shade").fadeOut()
            $('.self-indicator-wrapper').fadeOut()
            $("html,body").css({"height":"auto","overflow-y":"auto"});
        }
    }
}

function setAppInfo(appInfo) {
    localStorage.setItem('appInfo', JSON.stringify(appInfo))
}
function getAppInfo() {
    return JSON.parse(localStorage.getItem('appInfo'))

    // return {
    //     aesKey:'1234567812345678',
    //     signKey:'68352e79616e6d616368696e612e636f6d',
    //     ua:'CAIMA_H5_SIGN',
    //     app:'khw',
    //     customerId:'20180313155800000240',
    //     mobileNo: '18701811946'
    // }
}

function doAjaxRequestSign(url, call, data, callback, async) {
    var appInfo = getAppInfo()

    Shade.loading.showLoading()

    var async = true;
    if (async!=undefined) {
        async = async;
    }
    // console.log('是否异步:'+async);

    var ua = appInfo.ua
    var signKey = appInfo.signKey
    var timestamp = new Date().getTime()
    var sign = hex_md5(ua + "&" + call + "&" + timestamp + "&" + signKey);

    var params = JSON.stringify({
        ua: ua,
        call: call,
        args: data,
        sign: sign,
        timestamp: timestamp
    })

    var aesKey = appInfo.aesKey
    var key = CryptoJS.enc.Utf8.parse(aesKey)
    var iv  = CryptoJS.enc.Utf8.parse(aesKey)
    var encrypted = CryptoJS.AES.encrypt(params, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    $.ajax({
        url : url,
        type : 'post',
        data : encrypted.toString(),
        async : async,
        success : function(data){
            Shade.loading.hideLoading()

            var decrypted = CryptoJS.AES.decrypt(data, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            callback(JSON.parse(CryptoJS.enc.Utf8.stringify(decrypted).toString()));
        },
        error : function(err){
            Shade.loading.hideLoading()
        }
    });
}

function doAjaxRequest(url, call, data, callback, async) {
    // Shade.loading.showLoading()

    var async = true;
    if (async!=undefined) {
        async = async;
    }
    // console.log('是否异步:'+async);

    var ua = 'KHW_H5_SIGN'
    var signKey = '68352e6b616875616e77616e672e636f6d'
    var timestamp = new Date().getTime()
    var sign = hex_md5(ua + "&" + call + "&" + timestamp + "&" + signKey);

    var params = JSON.stringify({
        ua: ua,
        call: call,
        args: data,
        sign: sign,
        timestamp: timestamp
    })
    console.log({
        ua: ua,
        call: call,
        args: data,
        sign: sign,
        timestamp: timestamp
    })

    $.ajax({
        url : url,
        type : 'post',
        data : params,
        async : async,
        success : function(data){
            // Shade.loading.hideLoading()
            callback(JSON.parse(data));
        },
        error : function(err){
            // Shade.loading.hideLoading()
        }
    });
}

function deviceType() {
    var browser = {
        version: function () {
            var u = navigator.userAgent;
            var app = navigator.appVersion;
            return {
                trident : u.indexOf('Trident') > -1,
                presto : u.indexOf('Presto') > -1,
                webkit : u.indexOf('AppleWebkit') > -1,
                gecko : u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                mobile : !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
                ios : !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                android : u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                iPhone : u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
                iPad : u.indexOf('iPad') > -1,
                webApp : u.indexOf('Safari') == -1
            };
        }(),
        language:(navigator.browserLanguge || navigator.language).toLowerCase()
    }

    if( browser.version.ios || browser.version.iPhone || browser.version.iPad ){
        $(".homehearder").css("display","none")
        return 'ios';
    }else if( browser.version.android ){
        $(".homehearder").css("display","none")
        return 'android';
    }else {

        return 'pc';
    }
}

function shareFriends() {
    var appInfo = getAppInfo()
    var invitorCustomerId = appInfo.customerId

    var shareUrl = config.shareUrlPrefix + invitorCustomerId

    var type = deviceType()

    if (type === 'android') {
        app.inviteFriends(shareUrl)
    } else if (type === 'ios') {
        window.webkit.messageHandlers.khwActivityShareH5.postMessage(shareUrl)
    } else if(type == "pc"){
        $("body").css({
            "width":"500px",
            "margin":"0 auto"
        });
    }
}
