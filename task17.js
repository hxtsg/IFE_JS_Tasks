/**
 * Created by 鑫 on 2016/8/1.
 */
function $(id)
{
    return document.getElementById(id);
}

var chart_wrap = $('chart_wrap');
var gra_time = $('form-gra-time');
var select_city = $('form-select-city');
var city_select = $('city-select');
/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: '北京',
  nowGraTime: "day"
}

var preState = {
    nowSelectCity: '北京',
  nowGraTime: "day"
};


/**
 * 渲染图表
 */
function getRandomColor(){
    var rand = Math.floor(Math.random() * 0xffffff).toString(16);
    if (rand.length === 6) {
        return '#' + rand;
    } else {
        return getRandomColor();
    }
}
function renderChart() {

    var html = "";
    for( var index in chartData ){
        var tmp_html = "<div class = 'dayBar' title =" + index + " style = 'height:" + chartData[index] + "px;background-color: " + getRandomColor() + "' ></div>"

        html += tmp_html;
    }
    chart_wrap.innerHTML = html;
    var barArray = document.querySelectorAll(".dayBar");
    for( item in barArray ){

    }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化
    if( preState.nowGraTime != pageState.nowGraTime ){
        preState.nowGraTime = pageState.nowGraTime;
        initAqiChartData();
        renderChart();
    }
  // 设置对应数据

  // 调用图表渲染函数
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化
    if( preState.nowSelectCity != pageState.nowSelectCity ){
        preState.nowSelectCity = pageState.nowSelectCity;
        initAqiChartData();
        renderChart();
    }
  // 设置对应数据

  // 调用图表渲染函数
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    preState.nowGraTime = pageState.nowGraTime;
    gra_time.addEventListener("click",function( ev ){
        var clickTarget = ev.target;
        console.log( clickTarget.type);
        if( clickTarget.type == "radio" ){
            pageState.nowGraTime = clickTarget.value;
            graTimeChange();
        }


    });
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {

    preState.nowSelectCity = pageState.nowSelectCity;
    for( var index in aqiSourceData ){
        var select_ele = document.createElement('option');
        select_ele.value = index;
        select_ele.textContent = index;

        city_select.appendChild( select_ele );
    }
    city_select.addEventListener( "change", function( ev ){
            pageState.nowSelectCity = ev.target.value;
            console.log( ev.target.value );
            citySelectChange();
        });


  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项

  // 给select设置事件，当选项发生变化时调用函数citySelectChange

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
    chartData = [];
    var tmp_chartData = aqiSourceData[ pageState.nowSelectCity ];
    switch( pageState.nowGraTime ){
        case 'day':
            chartData = tmp_chartData;
            break;
        case 'week':
            var dayCntInWeek = 0;
            var curMonth = 0;
            var curWeek = 0;
            var total = 0;
            for( time in tmp_chartData ){
                var date = new Date(time);
                if( curMonth != date.getMonth() ){ // same month?
                    chartData[ curMonth + " " + curWeek ] = total / dayCntInWeek;
                    curMonth = date.getMonth();
                    curWeek = 0;
                    total = 0;
                    dayCntInWeek = 0;
                }
                else if( date.getDay() == 0 && total != 0 ){ // same week?
                    chartData[ curMonth + " " + curWeek ] = total / dayCntInWeek;
                    curWeek ++;
                    total = 0;
                    dayCntInWeek = 0;
                }
                total += tmp_chartData[ time ];
                dayCntInWeek ++;
            }
            break;
        chartData[ curMonth + " " + curWeek ] = total / dayCntInWeek;
        case 'month':
            var curMonth = 0;
            var total = 0;
            var dayCnt = 0;
            for( time in tmp_chartData ){
                var date = new Date( time );
                if( curMonth != date.getMonth() ){
                    chartData[ curMonth ] = Math.floor( total / dayCnt );
                    total = dayCnt = 0;
                    curMonth ++;
                }
                total += tmp_chartData[ time ];
                dayCnt ++;
            }
            chartData[ curMonth ] = Math.floor( total / dayCnt );
            console.log( chartData );
            break;

    }

}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
    renderChart();

}

init();