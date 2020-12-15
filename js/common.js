var loot = {};
var nodeIndex = 0;
var nftcontract = [];
var myMoneyLockWeek = '';
var myMoneyLockWeekTimer = '';
// xlootshovel1 NFT合约
// looreception 前置接收合约
// xlootnftdex1 NFTDEX合约

ScatterJS.plugins(new ScatterEOS());

var chainId , network ;
var nftContractName, dexContractName, saleContractName , blindBoxContractName;
const API_ENDPOINTS2 = [
  'eospush.tokenpocket.pro',
  'eos.blockeden.cn',
  'eos.greymass.com',
  'nodes.get-scatter.com',
  // 'mainnet.meet.one',
  'api.eossweden.se',
  // 'api.eoslaomao.com',

  // 'api-kylin.eosasia.one',
];

function get_random_api2() {
  // const index = Math.floor(Math.random() * API_ENDPOINTS2.length);

  var index = getCookie("nodeIndex") || nodeIndex;
  // var node = 'https://'+API_ENDPOINTS2[index];
  var node = API_ENDPOINTS2[index];

  // var node = 'https://api-kylin.eosasia.one';
  // console.log(index,node);
  return node;
}

const API_ENDPOINTS = [
  'https://eospush.tokenpocket.pro',
  'https://eos.blockeden.cn',
  'https://eos.greymass.com',
  // 'https://mainnet.meet.one',
  'https://api.eossweden.se',
  // 'https://api.eoslaomao.com'
  // 'https://api-kylin.eosasia.one'
];
  
function get_random_api() {
  const index = Math.floor(Math.random() * API_ENDPOINTS.length);
  return API_ENDPOINTS[index];

}

// chainId = '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191';
// nftContractName = 'xlootshovel1';//nft
// saleContractName = 'looreception';//前置
// dexContractName = 'xlootnftdex1';//dex
// blindBoxContractName = 'xpetshovelco';



// network = ScatterJS.Network.fromJson({
//   blockchain: 'eos',
//   host: 'api-kylin.eosasia.one',
//   protocol: 'https',
//   port: 443,
//   chainId: chainId
// })

chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
// nftContractName = 'xlootshovel1';
nftContractName = 'xlootshovel1';
saleContractName = 'looreception';
dexContractName = 'xlootnftdex1';
blindBoxContractName = 'xpetshovelco';
network = ScatterJS.Network.fromJson({
  blockchain: 'eos',
  host: get_random_api2(),
  protocol: 'https',
  port: 443,
  chainId: chainId
})

var isDev = true;
const EOS_CONFIG = {
  chainId: chainId, // 32 byte (64 char) hex string
  keyProvider: '', // WIF string or array of keys..
  httpEndpoint: 'https://' + get_random_api2(),
  mockTransactions: () => null, // or 'fail'
  expireInSeconds: 3600,
  broadcast: true,
  verbose: isDev,
  debug: isDev, // API and transactions
  sign: true
}

$(function() {
  // getNavPanel();
  connectEOS();
  if(getCookie("account")){

    $(".myName").html(getCookie("account"));
  }
  // eosLogin();
})

function connectEOS() {
  if (window.ScatterJS) {
    ScatterJS.connect(dexContractName, {
      network
    }).then(connected => {
      console.log("connected", connected)
      if (!connected) return false;
      // ScatterJS.someMethod();
    });
    loot.scatter = window.ScatterJS.scatter;
    window.ScatterJS = null;
    setTimeout(function(){
      eosLogin();
    },1000)
    
  }

}



function getDateRandom() {
  var n = 10000,
    m = 99999
  return Date.now() + parseInt(Math.random() * (n - m + 1) + m);
}




function selectionNode(num){
  $(".nodeList .icon").removeClass('act');
  $(".nodeList .icon").eq(num).addClass('act');
  nodeIndex = num;
}
function setNode(){
  setCookie('nodeIndex',nodeIndex);
  // network = ScatterJS.Network.fromJson({
  //   blockchain: 'eos',
  //   host: get_random_api2(),
  //   // host: 'nodes.eos42.io',https://mainnet.eoscannon.io
  //   protocol: 'https',
  //   port: 443,
  //   chainId: chainId
  // })
  $('.nodeDialog').hide();
  window.location.reload();
}


function eosLogin() {
  checkScatter(function(user) {
    pubKeySign(user.name);
  })
}


function getScatter() {
  if (window.scatter) {
    loot.scatter = window.scatter;
  }
  return loot.scatter;
}

function checkScatter(fun) {
  var scatter = getScatter();
  if (scatter) {
    if (scatter.identity) {
      // console.log(scatter.identity);
      const user = loot.scatter.identity.accounts.find(account => account.blockchain === 'eos');
      if (user.publicKey) {
        loot.publicKey = user.publicKey
      }
      loot.bomber = user.name;
      // fun(user.name);
      fun(user);
      // console.log("userMsg:",user);
    } else {
      const requiredFields = {
        accounts: [network]
      };
      if (scatter.getIdentity) {
        scatter.getIdentity(requiredFields).then(identity => {
          var user = '';
          if (getCookie("customerType") == 'BOS' || getCookie("blockchain") == 'BOS') {
            user = identity.accounts.find(account => account.blockchain === 'bos');
          } else {
            user = identity.accounts.find(account => account.blockchain === 'eos');
          }
          if (user.publicKey) {
            loot.publicKey = user.publicKey
          }
          if (isMYKEY()) {
            loot.publicKey = identity.publicKey;
          }
          loot.bomber = user.name;
          // fun(user.name);
          fun(user);
          // console.log("userMsg2:",user);
        }).catch(error => {
          eosErrorShow(error);
        });
      } else {
        showMsg("请打开钱包");
      }
    }
  } else {
    noScatterShow();
  }
}


function isMYKEY() {
  return navigator.userAgent.indexOf("MYKEY") > -1;
}

function noScatterShow() {
  alert("没有")
}

function pubKeySign(eosName) {
  if (loot.publicKey) {
    eosSign(eosName);
  } else {
    const scatter = getScatter();
    const eos = loot.scatter.eos(network, Eos);
    eos.getAccount(eosName).then(data => {
      const pubKey = data.permissions[0].required_auth.keys[0].key;
      loot.publicKey = pubKey;
      eosSign(eosName);
    });
  }

}

function eosSign(eosName) {

  console.log(eosName);
  if(!isNaN(eosName)){
    showMsg("请选择不是全数字的eos账号登录游戏")
    return
  }
  if(getCookie("account") == ''){
    setCookie("account",eosName);
    window.location.reload();
  }else{
    setCookie("account",eosName);
    $(".myName").html(eosName);
  }
  

  // $(".userNameShow").html(eosName);

  // $(".loginBtn").html('我的钱包');

  // getUserToken(eosName);
  // $('#myAssetsBox').show();
}





function showMsg(content) {
  if ($('#msg').length == 0) {
    var str = '<div id="msg" class="msgCon hide">' +
      '<p class="msg">--</p>' +
      '</div>';
    $('body').append(str);
  }
  $(".msg").html(content);
  $("#msg").removeClass('hide').show();
  setTimeout('$("#msg").fadeOut()', 1500);
}

function exit() {
  setCookie("account",'');
  loot.scatter.forgetIdentity();
  window.location.reload();
}

function setLanguage(lan) {
  setCookie('lan', lan);
  window.location.href = window.location.href;
}

function eosErrorShow(error) {
  if (error) {
    if (error.isError) {
      if (error.code == 423) {
        showMsg(error.message);
      } else {
        alert(error.message);
      }
    } else {
      var obj = JSON.stringify(error);
      if (obj.indexOf("{")) {
        obj = JSON.parse(error);
        if (obj.code) {
          if (obj.code == 500 && obj.error.code == 3050003) {
            alert(obj.error.details[0].message);
            // alert(error);
          } else {
            showMsg(obj.error.details[0].message);
            // showMsg(error);
          }
        } else {
          showMsg(error);
        }
      } else {
        showMsg(obj);
      }
      console.log("error:", error);
    }
  }
}







//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//例子：
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}



//写入cookie函数
function setCookie(name, value) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
//获取cookie
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}
//清除cookie  
function delCookie(name) {
  setCookie(name, "", -1);
}
//获取URL的参数
function getURLPara(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}





// getUTC();
function getUTC(utcStart,tag){
  // var utcStart = "2020-10-05T17:20:16";
  // var oldtime = String(new Date(utcStart).getTime() + 7*24*60*60*1000);
  var oldtime = String(new Date(utcStart).getTime());
  var uy = String(new Date().getUTCFullYear());
  var um = String(new Date().getUTCMonth() + 1);
  var ud = String(new Date().getUTCDate());
  var uh = String(new Date().getUTCHours());
  var umin = String(new Date().getUTCMinutes());
  var us = String(new Date().getUTCSeconds());
  if(um.length == 1){
    um = '0'+um;
  }
  if(ud.length == 1){
    ud = '0'+ud;
  }
  if(uh.length == 1){
    uh = '0'+uh;
  }
  if(umin.length == 1){
    umin = '0'+umin;
  }
  if(us.length == 1){
    us = '0'+us;
  }
  var utcNow = String(uy + "-" + um + "-" + ud + "T" + uh + ":" + umin + ":" + us);

  var newtime = new Date(utcNow).getTime();
  // console.log(utcStart);
  // console.log(utcNow);
  // console.log(oldtime);
  // console.log(newtime);

  // return
    // var newtime = new Date();
    // var time = (oldtime % 604800 - newtime) / 1000;
    // var time = 604800 - (((newtime - oldtime) % 604800) / 1000);

    if(newtime - oldtime < 0){
      getUTC2(utcStart, tag)
      console.log("未开始",newtime - oldtime)
      return
    }
    var time = 604800 - (((newtime - oldtime) / 1000) % 604800);

  // console.log("time",time,(newtime - oldtime)/1000);
    if(time < 0){
      console.log("未开始",time)
      return
    }
    clearTimeout(midTimer[tag]);
    midTimer[tag] = setTimeout(function(){
      getUTC(utcStart,tag)
    },1000)
    var d = parseInt(time / (60 * 60 * 24));
    // var h = parseInt(time / 60 / 60 % 24);
    var h = parseInt(time / 60 / 60);
    var m = String(parseInt(time / 60 % 60));
    var s = String(parseInt(time % 60));
    if(m.length == 1){
      m = '0'+m;
    }
    if(s.length == 1){
      s = '0'+s;
    }
    // console.log(d + "天" + h + "小时" + m + "分钟" + s + "秒")
    $(tag).html( h + ":" + m + ":" + s + " 后减半")
    // return d + "天" + h + "小时" + m + "分钟" + s + "秒";
}


function getTokenImgs(id) {
  switch (String(id)) {
    case "TIME":
      return "time.png";
      break;
    case "time":
      return "lootglobcore-loot.png";
      break;
    case "39":
      return "minedfstoken-dfs.png";
      break;
    case "329":
      return "yfctokenmain-yfc.png";
      break;
    case "444":
    case "1":
    case "LOOT":
      return "lootglobcore-loot.png";
      break;
    case "nft":
      return "nft.png";
      break;
    case "3":
    case "YFC":
      return "yfctokenmain-yfc.png";
      break;
    case "4":
    case "DFS":
      return "minedfstoken-dfs.png";
      break;
  }
}


function getUserUTC(startTime){
  // var utcStart = "2020-10-05T17:20:16";
  var oldtime = new Date(startTime).getTime();
  var uy = String(new Date().getUTCFullYear());
  var um = String(new Date().getUTCMonth() + 1);
  var ud = String(new Date().getUTCDate());
  var uh = String(new Date().getUTCHours());
  var umin = String(new Date().getUTCMinutes());
  var us = String(new Date().getUTCSeconds());
  if(um.length == 1){
    um = '0'+um;
  }
  if(ud.length == 1){
    ud = '0'+ud;
  }
  if(uh.length == 1){
    uh = '0'+uh;
  }
  if(umin.length == 1){
    umin = '0'+umin;
  }
  if(us.length == 1){
    us = '0'+us;
  }
  var utcNow = String(uy + "-" + um + "-" + ud + "T" + uh + ":" + umin + ":" + us);

  var newtime = new Date(utcNow).getTime();
  var time = (newtime - oldtime) / 1000;

    if(time < 0){
      console.log("未开始")
      return
    }
    // console.log(time)
    return time;
}
function getUTCTime(time){
  var oldtime = new Date(time).getTime();
  var uy = String(new Date().getUTCFullYear());
  var um = String(new Date().getUTCMonth() + 1);
  var ud = String(new Date().getUTCDate());
  var uh = String(new Date().getUTCHours());
  var umin = String(new Date().getUTCMinutes());
  var us = String(new Date().getUTCSeconds());
  if(um.length == 1){
    um = '0'+um;
  }
  if(ud.length == 1){
    ud = '0'+ud;
  }
  if(uh.length == 1){
    uh = '0'+uh;
  }
  if(umin.length == 1){
    umin = '0'+umin;
  }
  if(us.length == 1){
    us = '0'+us;
  }
  var utcNow = String(uy + "-" + um + "-" + ud + "T" + uh + ":" + umin + ":" + us);

  var newtime = new Date(utcNow).getTime();
  var time = (newtime - oldtime) / 1000;

  return time;
}

function getContractsList() {
  var api = get_random_api();
  var selfData = {
    json: true, // Get the response as json
    code: dexContractName, // Contract that we target
    scope: dexContractName, // Account that owns the data
    table: 'contracts', // Table name
    // index_position: 329,          // Table secondary index
    // lower_bound: getCookie("account"), // Table primary key value
    limit: 10, // Here we limit to 1 to get only the single row with primary key equal to 'testacc'
    reverse: false, // Optional: Get reversed data
    show_payer: false,
  }
  $.post(api + "/v1/chain/get_table_rows", JSON.stringify(selfData),
    function(data, status) {
      // var html = '';
      // $("#") = data["rows"];
      for (x in data["rows"]) {

        console.log("sdfff:", data["rows"][x]);
        nftcontract[x] = data["rows"][x];
      }
    }, "json");
}

// function showUserPanel(){
//   if($("#userMsgBox .panel").hasClass("active")){
//     $("#userMsgBox .panel").removeClass("active");
//     setTimeout(function(){
//       $("#userMsgBox").hide();
//     },300)
    
//   }else{
//     $("#userMsgBox").show();
//     $("#userMsgBox .panel").addClass("active");
//   }
// }




function getUserMsgBox(){
  if ($('#userMsgBox').length == 0) {
    var html = '';
    html += '<div class="alert" id="userMsgBox" style="display: none;">';
    html += '  <div class="flex" style="height: 100%;">';
    html += '    <div class="panel">';
    html += '      <div class="userName">'+ getCookie("account") +'</div>';
    html += '      <div class="nav">';
    html += '        <a class="item" href="myAssets.html">我的资产 >></a>';
    html += '      </div>';
    html += '    </div>';
    html += '    <div style="flex:1;height: 100%;" onclick="showUserPanel()"></div>';
    html += '  </div>';
    html += '</div>';

    $('body').append(html);
  }
  $("#userMsgBox").show();
  $("#userMsgBox .panel").addClass("active");
}
function getUserToken(name){

    var api = get_random_api() ;
    $.post(api + "/v1/chain/get_currency_balance",'{"code":"eosio.token","symbol":"EOS","account":"'+ name +'"}',
    function(data,status){
      // var num = Number(parseFloat(data[0])).toFixed(8) || "0.00000000";
      var num = data[0] || "0.00000000";
      // $("#userToken").html(String(num).split(" ")[0]);
      $("#userToken").html(num);
    }, "json");
}


function getNavPanel(){
    // getNavPanel();


  // if(window.location.pathname.indexOf("/menu.html") > -1 || 
  //   window.location.pathname.indexOf("/coinPool.html") > -1 || 
  //   window.location.pathname.indexOf("/lootPool.html") > -1 || 
  //   window.location.pathname.indexOf("/nftPool.html") > -1){
  //   active2 = active;
  // }else if(window.location.pathname.indexOf("/about.html") > -1){


  if(!getCookie("account")){
    $(".loginBtn").html('登录');
  }else{
    $(".loginBtn").html('我的钱包');
  }
  var html = '';
  html += '<div class="alert" id="myAssetsBox" style="display: none;">'
  html += '<div class="flex" style="height:100%;">';
  html += '  <div class="content" style="height: 300px;">';
  html += '    <div class="header flex">';
  html += '      <span>我的钱包 （<span class="userNameShow">'+ getCookie("account") +'</span>）</span>';
  html += '      <span style="flex:1;"></span>';
  html += '      <span onclick="$(\'#myAssetsBox\').hide()">';
  html += '        <img src="imgs/close.png" alt="" class="closeSvg">';
  html += '      </span>';
  html += '    </div>';
  html += '    <div class="scroll" style="height: 150px;">';
  html += '      <div class="item flex" style="border-bottom:none;" onclick="$(\'#myAssetsBox\').hide()">';
  html += '        <div class="flex">';
  html += '          <img src="imgs/eosio.token-eos.png" alt="" class="coinImg">';
  html += '          <div>';
  html += '            <div class="coin"  id="userToken">--</div>';
  html += '            <!-- <div class="contractTip">UCAT</div> -->';
  html += '          </div>';
  html += '        </div>';
  html += '        <div style="flex:1;"></div>';
  html += '      </div>';
  html += '    </div>';
  html += '    <div style="padding:0 15px;">';
  html += '      <div class="exitBtn" onclick="exit()">退出</div>';
  // html += '      <div onclick="$(\'#myAssetsBox\').hide()">取消</div>';
  html += '    </div>';
  html += '  </div>';
  html += '</div>';
  html += '</div>';
  $("body").append(html)



}

function getMenuPanel(){
  if ($('#menuBox').length == 0) {
    
    var html = '';
   
    html += '<div class="alert" id="menuBox" onclick="$(\'#menuBox\').hide()" style="display: none;">';
    html += '  <div class="rightBox">';
    html += '    <div class="navList">';

    html += '      <div class="item" onclick="getNodePanel()">节点</div>';
    html += '      <div class="item" onclick="descriptionMsgBoxShow(\'about\')">关于</div>';

    if(getCookie("account")){
      html += '      <div class="item" onclick="getMyMoneyMsgShow()">我的资产</div>';
      html += '      <div class="item" onclick="exit()">退出</div>';
    }
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
    

    $('body').append(html);
  }else{

  }
  $("#menuBox").show();

}

function getMyMoneyMsgShow(){
  myMoneyLockWeek = '';
  clearInterval(myMoneyLockWeekTimer);
  myMoneyLockWeekTimer = setInterval(function(){
    getUserBanklocker();
  },3000)
  descriptionMsgBoxShow('myMoney');
  getUserBanklocker();
}


function getUserBanklocker() {
  var api = get_random_api();
  var selfData = {
    json: true,
    code: kingContractName,
    scope: kingContractName,
    table: 'banklocker',
    index_position: 1,
    key_type: "i64",
    lower_bound: getCookie("account"),
    limit: 1,
    reverse: false,
    show_payer: false,
  }
  getLinkData(api, selfData, function(data) {
    for (x in data["rows"]) {
      var obj = data["rows"][x];




      if(obj.acc == getCookie("account")){
        $("#myMoneyLockTime").html(obj.totallock);
        $("#myMoneyWithTime").html(obj.totalout);
        $("#myMoneyEos").html(obj.totaleos);
        $("#myMoneyLockTimes").html(obj.locktime);
        $("#myMoneyLastWithTimes").html(obj.lastdriptime);

        //每一秒释放 = 总金额 / 总秒数
        //上次提现时间
        var times = 0;

        if(getUTCTime(obj.locktime) > obj.period){
          times = obj.period - (getUTCTime(obj.locktime) - getUserUTC(obj.lastdriptime))
        }else{
          times = getUserUTC(obj.lastdriptime);
        }

        var userWithMoney = Number((parseFloat(obj.totallock) / obj.period) * times).toFixed(8);
        if (typeof myMoneyLockWeek != 'object') {
          myMoneyLockWeek = new CountUp("myMoneyLockWeek", 0, 0.00000000, 8, 3, options);
        }
        if (!isNaN(userWithMoney)) {
          myMoneyLockWeek.update(userWithMoney);
        }

        console.log("sjjkjk:",times,userWithMoney,obj.totallock,obj.period)
        // $("#myMoneyLockWeek").html(userWithMoney);myMoneyLockWeek

      }


    }
  })
}

function withMylockMoney(){

  var fromUser = getCookie("account");

  checkScatter(function(user) {
    var authorization;
    const eos = loot.scatter.eos(network, Eos);
    const account = user.name;
    authorization = [{
      actor: account,
      permission: user.authority
    }]

    var actions = [{
      account: kingContractName,
      name: 'withlock',
      authorization: authorization,
      data: {
        acc: fromUser
      }
    }];


    eos.transaction({
      actions: actions
    }).then(res => {
      showMsg("提现成功！");
      $('#descriptionMsgBox').hide();

      // $('#stacknftBox').hide();
    }).catch(e => {

      eosErrorShow(e);
    });
  })
}


function getDexContractBox(){
  if ($('#contractBox').length == 0) {
    var html = '';


    html += '<div class="alert" id="contractBox" style="display: none;">';
    html += '  <div class="flex" style="height:100%;">';
    html += '    <div class="content">';
    html += '      <div class="header flex">';
    html += '        <span>选择合约</span>';
    html += '        <span style="flex:1;"></span>';
    html += '        <span onclick="$(\'#contractBox\').hide()">';
    html += '          <img src="imgs/close.png" alt="" class="closeSvg">';
    html += '        </span>';
    html += '      </div>';

    html += '<div class="iptSearch">';
    html += '  <div class="el-input--suffix flex">';
    html += '    <input type="text" autocomplete="off" placeholder="请输入您的NFT资产合约名" id="userInputContractBox" class="el-input__inner">';
    html += '    <div class="joinUserInputBtn flex" onclick="selectContract(-1,\'\')">';
    html += '      选择';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';


    html += '      <div class="scroll">';

    html += '        <div class="item flex" onclick="selectContract(-1,\'\')">';
    html += '          <div class="flex">';
    // html += '            <img src="imgs/'+ n.nftcontract +'.png" alt="" class="coinImg">';
    html += '            <div style="min-width:128px;">';
    html += '              <div class="coin">全部</div>';
    // html += '              <div class="contractTip">'+ n.protocol +'</div>';
    html += '            </div>';
    // html += '            <div style="flex:1;padding-left:20px;font-size: 20px;">（数量：'+ n.tokencount +'）</div>';
    html += '          </div>';
    html += '          <div style="flex:1;"></div>';
    html += '        </div>';

    $.each(nftcontract,function(i,n){

      html += '        <div class="item flex" onclick="selectContract('+ i +',\''+ n.nftcontract +'\')">';
      html += '          <div class="flex">';
      html += '            <img src="imgs/'+ n.nftcontract +'.png" alt="" class="coinImg">';
      html += '            <div style="min-width:128px;">';
      html += '              <div class="coin">'+ n.nftcontract +'</div>';
      html += '              <div class="contractTip">'+ n.protocol +'</div>';
      html += '            </div>';
      // html += '            <div style="flex:1;padding-left:20px;font-size: 20px;">（数量：'+ n.tokencount +'）</div>';
      html += '          </div>';
      html += '          <div style="flex:1;"></div>';
      html += '        </div>';
    })

      html += '        <div class="item flex" onclick="selectContract(2,\'xlootndxbow1\')">';
      html += '          <div class="flex">';
      html += '            <img src="imgs/xlootndxbow1.png" alt="" class="coinImg">';
      html += '            <div style="min-width:128px;">';
      html += '              <div class="coin">xlootndxbow1</div>';
      html += '              <div class="contractTip">UCAT</div>';
      html += '            </div>';
      // html += '            <div style="flex:1;padding-left:20px;font-size: 20px;">（数量：'+ n.tokencount +'）</div>';
      html += '          </div>';
      html += '          <div style="flex:1;"></div>';
      html += '        </div>';
    // html += '        <div class="item flex" onclick="selectContract(1)">';
    // html += '          <div class="flex">';
    // html += '            <img src="imgs/xpetartnftcc.png" alt="" class="coinImg">';
    // html += '            <div>';
    // html += '              <div class="coin">xpetartnftcc</div>';
    // html += '              <div class="contractTip">UCAT</div>';
    // html += '            </div>';
    // html += '          </div>';
    // html += '          <div style="flex:1;"></div>';
    // html += '        </div>';



    html += '      </div>';

    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    html += '<div class="alert" id="userMsgBox" style="display: none;">';
    html += '  <div class="flex" style="height: 100%;">';
    html += '    <div class="panel">';
    html += '      <div class="userName">'+ getCookie("account") +'</div>';
    html += '      <div class="nav">';
    html += '        <a class="item" href="myAssets.html">我的资产 >></a>';
    html += '      </div>';
    html += '    </div>';
    html += '    <div style="flex:1;height: 100%;" onclick="showUserPanel()"></div>';
    html += '  </div>';
    html += '</div>';

    $('body').append(html);
  }
  $("#contractBox").show();
}


function getNodePanel(){
  if ($('#nodePanel').length == 0) {
    var html = '';


    html += '<div class="alert" id="nodePanel" style="">';
    html += '  <div class="flex" style="height:100%;">';
    html += '    <div class="content" style="height: 410px;">';
    html += '      <div class="header flex">';
    html += '        <span>选择节点</span>';
    html += '        <span style="flex:1;"></span>';
    html += '        <span onclick="$(\'#nodePanel\').hide()"><img src="imgs/close.png" alt="" class="closeSvg"></span>';
    html += '      </div>';
    html += '      <div class="nodeSet">';


    $.each(API_ENDPOINTS2,function(i,n){
      var active = '';
      var index = getCookie("nodeIndex") || nodeIndex;
      console.log(i,i == 0, i == "0")
      if(i == index){
        active = 'act';
      }

      html += '        <div class="nodeList" onclick="selectionNode('+ i +')">';
      html += '          <div class="icon '+ active +'">';
      html += '            <span>节点'+ (i + 1) +'：</span>';
      html += '            <span>https://'+ n +'</span>';
      html += '          </div>';
      html += '        </div>';


    })


    html += '        <div class="flex" style="margin-top:20px;"><div class="actionBtn" onclick="setNode()">确认</div></div>';
    html += '      </div>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';





    $('body').append(html);
  }else{

  }
  $("#nodePanel").show();

}
function selectContract(num,contractData){
  // if(num == 0){
  //   // nftContractName = "xlootshovel1";
  //   setCookie("nftcontract",'xlootshovel1');
  //   $.each(nftcontract,function(i,n){
  //     if("xlootshovel1" == n.nftcontract){
  //       setCookie("scope",n.mid);
  //     }
  //   })
    
  // }else if(num == 1){
  //   setCookie("nftcontract",'xpetartnftcc');
  //   $.each(nftcontract,function(i,n){
  //     if("xpetartnftcc" == n.nftcontract){
  //       setCookie("scope",n.mid);
  //     }
  //   })
  //   // nftContractName = "xpetartnftcc";
  // }else if(num == 2){
  //   setCookie("nftcontract",'xpetartnftcc');
  //   $.each(nftcontract,function(i,n){
  //     if("xpetartnftcc" == n.nftcontract){
  //       setCookie("scope",n.mid);
  //     }
  //   })
  //   // nftContractName = "xpetartnftcc";
  // }else if(num == -1){
  //   setCookie("scope",'');
  //   setCookie("nftcontract",'');

  // }else{
  //   if($("#userInputContractBox").val() == ''){
  //     showMsg("请输入您的NFT资产合约名");
  //     return
  //   }
  //   setCookie("nftcontract",$("#userInputContractBox").val())

  // }

  if(num >= 0){
    setCookie("nftcontract",contractData);
    setCookie("scope",'');
    $.each(nftcontract,function(i,n){
      if(contractData == n.nftcontract){
        setCookie("scope",n.mid);
      }
    })
  }else if(num == -1){
    setCookie("scope",'');
    setCookie("nftcontract",'');
  }else{
    if($("#userInputContractBox").val() == ''){
      showMsg("请输入您的NFT资产合约名");
      return
    }
    setCookie("nftcontract",$("#userInputContractBox").val());
  }


  $('#contractBox').hide();
  window.location.reload();
}

function goBack(){
  history.go(-1);
}


function showLoadingMsg(content) {
  if ($('#loadingBox').length == 0) {
    var html = '';
    html += '<div id="loadingBox" style="position: fixed;top: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.5);z-index:9999">';
    html += '  <div class="flex" style="width: 100%;height: 100%;">';
    html += '    <div style="padding:30px;background: rgba(0,0,0,0.7);color:#fff;text-align: center;border-radius: 10px;">';
    html += '      <img src="imgs/loading.gif" alt=""><br>';
    html += '      <div class="loadingMsg"></div>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
    $("body").append(html)
  }
  if(content == ''){
    $(".loadingMsg").html('').css("margin-top","0");
  }else{
    $(".loadingMsg").html(content).css("margin-top","10px");
  }
  
  $("#loadingBox").show();
  // setTimeout('$("#loadingBox").fadeOut()', 1500);
}

function getUniteSalePriceShow(tag){
  return parseFloat(tag).toFixed(4) + ' ' + String(tag).split(' ')[1];
}

function getLinkData(api,selfData,fun){

  $.post(api + "/v1/chain/get_table_rows", JSON.stringify(selfData),
    function(data, status) {
      if(status){
        fun(data);
      }else{
        console.log("获取不到数据",api,selfData)
        // getLinkData(api,selfData,fun);
      }
    }, "json"
  );

}

