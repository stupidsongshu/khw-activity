window.onload = function(){
	CashHandle.init();
}

var CashHandle = {
    init: function() {
        var urlParam = CashHandle.getUrlParams()
        var outBizNo = urlParam.outBizNo

        var timerGetHandleRes

        var url = config.commonUrl
		var call = 'Invite.cashQuery'
		var appInfo = getAppInfo()
		var param = {
			customerId: appInfo.customerId,
			mobileNo: appInfo.mobileNo,
            app: appInfo.app,
            outBizNo: outBizNo
		}

        function showHint(str) {
            clearInterval(timerGetHandleRes)
            $('.handling').hide()
            $('.hint .txt').html(str)
            $('.hint').show()
            var count = 3
            var timerCountDown = setInterval(function() {
                count--

                $('.hint .counter').html(count)
                if (count <= 0) {
                    count = 3
                    clearInterval(timerCountDown)
                    window.location.replace('../pages/userbonus.html')
                }
            }, 1000)
        }

        function getHandleRes() {
            doAjaxRequestSign(url, call, param, function (data) {
                console.log(data)
                if (data.returnCode === '000000') {
                    var status = data.response.orderStatus
                    if (status === 'SUCCESS') {
                        var str = '提款成功'
                        showHint(str)
                    } else if (status === 'FAIL') {
                        var str = '当前支付宝账号不存在或者手机号对应多个支付宝账号'
                        showHint(str)
                    }
                }
            })
        }

        timerGetHandleRes = setInterval(function() {
            getHandleRes()
        }, 1000)
    },
    getUrlParams : function(){
        var params1 = window.location.search.substring(1);
        var params2 = params1.split('&');
        var params3 = {};
        for(var i=0; i<params2.length; i++){
            var temp = params2[i].split('=');
            params3[temp[0]] = temp[1];
        }
        return params3;
    }
}
