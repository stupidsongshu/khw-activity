var Register = {
    timer: null,
    default: {
        domain: config.yzmUrl,
        countdown: 60,
        channel: '6d61696775616e675f68357265676973746572'
    },
    toastToggle: function(msg){
        clearTimeout(this.timer);
        $('.toast>span').text(msg);
        this.timer = setTimeout(function(){
            $('.toast>span').text('');
        },3000);
    },
    getFigureCode: function() {
        $('#fCode').val('');
        FigureCode.init();
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
    },
    init: function(){
        //初始化
        // 获取渠道号等参数
        var urlParams = Register.getUrlParams();
        if(urlParams.channel){
            Register.default.channel = urlParams.channel;
        }
        $('#getQrCode').on('click',function(){
            Register.getQrcode();
        });
        $('#register').on('click',function(){
            Register.register();
        });
        $('#figureCode').on('click', function() {
            Register.getFigureCode();
        });
        $('.close').on('click', function() {
            $('#agreenment').hide();
            $('#registered').hide();
        });
        $('#readAgreenment').on('click', function() {
            $('#agreenment').show();
        });
        $('#redo').on('click', function() {
            $('#registered').hide();
        });
        $('#download').on('click', function() {
            $('#registered').hide();
            installFun();
        });

        var agreenment = '<h4 style="text-align: center;">使用协议及隐私声明</h4>' +
                    '<p>在此特别提醒用户请认真阅读、充分理解本《使用协议及隐私声明》（下称《协议》）。</p>' +
                    '<h4>一、本协议的签署和修订</h4>' +
                    '<p>1.1 本应用只接受持有中国有效身份证明的20周岁至60周岁具有完全民事行为能力的自然人成为用户。如您不符合资格，请勿注册，否则本应用有权随时中止或终止您的用户资格。</p>' +
                    '<p>1.2 本协议内容包括以下条款及本应用已经发布的或将来可能发布的各类规则。所有规则为本协议不可分割的一部分，与协议正文具有同等法律效力。本协议是您与本应用共同签订的，适用于您在本应用的全部活动。在您注册成为用户时，您已经阅读、理解并接受本协议的全部条款及各类规则，并承诺遵守中国的各类法律规定，如有违反而导致任何法律后果的发生，您将以自己的名义独立承担所有相应的法律责任。</p>' +
                    '<p>1.3 本应用有权根据需要不时地修改本协议或根据本协议制定、修改各类具体规则并在本应用相关系统板块发布，无需另行单独通知您。您应不时地注意本协议及具体规则的变更，若您在本协议及具体规则内容公告变更后继续使用本服务的，表示您已充分阅读、理解并接受修改后的协议和具体规则内容，也将遵循修改后的协议和具体规则使用本应用的服务；同时就您在协议和具体规则修订前通过本应用进行的交易及其效力，视为您已同意并已按照本协议及有关规则进行了相应的授权和追认。若您不同意修改后的协议内容，您应停止使用本应用的服务。</p>' +
                    '<p>1.4 您通过自行或授权有关方根据本协议及本应用有关规则、说明操作确认本协议后，本协议即在您和本应用之间产生法律效力。本协议不涉及您与本应用的其他用户之间因网上交易而产生的法律关系或法律纠纷，但您在此同意将全面接受和履行与本应用其他用户在本应用签订的任何电子法律文本，并承诺按该等法律文本享有和/或放弃相应的权利、承担和/或豁免相应的义务。</p>' +
                    '<h4>二、服务的提供</h4>' +
                    '<p>2.1 本应用提供的服务包括但不限于：用户注册、审核用户信息、提供用户借款和还款服务，具体详情以本应用当时提供的服务内容为准。您同意，针对借款人用户，本应用有权根据借款人提供的各项信息及本应用独立获得的信息评定借款人在本应用所拥有的个人信用等级，或决定是否审核通过借款人的借款申请。</p>' +
                    '<p>2.2 基于运行和交易安全的需要，本应用可以暂时停止提供、限制或改变本应用服务的部分功能，或提供新的功能。在任何功能减少、增加或者变化时，只要您仍然使用本应用的服务，表示您仍然同意本协议或者变更后的协议。</p>' +
                    '<p>2.3 您确认，您在本应用上按本应用服务流程所确认的交易状态将成为本应用为您进行相关交易或操作的明确指令。您同意本应用有权按相关指令依据本协议和/或有关文件和规则对相关事项进行处理。</p>' +
                    '<p>2.4 您未能及时对交易状态进行修改或确认或未能提交相关申请所引起的任何纠纷或损失由您本人负责，本应用不承担任何责任。</p>' +
                    '<h4>三、用户信息及隐私权保护</h4>' +
                    '<p>3.1 用户信息的提供、搜集及核实</p>' +
                    '<p>3.1.1 您有义务在使用本应用服务时提供自己的真实资料，并保证诸如电子邮件地址、联系电话、联系地址等内容的有效性、安全性和及时更新，以便本应用为您提供服务并与您进行及时、有效的联系。您应完全独自承担因通过这些联系方式无法与您取得联系而导致的您在使用本服务过程中遭受的任何损失或增加任何费用等不利后果。</p>' +
                    '<p>3.1.2 本应用可能自公开及私人资料来源收集您的额外资料，以更好地了解本应用用户，并为其度身订造本应用服务、解决争议和确保在应用进行交易的安全性。本应用仅收集本应用认为就此目的及达成该目的所必须的关于您的个人资料。</p>' +
                    '<p>3.1.3 您同意本应用可以自行或通过合作的第三方机构对您提交或本应用搜集的用户信息（包括但不限于您的个人身份证信息等）进行核实，并对获得的核实结果根据本协议及有关文件进行查看、使用和留存等操作。</p>' +
                    '<p>3.1.4 本应用按照您在本应用上的行为自动追踪关于您的某些资料。本应用利用这些资料进行有关本应用之用户的人口统计、兴趣及行为的内部研究，以更好地了解您以便向您和本应用的其他用户提供更好的服务。</p>' +
                    '<p>3.1.5 如果您将个人通讯信息（例如：手机短信、电邮或信件）交付给本应用，或如果其他用户或第三方向本应用发出关于您在本应用上的活动或登录事项的通讯信息，本应用可以将这些资料收集在您的专门档案中。 </p>' +
                    '<h4>3.2 用户信息的使用和披露</h4>' +
                    '<p>3.2.1 您同意本应用可使用关于您的个人资料（包括但不限于本应用持有的有关您的档案中的资料，及本应用从您目前及以前在本应用上的活动所获取的其他资料）以解决争议、对纠纷进行调停、确保在本应用进行安全交易，并执行本应用的服务协议及相关规则。本应用有时候可能调查多个用户以识别问题或解决争议，特别是本应用可审查您的资料以区分使用多个用户名或别名的用户。为限制在应用上的欺诈、非法或其他刑事犯罪活动，使本应用免受其害，您同意本应用可通过人工或自动程序对您的个人资料进行评价。</p>' +
                    '<p>3.2.2 您同意本应用可以使用您的个人资料以改进本应用的推广和促销工作、分析应用的使用率、改善本应用的内容和产品推广形式，并使本应用的内容、设计和服务更能符合用户的要求。这些使用能改善本应用的页面，以调整本应用的页面使其更能符合您的需求，从而使您在使用本应用服务时得到更为顺利、有效、安全及量身订造的交易体验。</p>' +
                    '<p>3.2.3 您同意本应用利用您的资料与您联络并（在某些情况下）向您传递针对您的兴趣而提供的信息，例如：有针对性的广告条、行政管理方面的通知、产品提供以及有关您使用本应用的通讯。您接受本协议即视为您同意收取这些资料。</p>' +
                    '<p>3.2.4 您注册成功后应妥善保管您的用户名和密码。您确认，无论是您还是您的代理人，用您的用户名和密码登录本应用后在本应用的一切行为均代表您并由您承担相应的法律后果。</p>' +
                    '<p>3.2.5 本应用对于您提供的、自行收集到的、经认证的个人信息将按照本协议及有关规则予以保护、使用或者披露。本应用将采用行业标准惯例以保护您的个人资料，但鉴于技术限制，本应用不能确保您的全部私人通讯及其他个人资料不会通过本协议中未列明的途径泄露出去。</p>' +
                    '<p>3.2.6 您使用本应用服务进行交易时，您即授权本公司将您的包括但不限于真实姓名、联系方式、信用状况等必要的个人信息和交易信息披露给与您交易的另一方或本应用的合作机构（仅限于本应用为完成拟向您提供的服务而合作的机构）。</p>' +
                    '<p>3.2.7 本应用有义务根据有关法律要求向司法机关和政府部门提供您的个人资料。在您未能按照与本协议、本应用有关规则或者与本应用其他用户签订的有关协议的约定履行自己应尽的义务时（包括但不限于当您作为借款人借款逾期或有其他违约时），本应用有权根据自己的判断、有关协议和规则、国家生效裁决文书或者与该笔交易有关的其他用户的合理请求披露您的个人资料（包括但不限于在本应用及互联网络上公布您的违法、违约行为，并有关将该内容记入任何与您相关的信用资料、档案或数据库），并且作为出借人的其他用户可以采取发布您的个人信息的方式追索债权或通过司法部门要求本应用提供相关资料，本应用对此不承担任何责任。</p>' +
                    '<p>3.3 您对其他用户信息的使用</p>' +
                    '<p>3.3.1 在本应用提供的交易活动中，您无权要求本应用提供其他用户的个人资料</p>' +
                    '<p>3.4 密码的安全性</p>' +
                    '<p>3.4.1 用户须对使用用户的用户名和密码所采取的一切行为负责。因此，用户不要向任何第三方披露用户在本应用的用户名和密码，否则由此造成的损失由用户自行承担。</p>' +
                    '<h4>四、其他</h4>' +
                    '<p>本应用对本协议拥有最终的解释权。本协议及本应用有关页面的相关名词可互相引用参照，如有不同理解，则以本协议条款为准。此外，若本协议的部分条款被认定为无效或者无法实施时，本协议中的其他条款仍然有效。</p>';
        $('#agreenmentContent').html(agreenment);

        console.log(urlParams)
        var url = Register.default.domain + 'khw/c/h'
        var call = 'Account.invitorName'
        var param = {
            invitorCustomerId: urlParams.ic
		}
        doAjaxRequest(url, call, param, function(data) {
            console.log(data)
            if (data.returnCode === '000000') {
                if (/^\d{11}$/.test(data.response)) {
                    var str1 = data.response.substring(0, 3)
                    var str2 = data.response.substring(7)
                    $('#inviter').html(str1+'****'+str2)
                } else {
                    $('#inviter').html(data.response)
                }
                $('.invite').show()
            }
        })
    },
    validator: {
        mobileNo: function(mobileNo){
            var reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
            if(mobileNo ==='' || mobileNo === undefined){
                Register.toastToggle('请输入手机号码');
                return false;
            }
            if(mobileNo.length != 11){
                Register.toastToggle('请输入11位手机号码');
                return false;
            }
            if(!reg.test(mobileNo)){
                Register.toastToggle('请输入有效的11位手机号码');
                return false;
            }
            return true;
        },
        checkAgree: function() {
            if(!$("#checkbox").prop("checked")){
                Register.toastToggle('请阅读并同意《贷款协议》');
                return false;
            }
            return true;
        },
        fCode: function() {
            var fcode = $('#fCode').val();
            if(fcode === ''){
                Register.toastToggle('图形验证码不能为空');
                return false;
            }
            if(fcode !== FigureCode.code){
                Register.toastToggle('图形验证码错误');
                return false;
            }
            return true;
        },
        qrCode: function(qrCode){
            if(qrCode === '' || qrCode === undefined){
                Register.toastToggle('请输入短信验证码');
                return false;
            }
            if(qrCode.length != 4){
                Register.toastToggle('验证码错误');
                return false;
            }
            return true;
        }
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
        console.log(parameter);
        return parameter;
    },
    register: function(){
        var urlParams = Register.getUrlParams();
        //提交注册申请
        var mobileNo = $('#mobileNo').val();
        var qrCode = $('#qrCode').val();
        var checkMobileResult = Register.validator.mobileNo(mobileNo);
        if(!checkMobileResult) return;
        if(!Register.validator.fCode()) return;
        var checkQrCodeResult = Register.validator.qrCode(qrCode);
        if(!checkQrCodeResult) return;
        if(!Register.validator.checkAgree()) return;
        var args = {
            mobileNo: mobileNo,
            dynamicPwd: qrCode,
            channel: Register.default.channel,
            invitorCustomerId: urlParams.ic
        };
        var parameter = JSON.stringify(Register.getCommonParams(args, 'Account.register'));
        Register.ajaxRequest('khw/c/h', parameter, function(response){
            $('#loading').hide();
            Register.getFigureCode();
            alert(JSON.stringify(response))
            if(response.returnCode === '000000'){
                Register.toastToggle('注册成功');
                installFun();
                // window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.maimob.khw';
            } else if(response.returnCode === '005000') {
                $('#registered').show();
            } else {
                Register.toastToggle(response.returnMsg);
            }
        },'post',true);
    },
    setCountdown : function(){
        if(Register.default.countdown == 0) {
            $("#getQrCode").attr("disabled", false);
            $("#getQrCode").text("获取验证码");
            $('#fCode').val('');
            Register.default.countdown = 60;
            return;
        }else {
            $("#getQrCode").attr("disabled", true);
            $("#getQrCode").text("重新发送(" + Register.default.countdown + ")");
            Register.default.countdown--;
        }
        setTimeout(function() { Register.setCountdown(); } ,1000);
    },
    getQrcode: function(){
        //获取验证码
        var mobileNo = $('#mobileNo').val();
        var checkResult = Register.validator.mobileNo(mobileNo);
        if(!checkResult) return;
        if(!Register.validator.fCode()) return;
        var args = {
            mobileNo: mobileNo,
            type: 1
        };
        var parameter = JSON.stringify(Register.getCommonParams(args, 'Account.dynamicPwd'));
        $("#getQrCode").text("正在获取");
        Register.ajaxRequest('sms/m/h', parameter,function(response){
            $('#loading').hide();
            if(response.returnCode === '000000'){
                Register.setCountdown();
                Register.toastToggle('验证码发送成功');
            } else {
                $("#getQrCode").text("获取验证码");
                Register.toastToggle(response.returnMsg);
            }
        },'post',true);
    },
    ajaxRequest: function(p_url,parameter,callback,p_type,p_async){
        //参数：请求地址，请求参数，回调函数，请求类型，请求方式（异步|同步）
        var url   = Register.default.domain + p_url,
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
    }
}
//获取设备类型
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
                webApp : u.indexOf('Safari') == -1,
                wechat : u.indexOf('MicroMessenger')>-1
            };
        }(),
        language:(navigator.browserLanguge || navigator.language).toLowerCase()
    }

    if( browser.version.ios || browser.version.iPhone || browser.version.iPad ){
        return 'ios';
    }else if( browser.version.android ){
        return 'android';
    }else{
        return 'pc';
    }
}
/**
 *  下载实现
 */
function installFun() {
    var type      = deviceType(),
        ua        = window.navigator.userAgent,
        isWeixin  = !!/MicroMessenger/i.test(ua);
    var urlstr = '';
    if(type == 'ios'){
        window.location.href = 'https://itunes.apple.com/cn/app/id1329918643';
    }else if( type == 'android' ){
        if(isWeixin){
            window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.maimob.khw';
        }else{
            window.location.href = 'https://www.pgyer.com/apiv2/app/install?_api_key=7d9f4ee0bc45234392c0e2b650802c27&appKey=474e8d654b4e734d9f533d95521ee410';
            // $.ajax({
            //     url: 'http://earthapi.youyidai.cn/MC/gxadu',
            //     type: 'post',
            //     dataType: 'json',
            //     data: {appId: 'kahuanwang'},
            //     async: false,
            //     success: function (json) {
            //         // console.log(json);
            //         if(json.status == 0) {
            //             window.location.href= json.downLoadUrl;
            //         } else {
            //             Register.toastToggle(json.msg);
            //         }
            //     },
            //     error: function (XMLHttpResquest, textStatus, errorThrown) {
            //         Register.toastToggle('获取下载资源失败，请到应用市场下载');
            //     }
            // });
        }
    }else{
        window.location.href = 'http://www.kahuanwang.com';
    }
}
var FigureCode = {
    code: '',
    init: function(code) {
        if(!code){
            code = this.randomRealCode();
        }
        var el = document.getElementById('figureCode');
        var width = el.offsetWidth;
        var height = el.offsetHeight;
        var ctx=el.getContext("2d");
        ctx.clearRect(0,0,300,300);
        // ctx.fillStyle=FigureCode.randomColor(180,230);
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0,0,width*4,height*4);
        // //4.随机产生字符串
        var pool="ABCDEFGHIJKLIMNOPQRSTUVWSYZ1234567890";
        for(var i=0;i<code.length;i++){
            // var c=pool[FigureCode.randomNum(0,pool.length)];//随机的字
            var c=code[i];//随机的字
            var fs=FigureCode.randomNum(width,height);//字体的大小
            var deg=FigureCode.randomNum(-20,30);//字体的旋转角度
            ctx.font=fs+'px Simhei';
            ctx.textBaseline="top";
            ctx.fillStyle=FigureCode.randomColor(80,150);
            ctx.save();
            ctx.translate(50*i+15,15);
            // ctx.rotate(deg*Math.PI/180);
            ctx.fillText(c,30,20);
            ctx.restore();
        }
        // //5.随机产生5条干扰线,干扰线的颜色要浅一点
        for(var i=0;i<5;i++){
            ctx.beginPath();
            ctx.moveTo(FigureCode.randomNum(0,width*10),FigureCode.randomNum(0,height*4));
            ctx.lineTo(FigureCode.randomNum(0,width*10),FigureCode.randomNum(0,height*4));
            ctx.strokeStyle=FigureCode.randomColor(180,230);
            ctx.closePath();
            ctx.stroke();
        }
        //6.随机产生40个干扰的小点
        for(var i=0;i<40;i++){
            ctx.beginPath();
            ctx.arc(FigureCode.randomNum(0,width*4),FigureCode.randomNum(0,height*4),1,0,2*Math.PI);
            ctx.closePath();
            ctx.fillStyle=FigureCode.randomColor(150,200);
            ctx.fill();
        }
        this.code = code;
    },
    randomRealCode: function(len){
        var code = '';
        if(!len){
            len = 4;
        }
        for(var i=0; i<len; i++){
            code += this.randomNum(0,9);
        }
        return code;
    },
    randomNum: function(min,max) {
        // 产生随机数
        return  parseInt(Math.random()*(max-min)+min);
    },
    randomColor: function(min,max) {
        // 随机颜色
        var r=FigureCode.randomNum(min,max);
        var g=FigureCode.randomNum(min,max);
        var b=FigureCode.randomNum(min,max);
        var color = 'rgb(' + r + ',' + g + ',' + b + ')';
        //return `rgb(${r},${g},${b})`; // 不兼容部分手机
        return color;
    }
}

window.onload = function(){
    Register.init();
    FigureCode.init();
}