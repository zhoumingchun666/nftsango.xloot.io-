var selectNftcontract = '3';
var selectType = 0;
var dexNftMore = true;
var dexNftNext_key = '';
var dexNftListloading = false;
var dexListData = {};
var dexListType = '';
var dexPage = 0;
var dexSize = 6;
var limit = 1288;
//默认id反序   价格查    合约查   合约价格查


function selectSortType(self,num){
  dexListType = num;
  dexPage = 0;
  getDexListData();
  $(".selectTypeBtn .selectBox").html($(self).html());
}


function getDexListData() {
  var loadHtml = '<div class="flex"><div style="padding:30px;background: rgba(0,0,0,0.7);color:#fff;text-align: center;border-radius: 10px;"><img src="imgs/loading.gif" alt=""><br><div style="margin-top:13px;">加载中...</div></div></div>'
  $(".list").html(loadHtml);
  // var api = get_random_api();
  var api = 'https://' + get_random_api2();
  var selfData = {};
  var scope = dexContractName;
  var table = 'totalmarket';
  if(getCookie("scope")){

    scope = getCookie("scope");
    table = 'dexmarkets';
  }
  // dexListType = 3;
  switch (String(dexListType)) {
    // case '0':
    //   //price Positive  价格正序
    //   selfData = {
    //     json: true,
    //     code: dexContractName,
    //     scope: dexContractName,
    //     table: 'totalmarket',
    //     index_position: 3,
    //     lower_bound: '',
    //     key_type: 'i64',
    //     limit: limit,
    //     reverse: false,
    //     show_payer: false,
    //   }
    //   break;

    // case '1':

    //   //price Reverse  价格反序
    //   selfData = {
    //     json: true,
    //     code: dexContractName,
    //     scope: dexContractName,
    //     table: 'totalmarket',
    //     index_position: 3,
    //     lower_bound: '',
    //     key_type: 'i64',
    //     limit: limit,
    //     reverse: true,
    //     show_payer: false,
    //   }
      
    //   break;
    // case '2':

    //   //合约价格反序
    //   selfData = {
    //     json: true,
    //     code: dexContractName,
    //     scope: selectNftcontract,
    //     table: 'dexmarkets',
    //     index_position: 3,
    //     lower_bound: '',
    //     key_type: 'i64',
    //     limit: limit,
    //     reverse: true,
    //     show_payer: false,
    //   }
      
    //   break;
    // case '3':
    //   //合约价格  价格正序
    //   selfData = {
    //     json: true,
    //     code: dexContractName,
    //     scope: selectNftcontract,
    //     table: 'dexmarkets',
    //     index_position: 3,
    //     lower_bound: '',
    //     key_type: 'i64',
    //     limit: limit,
    //     reverse: false,
    //     show_payer: false,
    //   }
    //   break;
    // case 'priceHigh':
    //   selfData = {
    //     json: true,
    //     code: dexContractName,
    //     scope: dexContractName,
    //     table: 'totalmarket',
    //     index_position: 2,
    //     key_type:'i64',
    //     lower_bound: '',
    //     limit: limit,
    //     reverse: true,
    //     show_payer: false,
        
    //   }

    //   break;
    case 'priceHigh':
      selfData = {
        json: true,
        code: dexContractName,
        scope: scope,
        table: table,
        index_position: 3,
        key_type:'i64',
        lower_bound: '',
        limit: limit,
        reverse: true,
        show_payer: false,
        
      }

      break;
    case 'priceLow':
      selfData = {
        json: true,
        code: dexContractName,
        scope: scope,
        table: table,
        index_position: 3,
        key_type:'i64',
        lower_bound: '',
        limit: limit,
        reverse: false,
        show_payer: false,
        
      }

      break;
    case 'levelHigh':
      selfData = {
        json: true,
        code: dexContractName,
        scope: scope,
        table: table,
        index_position: 2,
        key_type:'i64',
        lower_bound: '',
        limit: limit,
        reverse: true,
        show_payer: false,
        
      }

      break;
    case 'levelLow':
      selfData = {
        json: true,
        code: dexContractName,
        scope: scope,
        table: table,
        index_position: 2,
        key_type:'i64',
        lower_bound: '',
        limit: limit,
        reverse: false,
        show_payer: false,
        
      }

      break;
    case 'idLow':
      selfData = {
        json: true,
        code: dexContractName,
        scope: scope,
        table: table,
        index_position: 1,
        key_type:'i64',
        lower_bound: '',
        limit: limit,
        reverse: false,
        show_payer: false,
        
      }

      break;
    case 'idHigh':
    default:
      //id Reverse
      selfData = {
        json: true,
        code: dexContractName,
        scope: scope,
        table: table,
        index_position: 1,
        key_type:'i64',
        lower_bound: '',
        limit: limit,
        reverse: true,
        show_payer: false,

      }

      break;
  }

  $.post(api + "/v1/chain/get_table_rows", JSON.stringify(selfData),
    function(data, status) {
      dexListData.content = [];
      dexListData.more = data["more"];
      dexListData.next_key = data["next_key"];
      for (x in data["rows"]) {
        var obj = data["rows"][x];
        dexListData.content[x] = obj;
        // console.log("priceShow:",obj.price);
      }
      dexListData.totalElements = data["rows"].length;
      dexListData.size = dexSize;
      dexListData.totalPages = Math.ceil(data["rows"].length / dexSize);
      // console.log("dexMsg:",dexListData);
      getMarketList(dexPage);
    }, "json");
}

function getMarketList(page) {
  dexPage = page;
  // if(dexPage * dexSize > 888){
  //   limit = 1500;
  //   getDexListData();
  //   return
  // }
  var data = dexListData;

  var obj = dexListData.content;
  var html = '';
  var html2 = '';
  var loadHtml = '<div class="flex"><div style="padding:30px;background: rgba(0,0,0,0.7);color:#fff;text-align: center;border-radius: 10px;"><img src="imgs/loading.gif" alt=""><br><div style="margin-top:13px;">加载中...</div></div></div>'
  $(".list").html(loadHtml);

  $.each(obj, function(i, n) {

    if (i >= dexPage * dexSize && ((dexPage + 1) * dexSize) > i) {
      // console.log("shjjj:", i, dexPage * dexSize, ((dexPage + 1) * dexSize))
      var tokenid = n.tokenid;
      var nftcontract = n.nftcontract;

      html += '<a id="nft_' + tokenid + '" href="nftAssets.html?tokenid=' + tokenid + '&nftcontract=' + nftcontract + '&type=1&owner=' + n.owner + '">';
      html += '  <div class="item">';
      html += '    <div class="nftImgs"></div>';
      html += '    <div class="parvalue flex">售价：' + getUniteSalePriceShow(n.price) + '</div>';

      html += '    <div class="itemMsg">';
      html += '      <div class="title">--</div>';
      html += '      <div class="nftcontract">合约：' + n.nftcontract + '</div>';
      html += '      <div class="valueBox">面值：<span class="value">--</span></div>';
      html += '      <div class="owner">拥有者：' + n.owner + '</div>';

      html += '    </div>';
      html += '  </div>';
      html += '</a>';

      getNftMsg(n);
    }



  })

  $(".list").html(html);
  html2 += '<div class="Pagination-pages">';
  var num = 10,
    startIndex, endIndex, total;
  total = dexListData.totalPages;
  if (total < num) {
    num = total;
  }
  if (page > 5) {
    if (total <= page + 5) {
      startIndex = page - (num - (total - page));
      endIndex = startIndex + 10;
    } else {
      startIndex = page - 5;
      endIndex = page + 5;
    }
  } else {
    startIndex = 0;
    endIndex = num;
  }
  for (var i = startIndex; i < endIndex; i++) {
    if (i == page) {
      html2 += '<div class="Pagination-page active" onclick="getMarketList(' + i + ')">' + (i + 1) + '</div>';
    } else {
      html2 += '<div class="Pagination-page" onclick="getMarketList(' + i + ')">' + (i + 1) + '</div>';
    }
  }
  html2 += '</div>';
  html2 += '<div>';
  if (page == 0) {
    html2 += '  <div class="Pagination-button disabled">';
  } else {
    html2 += '  <div class="Pagination-button" onclick="getMarketList(' + (page - 1) + ')">';
  }
  html2 += '      上一页';
  html2 += '  </div>';

  if (page == total - 1 || total == 0) {
    html2 += '  <div class="Pagination-button disabled">';
  } else {
    html2 += '  <div class="Pagination-button" onclick="getMarketList(' + (page + 1) + ')">';
  }
  html2 += '      下一页';
  html2 += '  </div>';
  html2 += '</div>'
  $(".Pagination").html(html2);

}
//dex market
function getTotalmarket() {
  return
  //close
  dexNftListloading = true;
  var api = get_random_api();
  var selfData = {
    json: true, // Get the response as json
    code: dexContractName, // Contract that we target
    scope: dexContractName, // Account that owns the data
    table: 'totalmarket', // Table name
    // index_position: 329,          // Table secondary index
    upper_bound: dexNftNext_key, // Table primary key value
    limit: 6, // Here we limit to 1 to get only the single row with primary key equal to 'testacc'
    reverse: true, // Optional: Get reversed data
    show_payer: false,
  }

  $.post(api + "/v1/chain/get_table_rows", JSON.stringify(selfData),
    function(data, status) {
      dexNftListloading = false;
      var html = '';
      for (x in data["rows"]) {
        var obj = data["rows"][x];
        var tokenid = obj.tokenid;
        var nftcontract = obj.nftcontract;

        html += '<a id="nft_' + tokenid + '" href="nftAssets.html?tokenid=' + tokenid + '&nftcontract=' + nftcontract + '&type=1&owner=' + obj.owner + '">';
        html += '  <div class="item">';
        html += '    <div class="nftImgs"></div>';
        html += '    <div class="parvalue flex">售价：' + obj.price + '</div>';

        html += '    <div class="itemMsg">';
        html += '      <div class="title">--</div>';
        html += '      <div class="nftcontract">合约：' + obj.nftcontract + '</div>';
        html += '      <div class="valueBox">面值：<span class="value">--</span></div>';
        html += '      <div class="owner">拥有者：' + obj.owner + '</div>';

        // html += '      <div class="curPriceContent flex">';
        // html += '        <div class="coinImgs"></div>';
        // html += '        <span class="curPrice">--</span>';
        // html += '        <span class="curUsd">$ --</span>';
        // html += '      </div>';
        // html += '      <div class="levelBox">--</div>';
        html += '    </div>';
        html += '  </div>';
        html += '</a>';

        getNftMsg(data["rows"][x]);

        // }

      }

      if (dexNftMore) {
        $(".list").append(html);
      }
      dexNftMore = data["more"];
      dexNftNext_key = data["next_key"];

    }, "json");


}

//nft msg
function getNftMsg(obj) {

  var contract = obj.nftcontract;
  var tokenid = obj.tokenid;
  var api = get_random_api();
  var selfData = {
    json: true, // Get the response as json
    code: contract, // Contract that we target
    scope: dexContractName, // Account that owns the data
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
        var tokenid = obj.id;
        var nftcontract = obj.owner;
        // var parvalueHtml = '<img src="imgs/' + getTokenImgs(String(obj.parvalue).split(' ')[1]) + '"> ' + String(obj.parvalue).split(' ')[0];
        // var parvalueHtml = '售价：' + obj.parvalue;

        $('#nft_' + tokenid + ' .nftImgs').html('<img src="' + obj.imageUrl + '">');
        $('#nft_' + tokenid + ' .value').html(obj.parvalue);


        $('#nft_' + tokenid + ' .title').html(obj.title + " ( 品质：" + obj.quality + " )");
        $('#nft_' + tokenid + ' .coinImgs').html('<img src="' + 'imgs/' + getTokenImgs(String(obj.parvalue).split(' ')[1]) + '">');

        $('#nft_' + tokenid + ' .curPrice').html(String(obj.parvalue).split(' ')[0]);
        $('#nft_' + tokenid + ' .levelBox').html('lll ' + obj.level);

        console.log("nftMsg:", obj, '#nft_' + nftcontract + '_' + tokenid + " .curPrice");

      }
    }, "json");


}



//Blind box
function getUserBlindBox() {
  var nftcontract = nftContractName;
  var api = get_random_api();
  var selfData = {
    json: true, // Get the response as json
    code: nftcontract, // Contract that we target
    scope: nftcontract, // Account that owns the data
    table: 'boxs', // Table name
    index_position: 2, // Table secondary index
    key_type: 'i64',
    lower_bound: 'xpetuser1211', // Table primary key value
    limit: 2, // Here we limit to 1 to get only the single row with primary key equal to 'testacc'
    reverse: false, // Optional: Get reversed data
    show_payer: false,
  }
  $.post(api + "/v1/chain/get_table_rows", JSON.stringify(selfData),
    function(data, status) {
      var html = '';
      for (x in data["rows"]) {
        var obj = data["rows"][x];
        var tokenid = obj.id;



        // html += '<a id="nft_' + obj.id + '" href="nftAssets.html?tokenid=' + obj.id + '&nftcontract=' + nftcontract + '&user=0">';
        // html += '  <div class="item">';
        // html += '    <div class="nftImgs"><img src="'+ obj.imageUrl +'"></div>';
        // html += '    <div class="parvalue flex"><img src="imgs/' + getTokenImgs(String(obj.parvalue).split(' ')[1]) + '"> ' + String(obj.parvalue).split(' ')[0] + '</div>';

        // html += '    <div class="itemMsg">';
        // html += '      <div class="title">'+ obj.title +' ( 品质：' + obj.quality + ' )</div>';
        // html += '      <div class="curPriceContent flex">';
        // html += '        <div class="coinImgs"><img src="imgs/'+ getTokenImgs(String(obj.parvalue).split(' ')[1]) +'"></div>';
        // html += '        <span class="curPrice">'+ String(obj.parvalue).split(' ')[0] +'</span>';
        // html += '        <span class="curUsd">$ --</span>';
        // html += '      </div>';
        // html += '      <div class="levelBox">lll ' + obj.level + '</div>';
        // html += '    </div>';
        // html += '  </div>';
        // html += '</a>';

        // getNftMsg(data["rows"][x]);


      }
      $(".list").html(html);


    }, "json");
}

getTotalmarket();
getContractsList();
// getUserBlindBox();
setInterval(function() {
  // getTotalmarket();
}, 3000)

function contractBoxShow() {

  $('#contractBox').show()
}

$(document).ready(function() {
  if(getCookie("scope")){
    var html = '';
    html += '<div class="item" onclick="selectSortType(this,\'priceHigh\')">价格从高到低</div>';
    html += '<div class="item" onclick="selectSortType(this,\'priceLow\')">价格从低到高</div>';
    $(".selectTypeBtn .selectBox").html('价格从高到低');
    $(".selectTypeBtn .selectList").html(html);
    dexListType = 'priceHigh';
  }else{
    var html = '';
    html += '<div class="item" onclick="selectSortType(this,\'idHigh\')">最近上架</div>';
    html += '<div class="item" onclick="selectSortType(this,\'idLow\')">最早上架</div>';
    html += '<div class="item" onclick="selectSortType(this,\'priceHigh\')">价格从高到低</div>';
    html += '<div class="item" onclick="selectSortType(this,\'priceLow\')">价格从低到高</div>';
    $(".selectTypeBtn .selectBox").html('最近上架');
    $(".selectTypeBtn .selectList").html(html);
    dexListType = 'idHigh';
  }
  getDexListData();
  if(getCookie("nftcontract")){
    $(".search .input").html(getCookie("nftcontract"));
  }
  // $('#getSaleMarketScroll').scroll(function() {
  //   var single_content = $('#getSaleMarketScroll').height();
  //   var srollPos = $('#getSaleMarketScroll').scrollTop(); // 滚动条距顶部距离(页面超出窗口的高度)
  //   var single_con_sh = $('#getSaleMarketScroll')[0].scrollHeight; // div的实际内容高度
  //   // console.log(single_content,srollPos,single_con_sh,single_con_sh - single_content - srollPos);
  //   totalheight = parseFloat(single_con_sh) - parseFloat(single_content) - parseFloat(srollPos);
  //   // console.log(srollPos,single_con_sh,totalheight,range)
  //   if (range >= totalheight) {
  //     if (Do_not_trigger) {
  //       Do_not_trigger = false;
  //       getSaleMarketPage++;
  //       getSaleMarket(getSaleMarketPage)
  //     }
  //   }
  // });

  // $(document).scroll(function() {

  //   //文档内容实际高度（包括超出视窗的溢出部分）
  //   var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  //   //滚动条滚动距离
  //   var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  //   //窗口可视范围高度
  //   var clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight);

  //   if (clientHeight + scrollTop >= scrollHeight) {
  //     if (dexNftMore) {
  //       if (!dexNftListloading) {
  //         getTotalmarket();
  //       }

  //     }
  //     console.log("===加载更多内容……===");
  //   }
  // })
})