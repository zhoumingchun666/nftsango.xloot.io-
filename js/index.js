var selectNum = 1;
var kingContractName = "xkingbattle1";
var kingMsg = [];
var myknightMsg = {};
var myNftOnkingMsg = [];
var selectKing = '';
var selectMyNftTagNum = 0;
var selectStackID = [];
var selectUnStackID = [];
var userActionKing = 1;
var userActionType = '';
var userActionsOnKing = 1;
var battlelogTimer = '';
var kingBattleTime = '';
var intMsgTimer = '';

var myNftListData = {};
var myNftListPage = 0;
var myNftListSize = 12;
var limit = 1288;
var myStackNftListData = {};
var myStackNftListPage = 0;
var myStackNftListSize = 12;
var stackTimer = {};
var userSelectParvalue = 0;

var armsData = [{
  "id": 0,
  "name": "xlootshovel1"
}, {
  "id": 1,
  "name": "xlootndxbow1"
}, {
  "id": 2,
  "name": "lootnftarrow"
}, {
  "id": 3,
  "name": "lootnftsickl"
}, {
  "id": 4,
  "name": "lootnftsword"
}, {
  "id": 5,
  "name": "lootnftaxe11"
}, {
  "id": 6,
  "name": "lootnftspear"
}, {
  "id": 7,
  "name": "lootnfthamme"
}]

var options = {
  useEasing: true, //使用缓和效果
  useGrouping: false, //使用分组效果
  separator: ',', //分离器，数据够三位，例如100,000
  decimal: '.', //小数点分割，例如：10.00
  prefix: '', //第一位默认数字
  suffix: '' //最后一位默认数字
};
//hp totalHp  prizePool
var sanguoCommonPrizePool = '';
var commonNftcount = '';
var commonQuantity = '';
var commonTimebonus = '';
var myKingFreeAct_01 = '';
var myKingFreeAct_02 = '';
var myKingFreeAct_03 = '';
var myMiningActData = '';

var commonTimebonusNum = 0;
var commonEosbonusNum = 0;

var sanguoMsg = {
  'sanguo_01': {
    'id': 1,
    'hp': '',
    'def': '',
    'burse': '',
    'supplyACT': '',
    'totalACT': '',
    'totalHP': '',
    'brokencount': ''
  },
  'sanguo_02': {
    'id': 2,
    'hp': '',
    'def': '',
    'burse': '',
    'supplyACT': '',
    'totalACT': '',
    'totalHP': '',
    'brokencount': ''
  },
  'sanguo_03': {
    'id': 3,
    'hp': '',
    'def': '',
    'burse': '',
    'supplyACT': '',
    'totalACT': '',
    'totalHP': '',
    'brokencount': ''
  }
}

$(function() {
  intMsg();
  // clearInterval(intMsgTimer);
  intMsgTimer = setInterval(function() {
    intMsg();
  }, 5000)

  // clearInterval(battlelogTimer);
  battlelogTimer = setInterval(function() {
    getBattleLog();
  }, 3000)
  // getMyNftList();
})

function intMsg() {
  getKingdomMsg();
  getContracthead();
  getCommonPrizePool();
}



// get my nft
function getMyNftList() {
  myNftListPage = 0;
  var loadHtml = '<div class="flex"><div style="padding:30px;background: rgba(0,0,0,0.7);color:#fff;text-align: center;border-radius: 10px;"><img src="imgs/loading.gif" alt=""><br><div style="margin-top:13px;">加载中...</div></div></div>'
  $(".myNftListBox ul").html(loadHtml);


  var code = '';
  var scope = getCookie("account");
  for (var i = 0; i < armsData.length; i++) {
    if (armsData[i].id == selectMyNftTagNum) {
      code = armsData[i].name;
    }

  }

  var api = 'https://' + get_random_api2();
  // var api = get_random_api();
  var selfData = {
    json: true,
    code: code,
    scope: scope,
    table: 'tokens',
    index_position: 3,
    key_type: "i64",
    lower_bound: '',
    limit: limit,
    reverse: true,
    show_payer: false,
  }
  $.post(api + "/v1/chain/get_table_rows", JSON.stringify(selfData),
    function(data, status) {

      myNftListData.content = [];
      myNftListData.more = data["more"];
      myNftListData.next_key = data["next_key"];
      for (x in data["rows"]) {
        var obj = data["rows"][x];
        myNftListData.content[x] = obj;
      }
      myNftListData.totalElements = data["rows"].length;
      myNftListData.size = myNftListSize;
      myNftListData.totalPages = Math.ceil(data["rows"].length / myNftListSize);

      getMyNftListShow(myNftListPage);


    }, "json");


}

function getMyNftListShow(page) {
  // var myNftListData = {};
  // var myNftListPage = 0;
  // var myNftListSize = 12;
  userSelectParvalue = 0;
  selectStackID = [];
  $(".myNftListBox .all").removeClass("active");

  myNftListPage = page;
  var data = myNftListData;
  var obj = myNftListData.content;
  var html = '';
  var html2 = '';
  var loadHtml = '<div class="flex"><div style="padding:30px;background: rgba(0,0,0,0.7);color:#fff;text-align: center;border-radius: 10px;"><img src="imgs/loading.gif" alt=""><br><div style="margin-top:13px;">加载中...</div></div></div>'
  $(".list").html(loadHtml);

  $.each(obj, function(i, n) {

    if (i >= myNftListPage * myNftListSize && ((myNftListPage + 1) * myNftListSize) > i) {


      html += '<li onclick="selectMyStackNft(' + n.id + ',this,' + Number(parseFloat(n.parvalue)) + ')">';
      html += '  <div style="width:93px;height:93px;"><img src="' + n.imageUrl + '"></div>';
      html += '  <div class="text">' + parseFloat(n.parvalue) + ' ' + String(n.parvalue).split(" ")[1] + '</div>';
      html += '  <div class="nftQualityBox">' + n.title + ' (' + n.quality + ')</div>';
      html += '</li>';

      // getNftMsg(n);
    }



  })

  if (html == '' || obj == '') {
    $(".myNftListBox ul").html('<div class="flex" style="color:#e9d9b2;font-size:20px;padding-top: 52px;"">你没有该类型的武器</div>');
  } else {
    $(".myNftListBox ul").html(html);
  }

  html2 += '<div class="Pagination-pages">';
  var num = 10,
    startIndex, endIndex, total;
  total = data.totalPages;
  // if (total < num) {
  //   num = total;
  // }
  // if (page > 5) {
  //   if (total <= page + 5) {
  //     startIndex = page - (num - (total - page));
  //     endIndex = startIndex + 10;
  //   } else {
  //     startIndex = page - 5;
  //     endIndex = page + 5;
  //   }
  // } else {
  //   startIndex = 0;
  //   endIndex = num;
  // }
  // for (var i = startIndex; i < endIndex; i++) {
  //   if (i == page) {
  //     html2 += '<div class="Pagination-page active" onclick="getMyNftListShow(' + i + ')">' + (i + 1) + '</div>';
  //   } else {
  //     html2 += '<div class="Pagination-page" onclick="getMyNftListShow(' + i + ')">' + (i + 1) + '</div>';
  //   }
  // }
  // html2 += '</div>';
  html2 += '<div>';
  if (page == 0) {
    html2 += '  <div class="Pagination-button disabled">';
  } else {
    html2 += '  <div class="Pagination-button" onclick="getMyNftListShow(' + (page - 1) + ')">';
  }
  html2 += '      上一页';
  html2 += '  </div>';

  if (page == total - 1 || total == 0) {
    html2 += '  <div class="Pagination-button disabled">';
  } else {
    html2 += '  <div class="Pagination-button" onclick="getMyNftListShow(' + (page + 1) + ')">';
  }
  html2 += '      下一页';
  html2 += '  </div>';
  html2 += '</div>'
  $(".myNftListBox .Pagination").html(html2);

}

// get my stack nft
function getMyStackNftList() {

  myStackNftListPage = 0;
  var loadHtml = '<div class="flex"><div style="padding:30px;background: rgba(0,0,0,0.7);color:#fff;text-align: center;border-radius: 10px;"><img src="imgs/loading.gif" alt=""><br><div style="margin-top:13px;">加载中...</div></div></div>'
  $(".guoKuNftListBox ul").html(loadHtml);



  if (!checkLogin()) {
    return
  }

  var scope = getCookie("account");

  var api = 'https://' + get_random_api2();
  // var api = get_random_api();
  var selfData = {
    json: true,
    code: kingContractName,
    scope: scope,
    table: 'stakenft',
    index_position: 4, //3面值  
    key_type: "i64",
    lower_bound: '',
    limit: limit,
    reverse: true,
    show_payer: false,
  }



  $.post(api + "/v1/chain/get_table_rows", JSON.stringify(selfData),
    function(data, status) {


      myStackNftListData.content = [];
      myStackNftListData.more = data["more"];
      myStackNftListData.next_key = data["next_key"];
      for (x in data["rows"]) {
        var obj = data["rows"][x];
        myStackNftListData.content[x] = obj;
        myNftOnkingMsg[x] = obj;
      }
      myStackNftListData.totalElements = data["rows"].length;
      myStackNftListData.size = myStackNftListSize;
      myStackNftListData.totalPages = Math.ceil(data["rows"].length / myStackNftListSize);

      getMyStackNftListShow(myStackNftListPage);



    }, "json");


}

function getMyStackNftListShow(page) {
  // var myStackNftListData = {};
  // var myStackNftListPage = 0;
  // var myStackNftListSize = 12;

  selectUnStackID = [];
  $(".guoKuNftListBox .all").removeClass("active");

  myStackNftListPage = page;
  var data = myStackNftListData;
  var obj = myStackNftListData.content;
  var html = '';
  var html2 = '';
  var loadHtml = '<div class="flex"><div style="padding:30px;background: rgba(0,0,0,0.7);color:#fff;text-align: center;border-radius: 10px;"><img src="imgs/loading.gif" alt=""><br><div style="margin-top:13px;">加载中...</div></div></div>'
  $(".guoKuNftListBox ul").html(loadHtml);

  $.each(obj, function(i, n) {

    if (i >= myStackNftListPage * myStackNftListSize && ((myStackNftListPage + 1) * myStackNftListSize) > i) {

      html += '<li id="UnStackNft_' + n.id + '" onclick="selectMyUnStackNft(' + n.id + ',this)">';
      html += '  <div class="stackNftImgs" style="width:93px;height:93px;background: #181b25;"><img src="' + n.imageUrl + '"></div>';
      html += '  <div class="text">' + parseFloat(n.parvalue) + ' ' + String(n.parvalue).split(" ")[1] + '</div>';
      html += '  <div class="kingText">' + getKingName(n.kingdomid) + '</div>';
      html += '  <div class="nftQualityBox">算力：' + n.power + '</div>';
      html += '  <div class="stackTimeTag"></div>';
      html += '</li>';
      // getNftMsg(n);
      stackTimeTagShow(n.id, n.stacktime);


      // id: 100016
      // imageUrl: "https://xpet-game-1251625178.file.myqcloud.com/images/shovellv4.png"
      // kingdomid: 3
      // nftcontract: "xlootshovel1"
      // parvalue: "4.0000 LOOT"
      // power: 83
      // quality: 9686
      // stacktime: "2020-11-27T07:21:26"

    }



  })

  if (html == '' || obj == '') {
    $(".guoKuNftListBox ul").html('<div class="flex" style="color:#e9d9b2;font-size:20px;padding-top: 52px;">你没有可出库的武器</div>');
  } else {
    $(".guoKuNftListBox ul").html(html);
  }
  html2 += '<div class="Pagination-pages">';
  var num = 10,
    startIndex, endIndex, total;
  total = data.totalPages;
  // if (total < num) {
  //   num = total;
  // }
  // if (page > 5) {
  //   if (total <= page + 5) {
  //     startIndex = page - (num - (total - page));
  //     endIndex = startIndex + 10;
  //   } else {
  //     startIndex = page - 5;
  //     endIndex = page + 5;
  //   }
  // } else {
  //   startIndex = 0;
  //   endIndex = num;
  // }
  // for (var i = startIndex; i < endIndex; i++) {
  //   if (i == page) {
  //     html2 += '<div class="Pagination-page active" onclick="getMyNftListShow(' + i + ')">' + (i + 1) + '</div>';
  //   } else {
  //     html2 += '<div class="Pagination-page" onclick="getMyNftListShow(' + i + ')">' + (i + 1) + '</div>';
  //   }
  // }
  // html2 += '</div>';
  html2 += '<div>';
  if (page == 0) {
    html2 += '  <div class="Pagination-button disabled">';
  } else {
    html2 += '  <div class="Pagination-button" onclick="getMyStackNftListShow(' + (page - 1) + ')">';
  }
  html2 += '      上一页';
  html2 += '  </div>';

  if (page == total - 1 || total == 0) {
    html2 += '  <div class="Pagination-button disabled">';
  } else {
    html2 += '  <div class="Pagination-button" onclick="getMyStackNftListShow(' + (page + 1) + ')">';
  }
  html2 += '      下一页';
  html2 += '  </div>';
  html2 += '</div>'
  $(".guoKuNftListBox .Pagination").html(html2);

}

function stackTimeTagShow(id, stackTime) {
  var time = getUTCTime(stackTime);
  if (stackTimer["UnStackNft_" + id]) {
    clearInterval(stackTimer["UnStackNft_" + id]);
  }

  if (time < 0) {
    $("#UnStackNft_" + id + " .stackTimeTag").html("");
  } else {
    stackTimer["UnStackNft_" + id] = setInterval(function() {
      var endTime = getUTCTime(stackTime);
      endTime = 0 - (endTime - 600);
      var m = String(parseInt(endTime / 60 % 60));
      var s = String(parseInt(endTime % 60));
      if (m.length == 1) {
        m = '0' + m;
      }
      if (s.length == 1) {
        s = '0' + s;
      }
      console.log("UnStackNft_" + id, time, stackTime, endTime);
      if (endTime < 0) {
        clearInterval(stackTimer["UnStackNft_" + id]);
        $("#UnStackNft_" + id + " .stackTimeTag").html("");
      } else {
        $("#UnStackNft_" + id + " .stackTimeTag").html(m + ":" + s);
      }
    }, 1000)
  }
}


//get my nft token msg
function getNftMsg(obj) {

  var scope = getCookie("account");
  var contract = obj.nftcontract;
  var tokenid = obj.id;
  var api = get_random_api();
  var selfData = {
    json: true, // Get the response as json
    code: contract, // Contract that we target
    scope: kingContractName, // Account that owns the data
    table: 'tokens', // Table name
    index_position: 1, // Table secondary index
    lower_bound: tokenid, // Table primary key value
    key_type: 'i64',
    limit: 1, // Here we limit to 1 to get only the single row with primary key equal to 'testacc'
    reverse: false, // Optional: Get reversed data
    show_payer: false,
  }

  $.post(api + "/v1/chain/get_table_rows", JSON.stringify(selfData),
    function(data, status) {
      // console.log("nftMsgsjk:",status);
      if (!status) {
        getNftMsg(obj);
      }
      for (x in data["rows"]) {
        var obj = data["rows"][x];
        // console.log(obj,'#UnStackNft_' + obj.id + ' img');

        $('#UnStackNft_' + obj.id + ' .stackNftImgs').html('<img src="' + obj.imageUrl + '">');
        // $('#UnStackNft_' + obj.id + ' .text').html("品质:" + obj.quality);
      }
    }, "json");


}

// select
function selectPanelShow(num, self) {
  $(".navList li").removeClass("active");
  $(self).addClass("active");
  if (num == 0) {
    clearInterval(battlelogTimer);
    getMyNftList();
    $(".myNFT").show();
    $(".sanguo").hide();
    $(".guoKu").hide();
  } else if (num == 1) {

    clearInterval(battlelogTimer);
    battlelogTimer = setInterval(function() {
      getBattleLog();
    }, 3000)
    getKingdomMsg();
    $(".myNFT").hide();
    $(".sanguo").show();
    $(".guoKu").hide();
  } else {
    clearInterval(battlelogTimer);
    getMyStackNftList();
    $(".myNFT").hide();
    $(".sanguo").hide();
    $(".guoKu").show();
  }
}

function selectNftListShow(num, self) {
  $(".nftList li").removeClass("active");
  $(self).addClass("active");
  selectMyNftTagNum = num;
  getMyNftList();
}

function selectMyNft(num, self) {
  $(".nftList li").removeClass("active");
  $(self).addClass("active");
}

// MY NFT
function selectMyStackNft(num, self, parvalue) {
  if ($(self).hasClass("active")) {
    $(self).removeClass("active");
    userSelectParvalue -= parvalue;
    var index = selectStackID.indexOf(num);
    selectStackID.splice(index, 1);
  } else {
    $(self).addClass("active");

    var checkExist = false;
    for (var i = 0; i < selectStackID.length; i++) {
      if (selectStackID[i] == num) {
        checkExist = true;
      }
    }
    if (checkExist) {
      return
    }

    userSelectParvalue += parvalue;
    selectStackID.push(num);
    selectStackID.sort(function(a, b) {
      return a - b
    });
  }
  // $(".myNftListBox li").removeClass("active");
  // $(self).addClass("active");
}

// MY UnStack NFT
function selectMyUnStackNft(num, self) {
  if ($(self).hasClass("active")) {
    $(self).removeClass("active");
    var index = selectUnStackID.indexOf(num);
    selectUnStackID.splice(index, 1);
  } else {
    $(self).addClass("active");


    var checkExist = false;
    for (var i = 0; i < selectUnStackID.length; i++) {
      if (selectUnStackID[i] == num) {
        checkExist = true;
      }
    }
    if (checkExist) {
      return
    }

    selectUnStackID.push(num);
    selectUnStackID.sort(function(a, b) {
      return a - b
    });
  }
  // $(".myNftListBox li").removeClass("active");
  // $(self).addClass("active");
}
// stack msg
function selectStackCountry(num, self) {
  selectKing = num;
  var kingTag = getKingName(selectKing);
  var html = '';
  var parValue = 0;

  var money = Number(1.0000 * selectStackID.length).toFixed(4);
  $(".stackCountryBox .countryList li").removeClass("active");
  $(self).addClass("active");

  if (myknightMsg) {
    if (myknightMsg[selectKing]) {
      parValue = myknightMsg[selectKing].parvalue
    }
  }


  html += '已上交武器总面值：' + Number(parseFloat(parValue)).toFixed(4) + ' LOOT<br>';
  html += '本次上交武器面值：' + Number(userSelectParvalue).toFixed(4) + ' LOOT<br><br>';
  html += '国家总面值超过 200 后，再提交武器到该国家将不会产生算力<br><br>';
  html += "你确定花费" + money + " eos，上交" + selectStackID.length + "个武器进库到" + kingTag + "吗？";

  $("#stacknftBox .stackMsgBox").html(html);

}

function selectCountryAction(num, self) {
  userActionsOnKing = num;
  // var kingTag = 'A国家';
  // if(num == 2){
  //   kingTag = 'B国家';
  // }else if(num == 3){
  //   kingTag = 'C国家';
  // }
  $("#kingMsgSHow .countryList li").removeClass("active");
  $(self).addClass("active");
  getUserSelectLookHtml(num, userActionType);
  // getUserActionLookHtml(userActionsOnKing,userActionType);

}

function getKingdomMsg() {
  // return

  var api = get_random_api();
  var selfData = {
    json: true,
    code: kingContractName,
    scope: kingContractName,
    table: 'kingdom',
    index_position: 1,
    key_type: "i64",
    lower_bound: '',
    limit: 10,
    reverse: false,
    show_payer: false,
  }


  getLinkData(api, selfData, function(data) {

    for (x in data["rows"]) {
      kingMsg[x] = data["rows"][x];
      kingMsg[x].supplyACT = Math.floor(Number(parseFloat(kingMsg[x].supplyACT) / Math.pow(10, 8)));
      kingMsg[x].totalACT = Math.floor(Number(parseFloat(kingMsg[x].totalACT) / Math.pow(10, 8)));
      kingMsg[x].useACT = Math.floor(Number(parseFloat(kingMsg[x].useACT) / Math.pow(10, 8)));


      var progress = Number(kingMsg[x].hp / kingMsg[x].totalHP * 100).toFixed(2);

      $.each(sanguoMsg, function(i, n) {
        if (Number(x) == Number(n.id - 1)) {
          // if(typeof balance02 == 'object'){
          //   balance02.update(minepool_bal2);
          // }else{
          //   balance02 = new CountUp("supply", 0, 0.00000000, 8, 3, options);

          //   balance02.update(minepool_bal2);
          // }
          if (typeof n.hp != 'object') {
            n.hp = new CountUp("sanguoHp_0" + Number(n.id), 0, 0, 0, 3, options);
          }
          n.hp.update(kingMsg[x].hp);

          if (typeof n.totalHP != 'object') {
            n.totalHP = new CountUp("sanguoTotalHp_0" + Number(n.id), 0, 0, 0, 3, options);
          }
          n.totalHP.update(kingMsg[x].totalHP);

          if (typeof n.def != 'object') {
            n.def = new CountUp("sanguoDef_0" + Number(n.id), 0, 0, 0, 3, options);
          }
          n.def.update(kingMsg[x].def);

          if (typeof n.brokencount != 'object') {
            n.brokencount = new CountUp("sanguoBrokencount_0" + Number(n.id), 0, 0, 0, 3, options);
          }
          n.brokencount.update(kingMsg[x].brokencount);



          if (typeof n.totalpower != 'object') {
            n.totalpower = new CountUp("sanguoTotalpower_0" + Number(n.id), 0, 0, 0, 3, options);
          }
          n.totalpower.update(kingMsg[x].totalpower);

          if (typeof n.supplyACT != 'object') {
            n.supplyACT = new CountUp("sanguoSupplyACT_0" + Number(n.id), 0, 0, 0, 3, options);
          }
          n.supplyACT.update(kingMsg[x].supplyACT);

          if (typeof n.totalACT != 'object') {
            n.totalACT = new CountUp("sanguoTotalACT_0" + Number(n.id), 0, 0, 0, 3, options);
          }
          n.totalACT.update(kingMsg[x].totalACT);

          if (typeof n.burse != 'object') {
            n.burse = new CountUp("sanguoBurse_0" + Number(n.id), 0, 0.0000, 4, 3, {
              useEasing: true,
              useGrouping: false,
              separator: ',',
              decimal: '.',
              prefix: '',
              suffix: ' ' + String(kingMsg[x].burse).split(' ')[1]
            });
          }
          n.burse.update(parseFloat(kingMsg[x].burse));
          console.log(parseFloat(kingMsg[x].burse));

        }
      })

      $(".guoLiBox .progress").eq(x).css("width", progress + "%");

    }
    if (kingMsg == '') {
      return
    }

    // var inputTime = "2020-11-23T10:31:00";
    var inputTime = kingMsg[1].start;
    var time = getUTCTime(inputTime);
    clearInterval(kingBattleTime);
    if (time < 0) {
      // $(".sanGuoTime").html("三国争霸未开始");
      console.log("三国争霸未开始",time,inputTime);

      // clearInterval(kingBattleTime);
      kingBattleTime = setInterval(function() {
        var time2 = getUTCTime(inputTime);
        time2 = 0 - time2;
        var h = parseInt(time2 / 60 / 60);
        var m = String(parseInt(time2 / 60 % 60));
        var s = String(parseInt(time2 % 60));
        if (m.length == 1) {
          m = '0' + m;
        }
        if (s.length == 1) {
          s = '0' + s;
        }
        if (time2 < 0) {

          // clearInterval(kingBattleTime);

        } else {
          $(".sanGuoTime").html("战斗将 " + h + "小时 " + m + "分 " + s + "秒后开始");
        }
      }, 1000)

    } else if (time - kingMsg[1].period > 60) {
      $(".sanGuoTime").html("三国争霸已结束");
      getKingResultShow();
    } else {
      kingBattleTime = setInterval(function() {
        // var time2 = getUTCTime(kingMsg[1].start);
        var time2 = getUTCTime(inputTime);
        var endTime = parseInt(kingMsg[1].period) - parseInt(time2);
        var d = parseInt(endTime / (60 * 60 * 24));
        var h = parseInt(endTime / 60 / 60);
        var m = String(parseInt(endTime / 60 % 60));
        var s = String(parseInt(endTime % 60));
        if (m.length == 1) {
          m = '0' + m;
        }
        if (s.length == 1) {
          s = '0' + s;
        }
        if (endTime < 0) {
          $(".sanGuoTime").html("三国争霸结算中......");
          clearInterval(kingBattleTime);
          clearInterval(intMsgTimer);
          setTimeout(function() {
            intMsg();
            clearInterval(intMsgTimer);
            intMsgTimer = setInterval(function() {
              intMsg();
            }, 5000)
          }, 60000)
        } else {
          $(".sanGuoTime").html("战斗时间剩余 " + h + "小时 " + m + "分 " + s + "秒");
        }

        // console.log(kingMsg[1].period,time,h,m,s);
      }, 1000)
    }

    if (getCookie("account")) {
      getMyknightMsg(1);
      getMyknightMsg(2);
      getMyknightMsg(3);
    } else {
      $(".noNftOnKingBox").show();
    }

  })


}


function getCommonPrizePool() {
  var api = get_random_api();
  var selfData = {
    json: true,
    code: kingContractName,
    scope: kingContractName,
    table: 'pubburse',
    index_position: 1,
    key_type: "i64",
    lower_bound: '',
    limit: 1,
    reverse: true,
    show_payer: false,
  }
  getLinkData(api, selfData, function(data) {
    for (x in data["rows"]) {
      var obj = data["rows"][x];
      if (typeof sanguoCommonPrizePool != 'object') {
        sanguoCommonPrizePool = new CountUp("sanguoCommonPrizePool", 0, 0.0000, 4, 3, {
          useEasing: true,
          useGrouping: false,
          separator: ',',
          decimal: '.',
          prefix: '',
          suffix: ' ' + String(obj.quantity).split(' ')[1]
        });
      }
      sanguoCommonPrizePool.update(parseFloat(obj.quantity));
      commonEosbonusNum = parseFloat(obj.quantity);
    }
  })
}

function getContracthead() {
  var api = get_random_api();
  var selfData = {
    json: true,
    code: kingContractName,
    scope: kingContractName,
    table: 'contracthead',
    index_position: 1,
    key_type: "i64",
    lower_bound: '',
    limit: 1,
    reverse: true,
    show_payer: false,
  }
  getLinkData(api, selfData, function(data) {
    for (x in data["rows"]) {

      var obj = data["rows"][x];

      if (typeof commonQuantity != 'object') {
        commonQuantity = new CountUp("commonQuantity", 0, 0.0000, 4, 3, {
          useEasing: true,
          useGrouping: false,
          separator: ',',
          decimal: '.',
          prefix: '',
          suffix: ' ' + String(obj.quantity).split(' ')[1]
        });
      }
      commonQuantity.update(parseFloat(obj.quantity));

      if (typeof commonTimebonus != 'object') {
        commonTimebonus = new CountUp("commonTimebonus", 0, 0.00000000, 8, 3, {
          useEasing: true,
          useGrouping: false,
          separator: ',',
          decimal: '.',
          prefix: '',
          suffix: ' ' + String(obj.timebonus).split(' ')[1]
        });
      }
      commonTimebonus.update(parseFloat(obj.timebonus));
      commonTimebonusNum = parseFloat(obj.timebonus);

      if (typeof commonNftcount != 'object') {
        commonNftcount = new CountUp("commonNftcount", 0, 0, 0, 3, options);
      }
      commonNftcount.update(parseFloat(obj.nftcount));

    }
  })
}

function getMyknightMsg(num) {


  var api = get_random_api();
  var selfData = {
    json: true,
    code: kingContractName,
    scope: num,
    table: 'knight',
    index_position: 1,
    key_type: "i64",
    lower_bound: getCookie("account"),
    limit: 1,
    reverse: false,
    show_payer: false,
  }
  $.post(api + "/v1/chain/get_table_rows", JSON.stringify(selfData),
    function(data, status) {

      for (x in data["rows"]) {
        if (data["rows"][x].acc == getCookie("account")) {

          myknightMsg[num] = data["rows"][x];
          myknightMsg[num].freeact = Math.floor(Number(parseFloat(myknightMsg[num].freeact) / Math.pow(10, 8)));
          myknightMsg[num].totalact = Math.floor(Number(parseFloat(myknightMsg[num].totalact) / Math.pow(10, 8)));

          var balance = '';
          var times = 0;
          var myMiningAct;
          var proportion;


          $.each(kingMsg, function(i, n) {
            if (n.id == num) {
              balance = (n.totalACT - n.supplyACT) / n.period;
              proportion = myknightMsg[num].power / n.totalpower;
            }
          })
          // console.log(myknightMsg[num]);
          //           kingMsg[1]
          // brokencount: 0
          // burse: "0.2370 EOS"
          // def: 0
          // hp: 95112352
          // id: 2
          // period: 604800
          // protsecond: 0
          // start: "2020-11-22T11:00:00"
          // supplyACT: 28163
          // totalACT: 600000
          // totalHP: 105000000
          // totalpower: 4487
          // useACT: 22485

          if(getUTCTime(kingMsg[0].start) > kingMsg[0].period){
            times = kingMsg[0].period - (getUTCTime(kingMsg[0].start) - getUserUTC(myknightMsg[num].lastdriptime))

          }else if (myknightMsg[num].lastdriptime) {
            times = getUserUTC(myknightMsg[num].lastdriptime);
          }

          myMiningAct = balance * times * proportion;
          console.log("times",times)



          // $("#userActionBox .myMiningAct").html(myMiningAct);

          //Action Panel
          if (num == userActionKing) {
            //(使用+拥有)/国家已挖

            var userScale = parseFloat(myknightMsg[userActionKing].totalact + myknightMsg[userActionKing].freeact) / parseFloat(kingMsg[userActionKing - 1].supplyACT);
            var myEosIncome = (commonEosbonusNum * 0.6 * 0.9 + parseFloat(kingMsg[userActionKing - 1].burse)) * userScale;
            var myTimeIncome = commonTimebonusNum * 0.6 * 0.9 * userScale;
            if (isNaN(myEosIncome)) {
              myEosIncome = 0;
            }
            if (isNaN(myTimeIncome)) {
              myTimeIncome = 0;
            }


            // console.log(commonEosbonusNum, commonEosbonusNum * 0.6, parseFloat(kingMsg[userActionKing - 1].burse), userScale)
            $("#userActionBox .myParvalue").html(myknightMsg[num].parvalue);

            $("#userActionBox .myFreeact").html(myknightMsg[num].freeact);
            $("#userActionBox .myTotalact").html(myknightMsg[num].totalact);

            $("#userActionBox .myEosIncome").html(Number(myEosIncome).toFixed(4) + " EOS");
            $("#userActionBox .myTimeIncome").html(Number(myTimeIncome).toFixed(8) + " TIME");



            $("#userActionBox .myPower").html(myknightMsg[num].power);
            $("#userActionBox .myNftcount").html(myknightMsg[num].nftcount);
            // if($("#myMiningActData").length != 0){
            //   if(typeof myMiningActData != 'object'){
            //     myMiningActData = new CountUp("myMiningActData", 0, 0.00000000, 8, 3, options);
            //   }
            //   if(!isNaN(myMiningAct)){
            //     myMiningActData.update(myMiningAct);
            //   }
            // }

          }
          console.log("data:", balance, times, proportion)
          if (num == 1) {
            if (typeof myKingFreeAct_01 != 'object') {
              myKingFreeAct_01 = new CountUp("myKingFreeAct_01", 0, 0.00000000, 8, 3, options);
            }
            if (!isNaN(myMiningAct)) {
              myKingFreeAct_01.update(myMiningAct);
            }
            console.log("myMiningAct_01:", myMiningAct);
          } else if (num == 2) {
            if (typeof myKingFreeAct_02 != 'object') {
              myKingFreeAct_02 = new CountUp("myKingFreeAct_02", 0, 0.00000000, 8, 3, options);
            }
            if (!isNaN(myMiningAct)) {
              myKingFreeAct_02.update(myMiningAct);
            }
            console.log("myMiningAct_02:", myMiningAct);
          } else {
            if (typeof myKingFreeAct_03 != 'object') {
              myKingFreeAct_03 = new CountUp("myKingFreeAct_03", 0, 0.00000000, 8, 3, options);
            }
            if (!isNaN(myMiningAct)) {
              myKingFreeAct_03.update(myMiningAct);
            }


            console.log("myMiningAct_03:", myMiningAct);
          }



        }

        // acc: "xpetbenson12"
        // eosasset: "0 "
        // freeact: 1524
        // freeslot: 0
        // lastdriptime: "2020-11-23T10:35:32"
        // nftcount: 1
        // parvalue: "4.0000 LOOT"
        // power: 124
        // timeasset: "0 "
        // totalact: 0



      }


      if (myknightMsg) {
        if (myknightMsg[num]) {
          $(".joinBtn").eq(num - 1).show();
          $(".myKingMsgShowPanelBox").eq(num - 1).show();
          $(".noNftOnKingBox").eq(num - 1).hide();
        } else {
          $(".joinBtn").eq(num - 1).hide();
          $(".myKingMsgShowPanelBox").eq(num - 1).hide();
          $(".noNftOnKingBox").eq(num - 1).show();
        }
      } else {
        $(".joinBtn").eq(num - 1).hide();
        $(".myKingMsgShowPanelBox").eq(num - 1).hide();
        $(".noNftOnKingBox").eq(num - 1).show();
      }
      // console.log(num,num-1,$(".noNftOnKingBox").eq(num-1))


    }, "json");
}



function stacknftBoxShow() {
  selectKing = '';
  $("#stacknftBox .countryList li").removeClass("active");
  if (!checkLogin()) {
    return
  }
  if (selectStackID.length == 0) {
    showMsg("请选择武器");
    return
  }

  // var kingTag = getKingName(1);
  // if(selectKing){
  //   kingTag = getKingName(selectKing);
  // }
  // var money = Number(1.0000 * selectStackID.length).toFixed(4);
  // $("#stacknftBox .stackMsgBox").html("你确定花费"+ money +" eos，上交"+ selectStackID.length +"个武器进库到"+ kingTag +"吗？");

  $("#stacknftBox .stackMsgBox").html("请选择一个国家提交武器");

  $("#stacknftBox").show();
}


function unStacknftBoxShow() {
  if (!checkLogin()) {
    return
  }
  if (selectUnStackID.length == 0) {
    showMsg("请选择武器");
    return
  }

  // var kingTag = 'A国家';
  // if(selectKing == 2){
  //   kingTag = 'B国家';
  // }else if(selectKing == 3){
  //   kingTag = 'C国家';
  // }
  // var money = Number(0.0001 * selectUnStackID.length).toFixed(4);
  $("#unStacknftBox .stackMsgBox").html("你确定出库" + selectUnStackID.length + "个武器吗？");

  $("#unStacknftBox").show();
}


//user select Action
function selectYourAction(king, type) {
  if (!myknightMsg) {
    showMsg("请上交武器到该国家，再进行操作！");
    return
  } else if (!myknightMsg[king]) {
    showMsg("请上交武器到该国家，再进行操作！");
    return
  } else if (myknightMsg[king].power == 0) {
    showMsg("请上交武器到该国家，再进行操作！");
    return
  }
  userActionKing = king;
  userActionType = type;


  getUserActionLookHtml(king, type);
  $("#kingMsgSHow").show();

}

function getKingName(num) {
  var tag = '魏国';
  switch (String(num)) {
    case "2":
      tag = '蜀国';
      break
    case "3":
      tag = '吴国';
      break
  }
  return tag;
}


function getUserOnKingAct(num) {
  var tag = '--';
  // $.each(myknightMsg,function(i,n){
  //   if(num == (i+1) ){
  //     tag = n.totalact;
  //   }
  // })
  if (myknightMsg) {
    if (myknightMsg[num]) {
      tag = myknightMsg[num].freeact;
    }
  }

  // console.log(tag,num,)
  return tag;
}

function getUserActionLookHtml(king, type) {
  //1 fire 2 heal 3 defence
  var kingHtml = '';
  var html = '';
  userActionsOnKing = '';
  switch (String(type)) {
    case "fire":
      $("#kingActionTitle").html("攻击信息");

      break;
    case "defence":
      $("#kingActionTitle").html("加防信息");

      break;
    case "heal":
      $("#kingActionTitle").html("回血信息");

      break;
      // default:

  }

  kingHtml += '<li onclick="selectCountryAction(1,this)">' + getKingName(1) + '</li>';
  kingHtml += '<li onclick="selectCountryAction(2,this)">' + getKingName(2) + '</li>';
  kingHtml += '<li onclick="selectCountryAction(3,this)">' + getKingName(3) + '</li>';



  html += '<div style="width: 100%;">';
  // $.each(kingMsg,function(i,n){
  //   if(userActionsOnKing == n.id){

  //     html += '  <div>'+ getKingName(userActionsOnKing) +'的血量：'+ n.hp +'</div>';
  //     html += '  <div>'+ getKingName(userActionsOnKing) +'的防御：'+ n.def +'</div>';
  //     html += '  <div>可用行动点：'+ getUserOnKingAct(userActionKing) +'</div>';
  //     html += '  <div class="flex">使用行动点：<input type="number" placeholder="请输入要使用的行动点数" id="userUsePoint" oninput="estimatedResultShow()"></div>';


  //   }
  // })
  html += '<div style="text-align:center;">请选择目标国家</div>';
  // html += '  <div id="estimatedResultTag" style="margin-top:8px;"></div>';

  html += '</div>';

  $("#kingMsgSHow .countryList").html(kingHtml);
  $("#kingMsgSHow .kingMsgBox").html(html);
}

function getUserSelectLookHtml(king, type) {
  //1 fire 2 heal 3 defence
  var kingHtml = '';
  var html = '';
  userActionsOnKing = king;



  html += '<div style="width: 100%;">';
  $.each(kingMsg, function(i, n) {
    if (king == n.id) {
      html += '  <div>' + getKingName(king) + '的血量：' + n.hp + '</div>';
      html += '  <div>' + getKingName(king) + '的防御：' + n.def + '</div>';
      html += '  <div>可用行动点：' + getUserOnKingAct(userActionKing) + '</div>';
      html += '  <div class="flex">使用行动点：<input type="number" placeholder="请输入要使用的行动点数" id="userUsePoint" oninput="estimatedResultShow()"></div>';

    }
  })
  // if(type == "fire"){
  //   html += '  <div>你确定花费<span>1行动点，攻击'+ getKingName(king) +'吗？</div>';
  // }else if(type == "defence"){
  //   html += '  <div>你确定花费1行动点，给'+ getKingName(king) +'加防御力？</div>';
  // }else{
  //   html += '  <div>你确定花费1行动点，给'+ getKingName(king) +'加血？</div>';
  // }
  html += '  <div id="estimatedResultTag" style="margin-top:8px;"></div>';

  html += '</div>';

  $("#kingMsgSHow .kingMsgBox").html(html);
}

function estimatedResultShow() {
  var num = $("#userUsePoint").val();
  var html = '';
  if (num > 0) {
    var usePoint = getUserOnKingAct(userActionKing);
    var poingConstant = Math.pow(0.5, Math.floor(usePoint / 5000));

    if (userActionType == "fire") {
      // var tag = Number(myknightMsg[userActionKing].power * num * poingConstant * 3) - kingMsg[userActionsOnKing-1].def;
      var tag = Number(myknightMsg[userActionKing].power * num * poingConstant * 3);
      if (tag < 0) {
        tag = 0;
      }
      html += '  <div>预计能给 ' + getKingName(userActionsOnKing) + ' 造成 ' + tag + ' 伤害 </div>';
      html += '  <div>你确定花费 ' + num + ' 行动点，攻击 ' + getKingName(userActionsOnKing) + ' 吗？</div>';
    } else if (userActionType == "defence") {
      var tag = Number(myknightMsg[userActionKing].power * num * poingConstant / 2).toFixed(0);
      html += '  <div>预计能给 ' + getKingName(userActionsOnKing) + ' 加 ' + tag + ' 防御 </div>';
      html += '  <div>你确定花费' + num + '行动点，给' + getKingName(userActionsOnKing) + '加防御？</div>';
    } else {
      var increaseBlood = kingMsg[userActionsOnKing - 1].totalHP - kingMsg[userActionsOnKing - 1].hp;
      var tag = myknightMsg[userActionKing].power * num * poingConstant;
      if (tag > increaseBlood) {
        tag = increaseBlood;
      }
      html += '  <div>预计能给 ' + getKingName(userActionsOnKing) + ' 加 ' + tag + ' 血量 </div>';
      html += '  <div>你确定花费' + num + '行动点，给' + getKingName(userActionsOnKing) + '加血？</div>';
    }

    $("#estimatedResultTag").html(html);
  } else {
    $("#estimatedResultTag").html('');
  }
}

function userActionOK() {
  if (userActionsOnKing == '') {
    showMsg("请选择目标国家");
    return
  }
  if ($("#userUsePoint").val() == '') {
    showMsg("请输入要使用的点数");
    return
  }


  var actpoint = Number($("#userUsePoint").val()) * Math.pow(10, 8);
  var fromUser = getCookie("account");
  checkScatter(function(user) {
    var authorization;
    const eos = loot.scatter.eos(network, Eos);
    const account = user.name;
    authorization = [{
      actor: account,
      permission: user.authority
    }]
    var selfData = {
      acc: fromUser,
      actpoint: actpoint,
      fromkingdom: userActionKing,
      tokingdom: userActionsOnKing
    }

    var actions = [{
      account: kingContractName,
      name: userActionType,
      authorization: authorization,
      data: selfData
    }];
    eos.transaction({
      actions: actions
    }).then(res => {
      if (userActionType == "fire") {
        showMsg("攻击成功！");
      } else if (userActionType == "heal") {
        showMsg("回血成功！");
      } else if (userActionType == "defence") {
        showMsg("加防成功！");
      }
      $('#kingMsgSHow').hide();
      $('#userActionBox').hide();
      setTimeout(function() {
        getKingdomMsg();
      }, 1000)

    }).catch(e => {

      eosErrorShow(e);
    });
  })
}

function stacknft() {
  if (selectKing == '') {
    showMsg("请选择一个国家提交武器");
    return
  }

  var money = Number(1.0000 * selectStackID.length).toFixed(4);

  var fromUser = getCookie("account");
  var contract = '';
  var eosMemo = "BUYSLOT-" + selectStackID.length + "-" + selectKing;



  checkScatter(function(user) {
    var authorization;
    const eos = loot.scatter.eos(network, Eos);
    const account = user.name;
    authorization = [{
      actor: account,
      permission: user.authority
    }]

    var actions = [{
      account: "eosio.token",
      name: 'transfer',
      authorization: authorization,
      data: {
        from: fromUser,
        to: kingContractName,
        quantity: money + " EOS",
        memo: eosMemo
      }
    }];

    var contract = '';
    for (var i = 0; i < armsData.length; i++) {
      if (armsData[i].id == selectMyNftTagNum) {
        contract = armsData[i].name;
      }
    }
    $.each(selectStackID, function(i, n) {

      actions[i + 1] = {
        account: contract,
        name: 'transfer',
        authorization: authorization,
        data: {
          id: n,
          from: fromUser,
          to: kingContractName,
          memo: "STACKNFT-" + n + "-" + selectKing
        }
      }

    })

    // console.log("actions:",actions)
    // return

    eos.transaction({
      actions: actions
    }).then(res => {
      showMsg("进库成功！");
      $('#stacknftBox').hide();
      setTimeout(function() {
        getMyNftList();
      }, 3000)


    }).catch(e => {

      eosErrorShow(e);
    });
  })
}

function unStacknft() {


  var fromUser = getCookie("account");
  checkScatter(function(user) {
    var authorization;
    const eos = loot.scatter.eos(network, Eos);
    const account = user.name;
    authorization = [{
      actor: account,
      permission: user.authority
    }]

    var actions = [];



    $.each(selectUnStackID, function(i, n) {
      var kingdomid = '';
      for (var a = 0; a < myNftOnkingMsg.length; a++) {
        // console.log(myNftOnkingMsg[a].id,n,myNftOnkingMsg[a]);
        if (myNftOnkingMsg[a].id == n) {
          kingdomid = myNftOnkingMsg[a].kingdomid;
        }
      }
      actions[i] = {
        account: kingContractName,
        name: 'unstacknft',
        authorization: authorization,
        data: {
          acc: fromUser,
          id: n,
          kingdomid: kingdomid
        }
      }

    })

    // console.log("actions:",actions)
    // return

    eos.transaction({
      actions: actions
    }).then(res => {
      showMsg("出库成功！");
      $('#unStacknftBox').hide();
      getMyStackNftList();

    }).catch(e => {

      eosErrorShow(e);
    });
  })
}


function checkLogin() {
  if (!getCookie("account")) {
    showMsg("请登录");
    setTimeout(function() {
      eosLogin();
    }, 520)

    return false
  }
  return true
}

function mining(num) {
  if (!myknightMsg) {
    showMsg("请上交武器到该国家，再进行操作！")
    return
  } else if (!myknightMsg[num]) {
    showMsg("请上交武器到该国家，再进行操作！")
    return
  }
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
      name: 'mining',
      authorization: authorization,
      data: {
        acc: fromUser,
        kingdomid: num
      }
    }];


    // console.log("actions:",actions)
    // return

    eos.transaction({
      actions: actions
    }).then(res => {
      showMsg("收取行动点成功！");
      setTimeout(function() {
        getMyknightMsg(num);
      }, 500)

      // $('#stacknftBox').hide();
    }).catch(e => {

      eosErrorShow(e);
    });
  })
}

function userAction(king) {

  if (!checkLogin()) {
    eosLogin()
    return
  }
  var html = '';
  var html2 = '';


  html2 += '我的总面值：<span class="myParvalue">--</span><br>';
  html2 += '我的总算力：<span class="myPower">--</span><br>';
  html2 += '我的武器数量：<span class="myNftcount">--</span><br>';

  html2 += '<div class="flex">';
  html2 += '  可使用行动点：<span class="myFreeact">--</span>';
  html2 += '  <img src="imgs/q.png" style="width:22px;margin-left:10px;" onclick="descriptionMsgBoxShow(\'aboutPoint\')">';
  html2 += '  <span style="flex:1;"></span>';
  html2 += '</div>';

  // html2 += '可使用行动点：<span class="myFreeact">--</span><br>';

  html2 += '已投入行动点：<span class="myTotalact">--</span><br>';
  html2 += '<div class="flex">';
  html2 += '  EOS预期收益：<span class="myEosIncome">--</span>';
  html2 += '  <img src="imgs/q.png" style="width:22px;margin-left:10px;" onclick="descriptionMsgBoxShow(\'myEosIncome\')">';
  html2 += '  <span style="flex:1;"></span>';
  html2 += '</div>';
  html2 += '<div class="flex">';
  html2 += '  TIME预期收益：<span class="myTimeIncome">--</span>';
  html2 += '  <img src="imgs/q.png" style="width:22px;margin-left:10px;" onclick="descriptionMsgBoxShow(\'myTimeIncome\')">';
  html2 += '  <span style="flex:1;"></span>';
  html2 += '</div>';
  // html2 += '待领取行动点：<span class="myMiningAct" id="myMiningActData">--</span><br>';



  html += '<div class="btn" onclick="selectYourAction(' + king + ',\'fire\')">攻击</div>';
  html += '<div class="btn" onclick="selectYourAction(' + king + ',\'defence\')">加防</div>';
  html += '<div class="btn" onclick="selectYourAction(' + king + ',\'heal\')">回血</div>';
  // html += '<div class="btn" onclick="mining('+ king +')">领取行动点</div>';

  $("#userActionBox .sanguoBox").html(html);
  $("#userActionBox .stackMsgBox div").html(html2);
  $("#userActionBox").show();
  myMiningActData = '';
  userActionKing = king;
  getMyknightMsg(king);
}

function getBattleLog() {
  var lower = Number(getCookie("battlelog")) || '';
  var api = get_random_api();
  var selfData = {
    json: true,
    code: kingContractName,
    scope: kingContractName,
    table: 'battlelog',
    index_position: 1,
    key_type: "i64",
    lower_bound: lower,
    // upwer_bound:lower,
    limit: 1,
    reverse: true,
    show_payer: false,
  }
  var api = get_random_api();
  getLinkData(api, selfData, function(data) {
    var obj = data.rows;
    $.each(obj, function(i, n) {
      var memo = '';
      if (n.act == "FIRE") {
        memo = getKingName(n.fromkingdom) + n.from + '消耗' + Math.floor(Number(n.point / Math.pow(10, 8))) + '行动点进攻' + getKingName(n.tokingdom) + '，造成' + n.value + '伤害';
      } else if (n.act == "DEFENCE") {
        memo = getKingName(n.fromkingdom) + n.from + '消耗' + Math.floor(Number(n.point / Math.pow(10, 8))) + '行动点增加' + getKingName(n.tokingdom) + n.value + '点防御';
      } else if (n.act == "HEAL") {
        memo = getKingName(n.fromkingdom) + n.from + '消耗' + Math.floor(Number(n.point / Math.pow(10, 8))) + '行动点回复' + getKingName(n.tokingdom) + n.value + '点血量';
      } else if (n.act == "ROB") {
        memo = getKingName(n.tokingdom) + '被' + getKingName(n.fromkingdom) + n.from + '打爆，金库被掠夺一空，损失' + Number(n.value / 10000).toFixed(4) + ' eos';
      }
      battlelogShow(memo, n.id);

    })

    console.log("战斗记录:", data);
  });
}


function battlelogShow(msg, id) {

  if ($("#battlelog_" + id).length == 0) {
    var html = '';
    var log = Number(getCookie("battlelog2")) || 0;
    if (id != log) {

      html += '<div id="battlelog_' + id + '" class="msgCon2" style="/* display: none; */">';
      html += '  <p class="msg">' + msg + '</p>';
      html += '</div>';
      $("body").append(html);
      $("#battlelog_" + id).animate({
        top: '10%',
        opacity: '0.52',
      }, 6800, function() {
        $("#battlelog_" + id).fadeOut().remove();
      });
      // setCookie("battlelog",log+1);
      setCookie("battlelog2", id);
      setCookie("battlelog", '');
    }

  }

}

function goToStackNftOnKing() {
  $("header .navList li").eq(0).click();
}


function selectMyNftAll() {
  selectStackID = [];
  $(".myNftListBox li").removeClass("active");
  if ($(".myNftListBox .all").hasClass("active")) {
    $(".myNftListBox .all").removeClass("active");
  } else {
    $(".myNftListBox .all").addClass("active");
    $(".myNftListBox li").click();
  }
}

function selectMyStackNftAll() {
  selectUnStackID = [];
  $(".guoKuNftListBox li").removeClass("active");
  if ($(".guoKuNftListBox .all").hasClass("active")) {
    $(".guoKuNftListBox .all").removeClass("active");
  } else {
    $(".guoKuNftListBox .all").addClass("active");
    $(".guoKuNftListBox li").click();
  }
}

function descriptionMsgBoxShow(tag) {
  var html = '';
  var title = '说明';
  switch (tag) {
    case "stackNft":
      title = '武器进库';
      html += '1、每个账号在某一个国家质押NFT矿机的总面值上限200，首次超过200后，再次抵押，将不增加矿机算力</br></br>';
      html += '2、玩家每质押一件NFT矿机，需缴纳1eos的保管费，解压NFT矿机不收费</br></br>';
      html += '3、每质押一件NFT矿机，需10分钟后才能解压</br>';
      break
    case "aboutPoint":
      title = '行动点';
      html += '行动效果根据累积的行动点执行减半机制，数值参照行动效果算法</br></br>';
      html += '行动效果算法：单个账号在每个国家累积5000行动点以内，行动效果（进攻、加防、回血）系数为1，超过5000点，行动效果减半，以此类推</br>';

      html += '<table style="margin-bottom: 10px;" border="">';
      html += '  <tbody>';
      html += '    <tr>';
      html += '      <td>累积行动点</td>';
      html += '      <td>行动效果</td>';
      html += '    </tr>';
      html += '    <tr>';
      html += '      <td>5000以下（不包含5000）</td>';
      html += '      <td>1</td>';
      html += '    </tr>';
      html += '    <tr>';
      html += '      <td>5000-9999</td>';
      html += '      <td>0.5</td>';
      html += '    </tr>';
      html += '    <tr>';
      html += '      <td>10000-14999</td>';
      html += '      <td>0.25</td>';
      html += '    </tr>';
      html += '    <tr>';
      html += '      <td>15000-19999</td>';
      html += '      <td>0.125</td>';
      html += '    </tr>';
      html += '  </tbody>';
      html += '</table>';
      break
    case "point":
      title = '行动点';
      html += '1、行动点不能转移、交易、提取，只能在该国家中用于发起行动指令</br></br>';
      html += '2、使用行动点的前提是在该国家至少质押一件NFT矿机，全部解压以后，行动点将无法使用</br></br>';
      break
    case "treasury":
      title = '金库';
      html += '1、一个国家血量被其他国家打到0，该国家的国家金库将被开最后一炮的战士所在国家掠夺</br></br>';
      html += '2、金库掠夺没有次数限制，直至游戏结束，国家金库将固定并按规则进行该国的财富分配</br></br>';
      break
    case "timebonus":
      title = 'TIME奖池';
      html += '1、TIME奖池=初始底池+线性释放（分七天线性解锁）</br></br>';
      html += '2、TIME本轮初始底池30000time，根据NFT质押量线性释放TIME奖励，每质押1件NFT矿机，将释放1.5个TIME代币进入奖池</br></br>';
      html += '3、TIME最终奖池将预留10%作为下一轮TIME底池，剩余90%作为本轮奖池分配</br></br>';
      html += '4、TIME奖池分配规则：冠军国家分配60%，亚军国家分配30%，季军国家分配10%</br></br>';
      html += '5、单个账户分配规则：单个账户行动点消耗/该国行动点总消耗量*该国TIME分配总量</br></br>';
      html += '6、结算周期为游戏结束后一个工作日，奖励需在“我的资产”中自行提取</br></br>';
      break
    case "eosbonus":
      title = 'EOS奖池';
      html += '1、EOS最终奖池将预留10%作为下一轮EOS底池，剩余90%作为本轮EOS奖池分配</br></br>';
      html += '2、EOS奖池分配规则：冠军国家分配60%，亚军国家分配30%，季军国家分配10%</br></br>';
      html += '3、国家最终EOS奖池=国家金库+该国EOS分配总量</br></br>';
      html += '4、单个账户分配规则：单个账户行动点消耗/该国行动点总消耗量*该国EOS最终奖池总量</br></br>';
      html += '5、结算周期为游戏结束后一个工作日，奖励需在“我的资产”中自行提取</br></br>';
      break
    case "myEosIncome":
    case "myTimeIncome":
      title = '预期收益';
      html += '1、预期收益按该国金库当前金额+该国获胜条件下time及eos奖励，以及账户在该国消耗的行动点计算最佳收益</br></br>';
      html += '2、预期收益不等于最终收益，仅供玩家参考</br></br>';
      break
    case "myMoney":
      title = '我的资产';
      html += '总锁定TIME：<span id="myMoneyLockTime">--</span></br>';
      html += '已提取TIME：<span id="myMoneyWithTime">--</span></br>';
      html += '待领取EOS：<span id="myMoneyEos">--</span></br>';
      html += '锁定时间：<span id="myMoneyLockTimes">--</span></br>';
      html += '上次提取时间：<span id="myMoneyLastWithTimes">--</span></br>';
      html += '<div class="sanguoBox">可提取TIME：<span id="myMoneyLockWeek">--</span> TIME <div class="btn" style="margin-left:10px;" onclick="withMylockMoney()">提现</div></div></br></br>';
      break







    case "kingResult":
      title = '三国争霸结果';
      html += '<span style="font-weight:bolder;">奖池</span></br></br>';
      html += '<table style="margin-bottom: 10px;" border="">';
      html += '  <tbody>';
      html += '    <tr>';
      html += '      <td>排名</td>';
      html += '      <td>国家</td>';
      html += '      <td>EOS</td>';
      html += '      <td>TIME</td>';
      html += '    </tr>';
      var rank = getKingRank();

      $.each(rank,function(i,n){
        var rate = 0.1;
        if(i == 0){
          rate = 0.6;
        }else if(i == 1){
          rate = 0.3;
        }
        html += '    <tr>';
        html += '      <td>'+ (i+1) +'</td>';
        html += '      <td>'+ getKingName(n) +'</td>';

        html += '      <td>'+ Number(commonEosbonusNum * rate).toFixed(4) +'</td>';
        html += '      <td>'+ Number(commonTimebonusNum * rate).toFixed(8) +'</td>';

        html += '    </tr>';
      })

      html += '  </tbody>';
      html += '</table></br>';
      html += '<span style="font-weight:bolder;">金库</span></br></br>';
      html += '<table style="margin-bottom: 10px;" border="">';
      html += '  <tbody>';
      html += '    <tr>';
      // html += '      <td>排名</td>';
      html += '      <td>国家</td>';
      html += '      <td>金库</td>';
      html += '    </tr>';

      $.each(rank,function(i,n){
        html += '    <tr>';
        // html += '      <td>'+ (i+1) +'</td>';
        html += '      <td>'+ getKingName(n) +'</td>';
        html += '      <td>'+ kingMsg[n-1].burse +'</td>';
        html += '    </tr>';
      })



      html += '  </tbody>';
      html += '</table></br>';
      html += '<span style="font-weight:bolder;">血量与总算力</span></br></br>';
      html += '<table style="margin-bottom: 10px;" border="">';
      html += '  <tbody>';
      html += '    <tr>';
      // html += '      <td>排名</td>';
      html += '      <td>国家</td>';
      html += '      <td>血量</td>';
      html += '      <td>总算力</td>';
      html += '    </tr>';

      $.each(rank,function(i,n){
        html += '    <tr>';
        // html += '      <td>'+ (i+1) +'</td>';
        html += '      <td>'+ getKingName(n) +'</td>';
        html += '      <td>'+ kingMsg[n-1].hp +'</td>';
        html += '      <td>'+ kingMsg[n-1].totalpower +'</td>';
        html += '    </tr>';
      })



      html += '  </tbody>';
      html += '</table></br>';
      break


    case "about":
      title = '关于';

      html += '<span style="font-weight:bolder;">玩法介绍</span></br></br>';
      html += '1、三国争霸，每个国家的士兵使用行动点，对目标国家操作攻击、加防、回血三种指令，进行为期7天的国战，游戏结束时根据剩余血量排序分出冠亚季军，获得不同数量的time及eos奖励</br>';
      html += '2、和传统的国战玩法不同，士兵（单个EOS账号）无需加入固定国家，在该国家抵押NFT矿机即可获得对应行动点，可以同时在三个国家操作任意指令</br></br>';

      html += '<span style="font-weight:bolder;">关于国家</span></br></br>';
      html += '1、魏蜀吴三个国家，分为高行动点、高血、平衡三种类型：</br>';
      html += '<table style="margin-bottom: 10px;" border="">';
      html += '  <tbody>';
      html += '    <tr>';
      html += '      <td>国家</td>';
      html += '      <td>行动点上限</td>';
      html += '      <td>血量上限</td>';
      html += '      <td>初始防御力</td>';
      html += '    </tr>';
      html += '    <tr>';
      html += '      <td>魏国</td>';
      html += '      <td>675000</td>';
      html += '      <td>1亿</td>';
      html += '      <td>0</td>';
      html += '    </tr>';
      html += '    <tr>';
      html += '      <td>蜀国</td>';
      html += '      <td>600000</td>';
      html += '      <td>1亿500万</td>';
      html += '      <td>0</td>';
      html += '    </tr>';
      html += '    <tr>';
      html += '      <td>吴国</td>';
      html += '      <td>525000</td>';
      html += '      <td>1亿1000万</td>';
      html += '      <td>0</td>';
      html += '    </tr>';
      html += '  </tbody>';
      html += '</table>';
      html += '2、国家遭受攻击，先减防御力，再减血量，防御力为0，直接掉血</br>';
      html += '3、游戏结束时，血量最多的国家获得胜利</br></br>';

      html += '<span style="font-weight:bolder;">关于NFT质押</span></br></br>';
      html += '1、玩家可向任意国家质押任意NFT矿机，获取在该国的挖矿算力</br>';
      html += '2、可在“我的NFT”-“武器入库”点击问号查看详情</br></br>';

      html += '<span style="font-weight:bolder;">关于行动点</span></br></br>';
      html += '1、行动点根据单个账号抵押的NFT矿机总算力挖矿获得，需手动领取</br>';
      html += '2、行动点不能转移、交易、提取，只能在该国家中用于发起“进攻”“加防”“回血”三种指令</br>';
      html += '3、行动效果根据累积的行动点执行减半机制</br></br>';

      html += '<span style="font-weight:bolder;">关于金库</span></br></br>';
      html += '可在“战场”点击“金库”图标查看</br></br>';

      html += '<span style="font-weight:bolder;">关于保管费</span></br></br>';
      html += '用户每质押1件NFT矿机支付的1EOS保管费按分配规则：</br>';
      html += '10%官方收入</br>';
      html += '20%回购time：每笔按0.2eos比例，实时回购time</br>';
      html += '30%国家金库：每笔按0.3eos比例，进入该国家金库，当该国金库被掠夺后，再次抵押NFT，将重新累积国家金库</br>';
      html += '40%EOS奖池：每笔按0.3eos比例，，进入EOS奖池</br></br>';

      html += '<span style="font-weight:bolder;">关于奖池</span></br></br>';
      html += 'TIME奖励：可在“战场”-“TIME奖池”点击问号查看详情</br>';
      html += 'EOS奖励：可在“战场”-“EOS奖池”点击问号查看详情</br></br>';

      html += '<span style="font-weight:bolder;">关于胜利</span></br></br>';
      html += '1、游戏倒计时结束后，根据每个国家剩余血量排名，由于链上数据与前端数据同步有时间差，最终结果以链上数据返回前端后显示为准</br>';
      html += '2、如游戏结束后出现三个国家同血量情况，将根据国家总算力排行</br>';
      html += '3、赛季结果可在“战场”点击国家名字查看详情</br></br>';

      html += '<span style="font-weight:bolder;">关于邀请返佣</span></br></br>';
      html += '1、开NFT盲盒绑定的邀请人有矿税返佣，矿税为每笔收矿量（time和eos）的10%</br>';
      html += '2、一级邀请可获得40%矿税返佣，二级邀请可获得30%矿税返佣，官方获得矿税30%返佣</br></br>';

      html += '<span style="font-weight:bolder;">关于算法</span></br></br>';
      html += '1、矿机算力公式：</br>';
      html += '<table style="margin-bottom: 10px;" border="">';
      html += '  <tbody>';
      html += '    <tr>';
      html += '      <td>等级</td>';
      html += '      <td>品质范围</td>';
      html += '      <td>挖矿效率</td>';
      html += '    </tr>';
      html += '    <tr>';
      html += '      <td>木质</td>';
      html += '      <td>0-5000</td>';
      html += '      <td>1.1+0.4*（品质/2500）</td>';
      html += '    </tr>';
      html += '    <tr>';
      html += '      <td>铁质</td>';
      html += '      <td>4500-8000</td>';
      html += '      <td>1.2+0.4*（（品质-5000）/1500）</td>';
      html += '    </tr>';
      html += '    <tr>';
      html += '      <td>铜质</td>';
      html += '      <td>7200-9000</td>';
      html += '      <td>1.3+0.4*（（品质-8000）/500）</td>';
      html += '    </tr>';
      html += '    <tr>';
      html += '      <td>银质</td>';
      html += '      <td>8100-9800</td>';
      html += '      <td>1.4+0.4*（（品质-9000）/400）</td>';
      html += '    </tr>';
      html += '    <tr>';
      html += '      <td>金质</td>';
      html += '      <td>8800-9980</td>';
      html += '      <td>1.6+0.4*（（品质-9800）/90）</td>';
      html += '    </tr>';
      html += '    <tr>';
      html += '      <td>钻石质</td>';
      html += '      <td>9980-10000</td>';
      html += '      <td>1.4+0.4*（（品质-9980）/10）</td>';
      html += '    </tr>';
      html += '  </tbody>';
      html += '</table>';
      html += '2、我的算力=挖矿效率*面值*10</br>';
      html += '3、算力挖行动点公式：((国家总行动点 - 已挖出行动点 ) / 游戏周期) * 挖矿时间 * (我的算力/国家总算力)</br>';

      break
  }

  $("#descriptionMsgBox .desTitle").html(title);
  $("#descriptionMsgBox .stackCountryBox div").html(html);
  $("#descriptionMsgBox").show();
}

function getKingRank() {

  var obj = kingMsg;

  var id1, hp1, totalpower1;
  var id2, hp2, totalpower2;
  var id3, hp3, totalpower3;

  id1 = obj[0].id;
  id2 = obj[1].id;
  id3 = obj[2].id;

  hp1 = obj[0].hp;
  hp2 = obj[1].hp;
  hp3 = obj[2].hp;

  totalpower1 = obj[0].totalpower;
  totalpower2 = obj[1].totalpower;
  totalpower3 = obj[2].totalpower;


  if(compareking(id1, hp1, totalpower1, id2, hp2, totalpower2) && (compareking(id1, hp1, totalpower1, id3, hp3, totalpower3))){
    if(compareking(id2,hp2,totalpower2, id3,hp3,totalpower3)){
      return [1,2,3]
    }else{
      return [1,3,2]
    }
  }else if(compareking(id2, hp2, totalpower2, id1, hp1, totalpower1) && (compareking(id2, hp2, totalpower2, id3, hp3, totalpower3))){
    if(compareking(id1,hp1,totalpower1, id3,hp3,totalpower3)){
      return [2,1,3]
    }else{
      return [2,3,1]
    }
  }else if(compareking(id3, hp3, totalpower3, id1, hp1, totalpower1) && (compareking(id3, hp3, totalpower3, id2, hp2, totalpower2))){
    if(compareking(id1,hp1,totalpower1, id2,hp2,totalpower2)){
      return [3,1,2]
    }else{
      return [3,2,1]
    }
  }else {
    return [];
  }

}

function getKingResultShow() {
  var rank = getKingRank();
  $(".rank").removeClass("rank_01");
  $(".rank").removeClass("rank_02").attr("onclick","descriptionMsgBoxShow('kingResult')");
  $.each(rank, function(i, n) {
    if(i == 0){
      $(".rank").eq(n-1).addClass("rank_01");
    }else if(i == 1){
      $(".rank").eq(n-1).addClass("rank_02");
    }else{
    }
    
  })


}

function compareking(id1,hp1,totalpower1,id2,hp2,totalpower2) {
  if (hp1 > hp2) {
    return true;
  } else if (hp1 < hp2) {
    return false;
  } else {
    //血量相等
    if (totalpower1 > totalpower2) {
      return true;
    } else if (totalpower1 < totalpower2) {
      return false;
    } else {
      //血量和totalpower都相等
      if (id1 >= id2) {
        return true;
      } else {
        return false;
      }

    }
  }
}