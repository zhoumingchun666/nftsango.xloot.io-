// Namespace
if (!$d) {
    var $d = {};
}
$d.encodeBase64Url = function(str) {
    if (typeof str !== 'string') {
        return null;
    }
    str = $d.encodeBase64(str);
    str = str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return str;
};
$d.decodeBase64Url = function(str) {
    if (typeof str !== 'string') {
        return null;
    }
    var mod = str.length % 4;
    if (mod !== 0) {
        str += $d.repeat('=', 4 - mod);
    }
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    str = $d.decodeBase64(str);
    return str;
};
$d.repeat = function(str, num) {
    return new Array(num + 1).join(str);
};
$d.encodeBase64 = function(str) {
    if (typeof str !== 'string') {
        return null;
    }
    str = (str + '').toString();
    var strReturn = '';
    if (window.btoa) {
        strReturn = window.btoa(unescape(encodeURIComponent(str)));
    } else {
        strReturn = $d.encodeBase64Fallback(str);
    }
    return strReturn;
};
$d.decodeBase64 = function(str) {
    if (typeof str !== 'string') {
        return null;
    }
    str = (str + '').toString();
    var strReturn = '';
    if (window.atob) {
        strReturn = decodeURIComponent(escape(window.atob(str)));
    } else {
        strReturn = $d.decodeBase64Fallback(str);
    }
    return strReturn;
};
$d.encodeBase64Fallback = function(data) {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            enc = '',
            tmp_arr = [];

    if (!data) {
        return data;
    }

    data = unescape(encodeURIComponent(data));

    do {
        // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    var r = data.length % 3;

    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
};
$d.decodeBase64Fallback = function(data) {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            dec = '',
            tmp_arr = [];

    if (!data) {
        return data;
    }

    data += '';

    do {
        // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));

        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;

        if (h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        } else if (h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        } else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
    } while (i < data.length);

    dec = tmp_arr.join('');

    return decodeURIComponent(escape(dec.replace(/\0+$/, '')));
};


function login(){
    if(!$("#user_no").val()){
        alert(get_lan("input"));
        return false;
    }
    if(!$("#user_password").val()){
        alert(get_lan("input3"));
        return false;
    }else if($("#user_password").val().length < 8){
        alert(get_lan("input4"));
        return false;
    }

    var user_no = $("#user_no").val();
    var password = $("#user_password").val();
    // $(this_but).text('正在校验...');
    $.ajax({
        type: 'post',
        async: false,
        url:'/api/users/token.do',
        data:{
            "telNumber": user_no,
            "password": password
        },
        dataType: 'json',
        success: function (data) {
            if (data.code == 200) {
                token = data.object;
                var units = token.split(".");
                var jwt_payload = JSON.parse($d.decodeBase64Url(units[1]));
                var time_cookie = (jwt_payload.exp -jwt_payload.iat)/3600000;
                setCookie('token', token, time_cookie/24);
                // $(this_but).text('登陆成功');
                var date_obj = new Date();
                setTimeout(function(){
                      window.location.href = "index.html";
                }, 500);
            } else if (data.code == 0) {
                // $(this_but).text('确定');
                alert(get_lan("input7"));
            }
        }
    });
    return false;
}

// function login_again_num(this_but){
//     if(!$("#user_no").val()){
//         alert('请输入手机号!');
//         return false;
//     }
//     if(!$("#user_password").val()){
//         alert('请输入密码!');
//         return false;
//     }

//     user_no = $("#user_no").val();
//     password = $("#user_password").val();
//     $(this_but).text('正在校验...');
//     $.ajax({
//         type: 'post',
//         async: false,
//         url:'/api/users/token.do',
//         data:{
//             "telNumber": user_no,
//             "password": password
//         },
//         dataType: 'json',
//         success: function (data) {
//             if (data.code == 200) {
//                 token = data.object;
//                 var units = token.split(".");
//                 var jwt_payload = JSON.parse($d.decodeBase64Url(units[1]));
//                 var time_cookie = (jwt_payload.exp -jwt_payload.iat)/3600000;
//                 setCookie('token', token, time_cookie/24);
//                 $(this_but).text('登陆成功');
//                 var date_obj = new Date();
//                 setTimeout(function(){
//                       // window.location.href = getIsURLHavePara('timestamp',date_obj.getTime());
//                       window.location.href = "kindergarten.html";
//                 }, 500);
//             } else if (data.code == 0) {
//                 $(this_but).text('确定');
//                 alert('密码错误');
//             }
//         }
//     });
//     return false;
// }

function getIsURLHavePara(name,paramVal){
    var url=location.href;
    if(url.indexOf("?")!=-1){
        if(url.indexOf(name)!=-1){
            url = replaceParamVal(name,paramVal);
        }else{
            url = url+"&"+name+"="+paramVal;
        }
    }else{
        url = url+"?"+name+"="+paramVal;
    }
    return url;
}