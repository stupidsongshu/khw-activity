window.onload = function(){
	Withdraw.init();
};

var Withdraw = {
	default: {
        domain: config.yzmUrl,
        countdown: 60
    },
	init: function () {
		function formatPhoneNo(no) {
			return no.substring(0, 3) + '****' + no.substring(7)
		}

		var url = config.commonUrl
		var call = 'Invite.record'
		var appInfo = getAppInfo()

		$('#zfbtel').val(formatPhoneNo(appInfo.mobileNo))

		var param = {
			customerId: appInfo.customerId,
			mobileNo: appInfo.mobileNo,
			app: appInfo.app
		}

		doAjaxRequestSign(url, call, param, function(data) {
            if (data.returnCode === '000000') {
				var totalInvitorReward = data.response.totalInvitorReward
				
				// 提款记录 已提款金额
				var call = 'Invite.cashRecord'
				doAjaxRequestSign(url, call, param, function(res) {
					var handleAmt = res.response.handleAmt
					$('#cashAmount').val(totalInvitorReward-handleAmt)
				})
			}
		})

		$('#getQrCode').on('click', function() {
			Withdraw.getQrcode()
		})

		$('#withdraw').on('click', function() {
			Withdraw.cashExtract()
		})
	},
	validator: {
        qrCode: function(qrCode){
            if(qrCode === '' || qrCode === undefined){
                Shade.dialog.init('请输入短信验证码');
                return false;
            }
            if(qrCode.length != 4){
                Shade.dialog.init('验证码错误');
                return false;
            }
            return true;
        }
    },
	setCountdown : function(){
        if(Withdraw.default.countdown == 0) {
            $("#getQrCode").attr("disabled", false);
            $("#getQrCode").text("获取验证码");
            Withdraw.default.countdown = 60;
            return;
        }else {
            $("#getQrCode").attr("disabled", true);
            $("#getQrCode").text("重新发送(" + Withdraw.default.countdown + ")");
            Withdraw.default.countdown--;
        }
        setTimeout(function() { Withdraw.setCountdown(); } ,1000);
    },
	//获取验证码
    getQrcode: function(){
		var appInfo = getAppInfo()
		var mobileNo = appInfo.mobileNo

        var args = {
            mobileNo: mobileNo,
            type: 1
        };
		var parameter = JSON.stringify(Withdraw.getCommonParams(args, 'Account.dynamicPwd'));
        $("#getQrCode").text("正在获取");
        Withdraw.ajaxRequest('sms/m/h', parameter,function(response){
            $('#loading').hide();
            if(response.returnCode === '000000'){
                Withdraw.setCountdown();
                Shade.dialog.init('验证码发送成功');
            } else {
                $("#getQrCode").text("获取验证码");
                Shade.dialog.init(response.returnMsg);
            }
        },'post',true);
	},
	ajaxRequest: function(p_url,parameter,callback,p_type,p_async){
        //参数：请求地址，请求参数，回调函数，请求类型，请求方式（异步|同步）
        var url   = Withdraw.default.domain + p_url,
            type  = p_type === '' ? 'post' : p_type,
            async = p_async === '' ? true : false;
        $.ajax({
            url: url,
            type: type,
            data: parameter,
            async: async,
            beforeSend: function(xhr){
                $('#loading').show();
            },
            complete: function(xhr,status){
                setTimeout(function() {
                    $('#loading').hide();
                },1000);
            },
            success: function(result,status,xhr){
                var obj = JSON.parse(result);
                console.log(obj);
                callback(obj)
            },
            error: function(xhr,status,error){
                $("#getQrCode").text("获取验证码");
            }
        });
	},
	getCommonParams: function(args, callStr) {
        var parameter = {
            ua: 'KHW_H5_SIGN',
            call: callStr,
            timestamp: 0,
            sign: '',
            args: args
        };
        parameter.timestamp = new Date().getTime();
        var signStr = parameter.ua + "&" + parameter.call + "&" + parameter.timestamp + "&" + "68352e6b616875616e77616e672e636f6d";
        parameter.sign  = hex_md5(signStr);
        return parameter;
	},
	cashExtract: function () {
		var dynamicPwd = $('#code').val()
		if(!Withdraw.validator.qrCode(dynamicPwd)) return;

		var url = config.commonUrl
		var call = 'Invite.cashExtract'
		var appInfo = getAppInfo()
		var param = {
			customerId: appInfo.customerId,
			mobileNo: appInfo.mobileNo,
            app: appInfo.app,
            dynamicPwd: dynamicPwd,
			amount: $('#cashAmount').val()
		}

		doAjaxRequestSign(url, call, param, function(data) {
            if (data.returnCode === '000000') {
				window.location.replace('../pages/cashHandle.html?outBizNo=' + data.response.outBizNo)
			} else {
				Shade.dialog.init(data.returnMsg)
			}
		})
	}
}
