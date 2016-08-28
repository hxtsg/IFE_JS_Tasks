/**
 * Created by 鑫 on 2016/8/27.
 */

// var $ = function( id ){
//     return document.querySelector( id );
// }



var FloatLayer = function( txt ){
    this.layerText = txt;
    this.body = $("body")[0];

}

FloatLayer.prototype.CreateLayer = function(){
    var blackveil_element = document.createElement('div');
    var floatlayer_element = document.createElement('div');
    var header_element = document.createElement('header');
    var header_span_element = document.createElement('span');
    var floatlayer_span = document.createElement('span');
    var btn1 = document.createElement('button');
    var btn2 = document.createElement('button');

    header_span_element.textContent = "浮动层";

    floatlayer_span.textContent = this.layerText;
    floatlayer_element.className = "float-layer";
    header_element.appendChild( header_span_element );
    floatlayer_element.appendChild( header_element );
    floatlayer_element.appendChild( floatlayer_span );

    btn1.className = 'btn';
    btn2.className = 'btn';
    btn1.style.right = "200px";
    btn2.style.right = "50px";
    btn1.textContent = "确定";
    btn2.textContent = "取消";
    btn1.addEventListener( "click", function( ev ){
        var tar = ev.target;

        window.floatLayer.RemoveLayer();
    });
    btn2.addEventListener( "click", function( ev ){
        var tar = ev.target;
        window.floatLayer.RemoveLayer();
    });
    floatlayer_element.appendChild( btn1 );
    floatlayer_element.appendChild( btn2 );
    blackveil_element.className = "blackveil";
    blackveil_element.id = "bb";
    floatlayer_element.id = "ff";
    this.body.appendChild( blackveil_element );
    this.body.appendChild( floatlayer_element );
    $("#bb").fadeIn("slow");

    $("#ff").animate({"margin-top":"-150px", opacity:1},"slow");
}

FloatLayer.prototype.RemoveLayer = function(){

    $("#ff").fadeOut("slow");
    $("#bb").fadeOut("slow");
    setTimeout(function(){
        window.floatLayer.body.removeChild( window.floatLayer.body.lastChild );
        window.floatLayer.body.removeChild( window.floatLayer.body.lastChild );

    },1000)

}



$(document).ready(function()
{
     

    
    var floatLayer = new FloatLayer( "Hello World!" );
    window.floatLayer  = floatLayer;
    floatLayer.CreateLayer();
    $('#ff').draggable();
});
window.onload = function(){



}










