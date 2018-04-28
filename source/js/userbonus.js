window.onload = function(){
	Reward.init();
};
var Reward = {
	init : function(){
		var appInfo = getAppInfo()
		var url = config.commonUrl
		var param = {
			customerId: appInfo.customerId,
			mobileNo: appInfo.mobileNo,
			app: appInfo.app
		}

		// 获奖总额
		var call = 'Invite.record'
		doAjaxRequestSign(url, call, param, function(data) {
            if (data.returnCode === '000000') {
				var totalInvitorReward = data.response.totalInvitorReward
				$('#totalInvitorReward').html(totalInvitorReward + '元')
				
				// 提款记录 已提款金额
				var call = 'Invite.cashRecord'
				doAjaxRequestSign(url, call, param, function(res) {
					var handleAmt = res.response.handleAmt
					$('.bonus-amount-no').html(totalInvitorReward - handleAmt)

					$('.bonus-btn').attr('disabled', false).on('click', function() {
						if (totalInvitorReward - handleAmt > 0) {
							window.location.replace('../pages/withdraw.html')
						} else if (totalInvitorReward - handleAmt === 0) {
							Shade.dialog.init('当前可提款余额为0，快去邀请好友吧')
						}
					})
				})
			}
        })
	}
};
