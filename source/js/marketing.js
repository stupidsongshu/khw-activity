window.onload = function(){
	Activity.initApp();
}

var Activity = {
	urls : {
		shareInfoUrl  : config.commonUrl,
		inviteRankUrl : config.commonUrl
	},
	urlParams : {
		invitorId : ''
	},
	shareInfo : {},
	initApp : function() {
		localStorage.clear()
		var type = deviceType();
		if('ios' == type ){
			// var postParam = {
			// 	actionTitle : '分享好友',
			// 	actionBody  : '在乐贷款，我领到了200元红包，福利送你，还不快来，先到先得。',
			// 	imgDetailUrl: Activity.shareInfo.statusMsg
			// };
			// console.log('============');
			// console.log(postParam);
			// window.webkit.messageHandlers.shareTofriends.postMessage(postParam);

			window.webkit.messageHandlers.khwActivityAppInfoH5.postMessage('')

			window.khwActivityAppInfoIos = function(appInfo) {
				if (appInfo.customerId && appInfo.mobileNo) {
					setAppInfo(appInfo)
					Activity.init();
				} else {
					window.location.replace(config.khwOfficialWebsite)
					return
				}
			}
		} else if('android' == type){
			// var actionType = "WEIXIN_CIRCLE";
			// var actionTitle = "分享好友";
			// var actionBody = "在乐贷款，我领到了200元红包，福利送你，还不快来，先到先得。";
			// javascript:jsInterface.shareAction(actionType,actionTitle,actionBody,Activity.shareInfo.statusMsg);

			if (!app) {
				window.location.replace(config.khwOfficialWebsite)
				return
			}
			var appInfoStr = app.userAction()
			if (!appInfoStr) {
				window.location.replace(config.khwOfficialWebsite)
				return
			}

			var appInfo = JSON.parse(appInfoStr)
			if (appInfo.customerId && appInfo.mobileNo) {
				setAppInfo(appInfo)
				Activity.init();
			} else {
				window.location.replace(config.khwOfficialWebsite)
				return
			}
		}
	},
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
				var html = template('inviteRecord', data.response)
				document.getElementById('inviteRecordWrapper').innerHTML = html
			}
		}

		//加载达人榜
		Activity.honorBar();

		//点击查看活动规则
		$(".activityrules").click(function() {
			var _html ="<li>1.活动时间：4月25日-7月25日，请务必在活动期间提现奖金，活动结束会清零</li>"+
			     	   "<li>2.被邀请的好友必须是首次在卡还王注册的新用户</li>"+
			     		"<li>3.通过您的专属链接注册的好友为一级好友，一级好友用自己的专属链接邀请的好友为您的二级好友</li>"+
			     		"<li>4.邀友奖励可在“我的奖金”查看，申请提现邀友奖金，会立即发放到用户支付宝，请确保您注册卡还王的手机号已开通支付宝</li>"+
			     		"<li>5.如发现用户通过造假等非法手段参与活动的，卡还王有权取消其参与资格并没收奖金；活动解释权归卡还王平台所有，与Apple.Inc无关</li>"
			$(".mask-content").html(_html);
			$(".clickbg").css("display","block");
			$(".mask-wrapper").css("display","block");
			// $('body').css('overflow', 'hidden').on('touchmove', function(e) {e.preventDefault()});
			$("html,body").css({"height":"100%","overflow-y":"hidden"});
		});
		// 邀请规则
	 	$(".closemode").click(function(){
			$(".clickbg").css("display","none");
			$(".mask-wrapper").css("display","none");
			// $('body').css('overflow', 'auto').unbind("touchmove");
			$("html,body").css({"height":"auto","overflow-y":"auto"});
		});

		// 立即邀请
	    $("#invite").on("click",function(){
			shareFriends()
		});
	},
	share : function(){
	    if(Activity.shareInfo.status !=1){
	        var parameter = { "invitorId": Activity.urlParams.invitorId };
			Activity.doAjaxRequest(Activity.urls.shareInfoUrl, parameter, function(data){
				console.log('shareInfoUrl');
				console.log(data);
				if(data.status==1){
					Activity.shareInfo = data;
				}
			},false);
	    }
		if(Activity.shareInfo.status==1){
			var type = deviceType();
	        if('ios' == type ){
	        	var postParam = {
	        		actionTitle : '分享好友',
	        		actionBody  : '在乐贷款，我领到了200元红包，福利送你，还不快来，先到先得。',
	        		imgDetailUrl: Activity.shareInfo.statusMsg
	        	};
	        	console.log('============');
	        	console.log(postParam);
	            window.webkit.messageHandlers.shareTofriends.postMessage(postParam);
	        }else if('android' == type){
	            var actionType = "WEIXIN_CIRCLE";
	        	var actionTitle = "分享好友";
	        	var actionBody = "在乐贷款，我领到了200元红包，福利送你，还不快来，先到先得。";
	            javascript:jsInterface.shareAction(actionType,actionTitle,actionBody,Activity.shareInfo.statusMsg);
	        }
		}else if(Activity.shareInfo.status == -1){
			Shade.dialog.init(Activity.shareInfo.statusMsg);
	    }else{
	    	Shade.dialog.init("获取分享链接失败，请刷新后再分享");
	    }                                                                                                                                         
	},
	honorBar : function(){
		var appInfo = getAppInfo()
		var url = config.commonUrl
		var call = 'Invite.rank'
		var param = {
			customerId: appInfo.customerId,
			mobileNo: appInfo.mobileNo,
			app: appInfo.app
		}
		doAjaxRequestSign(url, call, param, renderRank)

		function renderRank(data) {
			if (data.returnCode === '000000') {
				var html = template('inviteRankList', data)
				document.getElementById('inviteRankListWrapper').innerHTML = html
			}
		}

		template.defaults.imports.formatPhoneNo = function(value){
			return value.substring(0, 3) + '****' + value.substring(7)
		};
	},
	getUrlParameter : function(){
		var urlParams = window.location.search.substring(1);
	    var paramArray = urlParams.split("&");
	    var parameter = {};
	    for(var i = 0;i<paramArray.length;i++){
	        var temp = paramArray[i].split("=");
	        parameter[temp[0]] = temp[1];
	        return parameter;
	    }
	},
	doAjaxRequest : function(url,parameter,callback,async){
		$.ajax({
	        url : url,
	        data: parameter,
	        type: 'get',
	        async : async,
	        success : function(data){
	        	var json = JSON.parse(data);
	        	callback(json);
	        },
	        error : function(data){
	        	console.log(data);
	        }
	    });
	}
};
