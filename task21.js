/**
 * Created by 鑫 on 2016/8/4.
 */
function $(id)
{
    return document.getElementById(id);
}
String.prototype.trim=function(){return this.replace(/(^\s+)|(\s+$)/g,'')}
var tag_input = $("tag-input");
var display_block = $("display-block");
var habits_display = $("habits-display");
var confirm = $("confirm_habits");
var habit_area = $("habit-area");
var tagArray;
var habitsArray;

function remove_the_same( txt ) // return true or false and trim
{
    // trim
    txt = txt.trim();
    if( txt == null || txt.length == 0 ){
        return null;
    }
    for( var index in tagArray ){
        if( tagArray[ index ].textContent == txt ){
            return null;
        }
    }
    return txt;
}

function add_into_array( txt ) // if more than 10, shift
{
    if( tagArray.length >= 10 ){
        display_block.removeChild( tagArray[ 0 ] );
    }
    render( txt );
}

function render( txt, index )  // render and add mouseover and mouseout event
{
    var ele = document.createElement('div');
    ele.className = "redBlock";
    ele.textContent = txt;

    ele.addEventListener( "mouseover",function(){
        ele.style.background = "#FF7077";
        ele.textContent = "删除" + ele.textContent;
    } );

    ele.addEventListener("mouseout",function(){
        ele.style.background = "#81cfff";
        ele.textContent = ele.textContent.substring( 2, ele.textContent.length );
    });
    ele.addEventListener("click",function( ev ){
        var parent_ele = ev.target.parentNode;
        parent_ele.removeChild( ele );
        getTagEleArray();
    });
    display_block.appendChild( ele );
    getTagEleArray();
}
function getTagEleArray()
{
    tagArray = new Array();
    var tmp_arr = display_block.childNodes;
    for( var index in tmp_arr ){
        if( tmp_arr[ index ].nodeType == 1 ){
            tagArray.push( tmp_arr[ index ] );
        }
    }
}

function getHabitsArray()
{
    habitsArray = new Array();
    var tmp_arr = habits_display.childNodes;
    for( var index in tmp_arr ){
        if( tmp_arr[ index ].nodeType == 1 ){
            habitsArray.push( tmp_arr[ index ] );
        }
    }
}


function existInHabits( txt )
{
    for( var index in habitsArray ){
        if( habitsArray[ index ].textContent == txt ){
            return true;
        }
    }
    return false;
}

function process_habits()
{
    var tmp_arr = habit_area.value.split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/).filter(function( txt ){
        if( txt == null || txt.length == 0 ){
            return false;
        }
        else{
            return true;
        }
    });
    var _tmp_arr = new Array();
    for( var index in tmp_arr ){
        tmp_arr[ index ] = tmp_arr[ index ].trim();
        if( ! existInHabits( tmp_arr[ index ] ) ){
            _tmp_arr.push( tmp_arr[ index ] );
        }
    }
    tmp_arr = _tmp_arr;


    if( tmp_arr.length >= 10 ){
        habits_display.innerHTML = "";
        for( var i = tmp_arr.length - 10 ; i < tmp_arr.length ; i ++ ){
            var ele = document.createElement('div');
            ele.className = "redBlock";
            ele.textContent = tmp_arr[ i ];
            habits_display.appendChild( ele );
        }
    }
    else if( tmp_arr.length < 10 && tmp_arr.length + habitsArray.length > 10 ){
        for( var i = 0 ; i < tmp_arr.length + habitsArray.length - 10 ; i ++ ){
            habits_display.removeChild( habitsArray[ i ] );
        }
        for( var i = 0 ; i < tmp_arr.length ; i ++ ){
            var ele = document.createElement('div');
            ele.className = "redBlock";
            ele.textContent = tmp_arr[ i ];
            habits_display.appendChild( ele );
        }
    }
    else{
        for( var i = 0 ; i < tmp_arr.length ; i ++ ){
            var ele = document.createElement('div');
            ele.className = "redBlock";
            ele.textContent = tmp_arr[ i ];
            habits_display.appendChild( ele );
        }
    }
    getHabitsArray();
}


function Init() // add eventListener
{
    tagArray = new Array();
    habitsArray = new Array();
    tag_input.addEventListener("keyup", function( ev ){
        if( /[^0-9a-zA-Z\u4e00-\u9fa5]+/.test( tag_input.value ) == true ){

            var str = tag_input.value.substring( 0, tag_input.value.length - 1 );
            var remove_str = remove_the_same( str );
            if( remove_str != null ){
                add_into_array( remove_str );
            }
            tag_input.value = "";
        }
    });
    confirm.addEventListener( "click", process_habits);

}

Init();