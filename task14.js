/**
 * Created by 鑫 on 2016/7/28.
 */
function $(id){
    return document.getElementById(id);

}

var aqiList = [
  ["北京", 90],
  ["上海", 50],
  ["福州", 10],
  ["广州", 50],
  ["成都", 90],
  ["西安", 100]
];
(function(){

    
    window.onload = ShowData( aqiList );
}());

function ShowData( aqiData )
{
    var enoughList = new Array();
    for( var i = 0 ; i < aqiData.length ; i ++ ){
        if( aqiData[ i ][ 1 ] > 60  ){
            enoughList.push( aqiData[ i ] );
        }
    }
    // 清洗大于60的
    // 挨个创建li，并设置内容，并添加
    var ul = $('qua_list');
    enoughList.sort( function( a,b ){
        return b[1] - a[1];
    } );
    for( var i = 0 ; i < enoughList.length ; i ++ ){
        var li = document.createElement("li");
        li.textContent = "第" + parseInt(i + 1) + "名:"+enoughList[ i ][ 0 ] + ","+enoughList[ i ][ 1 ];
        ul.appendChild( li );
    }
}