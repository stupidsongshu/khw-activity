window.onload = function(){
	RewardRecord.init();
};
var RewardRecord = {
	init : function(){
		var appInfo = getAppInfo()
		var url = config.commonUrl
		var call = 'Invite.record'
		var param = {
			customerId: appInfo.customerId,
			mobileNo: appInfo.mobileNo,
			app: appInfo.app
		}

		doAjaxRequestSign(url, call, param, render)

		function render(data) {
			if (data.returnCode === '000000') {
				if (!data.response.invitorList || (data.response.invitorList && data.response.invitorList.length === 0)) {
					$('.empty').show()
					$('#shareFriends').on('click', function() {
						shareFriends()
					})
					return
				}
				if (data.response.invitorList.length > 0) {
					var html = template('rewardList', data.response)
					$('#rewardListWrapper').html(html)
	
					$('.total-wrapper').on('click', function() {
						if ($(this).hasClass('unfold')) {
							$(this).removeClass('unfold').next('.detail-wrapper').slideUp()

							$(this).find('.arrow').removeClass('rotate-down')
						} else {
							$(this).addClass('unfold').next('.detail-wrapper').slideDown()
			
							$(this).find('.arrow').addClass('rotate-down')
						}
					})
				}
			}
		}

		template.defaults.imports.formatPhoneNo = function(value){
			return value.substring(0, 3) + '****' + value.substring(7)
		};
	}
}
