/**
 * Created by 鑫 on 2016/8/2.
 */
function $( id ){
    return document.getElementById( id );
}

var inputText = $('input-text');
var btn_leftIn = $('left-in');
var btn_rightIn = $('right-in');
var btn_leftOut = $('left-out');
var btn_rightOut = $('right-out');
var elementsArray;
var display = $('display-zone');

function left_in_click( text )
{
    elementsArray.splice( 0,0, text );
    render();
}


function left_out_click()
{
    elementsArray.splice( 0, 1 );
    render();
}


function right_in_click( text )
{
    elementsArray.push( text );
    render();
}


function right_out_click()
{
    elementsArray.splice( elementsArray.length - 1, 1 );
    render();
}
function render()
{
    display.innerHTML = "";
    for( var i in elementsArray ){
        var ele = document.createElement('div');
        ele.className = 'redBlock';
        ele.textContent = elementsArray[ i ];
        display.appendChild( ele );
    }

}

function btn_click( ev )
{
    var txt = inputText.value;
    // check if meet demand

    switch( ev.target.id ){
        case "left-in":
            if( !/^[1-9]\d*$|^0$/.test(parseInt( txt )) ){
                alert( '输入的必须为整数' );
                return;
            }
            left_in_click( txt );
            break;
        case "right-in":
            if( !/^[1-9]\d*$|^0$/.test(parseInt( txt )) ){
                alert( '输入的必须为整数' );
                return;
            }
            right_in_click( txt );
            break;
        case "left-out":
            if( elementsArray.length == 0 ){
                alert("还没有元素");
                return ;
            }
            left_out_click();
            break;
        case "right-out":
            if( elementsArray.length == 0 ){
                alert("还没有元素");
                return ;
            }
            right_out_click();
            break;


    }
}

function Init()
{
    var buttons = document.getElementsByName('btn_click');
    elementsArray = new Array();
    console.log( buttons );
    for( var index in buttons ){
        buttons[ index ].addEventListener("click", function( ev ){
            btn_click( ev );
        });

    }

}

Init();