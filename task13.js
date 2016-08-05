/**
 * Created by 鑫 on 2016/7/28.
 */

function $( id )
{
    return document.getElementById(id);
}





(function(){
    var btn = $( "input_btn" );
    var input_data = $("input_data");
    var data = $("data");
    btn.addEventListener("click",function btn_click(){
                                    if( data.value.length == 0 ){
                                        alert("请输入北京今天空气质量");
                                        input_data.textContent = "尚未录入";
                                    }
                                    else{
                                        input_data.textContent = data.value;
                                    }

                                });
}());
