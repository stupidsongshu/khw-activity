window.onload = function(){
	if(deviceType() == "pc"){
		$("#body").css({
			"width":"500px",
			"margin":"0 auto"
		});
	}
	CashRecord.init();
}

var CashRecord = {
    init: function() {
		var url = config.commonUrl
		var call = 'Invite.cashRecord'
		var appInfo = getAppInfo()
		var param = {
			customerId: appInfo.customerId,
			mobileNo: appInfo.mobileNo,
			app: appInfo.app
		}

		doAjaxRequestSign(url, call, param, render)

		function render(data) {
			if (data.returnCode === '000000') {
                console.log(data.response)
                if (data.response.list.length === 0) {
					$('.empty').show()
					$('#shareFriends').on('click', function() {
						shareFriends()
					})
                } else {
                    $('.reword-list').show()

                    var html = template('rewordList', data.response)
                    document.getElementById('rewordListWrapper').innerHTML = html
                }
			}
		}

		template.defaults.imports.formatPhoneNo = function(value){
			return value.substring(0, 3) + '****' + value.substring(7)
		};
    }
}
