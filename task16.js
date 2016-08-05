/**
 * Created by 鑫 on 2016/7/29.
 */


function $(id)
{
    return document.getElementById( id );
}

var aqi_city ;
var aqi_figure;
var aqi_submit;

var table_area;

var rst_list;

Init();
function Init()
{
    aqi_city = $('aqi_city');
    aqi_figure = $('aqi_figure');
    aqi_submit = $('aqi_submit');
    table_area = $('table_area');
    rst_list = new Array();
    aqi_submit.addEventListener( "click", submit_handle );
}

function submit_handle()
{
    var data = getData();
    if(!/^[a-zA-Z\u4e00-\u9fa5]+$/.test(data[0])){
		alert("城市名必须为中英文字符");

		return;
	}
	if(!/^[1-9]\d*$|^0$/.test(data[1])){
		alert("空气质量指数必须为整数");

		return;
	}
    rst_list.push( data );

    render();
}

function getData()
{
    var data_arr = new Array();
    var city = aqi_city.value;
    var figure = aqi_figure.value;

    data_arr.push( city, figure );
    return data_arr;
}



function render()
{
    table_area.innerHTML = "";
    var table = document.createElement('table');

    var table_node = document.createElement('tr');
    var head_text = [ "城市","空气质量","操作" ];
    for( var i = 0 ; i < head_text.length ; i ++ ){
        var table_head = document.createElement('th');
        table_head.textContent = head_text[ i ];
        table_node.appendChild(table_head);
    }
    table.appendChild( table_node );
    // append the head

    for( var i = 0 ; i < rst_list.length ; i ++ ){ // for each row
        var table_node = document.createElement('tr');
        for( var j = 0 ; j < 2 ; j ++ ){
            var td_ele = document.createElement('td');
            td_ele.textContent = rst_list[ i ][ j ];
            table_node.appendChild( td_ele );
        }
        var delete_btn = document.createElement('button');
        delete_btn.textContent = '删除';
        delete_btn.addEventListener( "click",function(ev) {
            var p_node = ev.target.parentNode;
            rst_list.splice( p_node.rowIndex - 1, 1 );
            render();
        });
        table_node.appendChild( delete_btn );
        table.appendChild( table_node );
    }
    table_area.appendChild( table );
}
