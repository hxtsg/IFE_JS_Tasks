/**
 * Created by 鑫 on 2016/8/3.
 */
function $( id )
{
    return document.getElementById(id);
}

var input_text = $('input-text');
var insert_btn = $('insert');
var search_btn = $('search');
var search_text = $( 'search-text' );
var display = $('display-zone');
var wordsArray;
var childNodesArray;
function trimWords()
{
    var txt = input_text.value;

    var tmpArray = txt.split( /[^0-9a-zA-Z\u4e00-\u9fa5]/ ).filter( function( e ){
        if( e == null || e.length == 0 ){
            return false;
        }
        else{
            return true;
        }
    } );
    for( index in tmpArray ){
        wordsArray.push( tmpArray[ index ] );
    }
    console.log( wordsArray );
    InsertIntoHtml();
}

function InsertIntoHtml()
{
    display.innerHTML = "";
    for( index in wordsArray ){
        var ele = document.createElement('div');
        ele.className = 'redBlock';
        
        ele.textContent = wordsArray[ index ];
        display.appendChild( ele );
    }

}

function CheckAndAdd( inTxt, search_txt, i )
{
    if( inTxt.length == 0 ){
        return;
    }
    var index = inTxt.indexOf( search_txt );
    if( index >= 0 ){
        var rest = inTxt.substring( index + search_txt.length );
        var before = inTxt.substring( 0, index );
        var ele_before = document.createElement('span');
        ele_before.textContent = before;
        childNodesArray[ i ].appendChild( ele_before );
        var ele_middle = document.createElement('span');
        ele_middle.style.color = "red";
        ele_middle.textContent = search_txt;
        childNodesArray[ i ].appendChild( ele_middle );
        CheckAndAdd( rest, search_txt, i );
    }
    else{
        var rest = document.createElement('span');
        rest.textContent = inTxt;
        childNodesArray[ i ].appendChild( rest );
    }
}

function SearchAndRender()
{
    childNodesArray = new Array();
    var nodesList = display.childNodes;
    for( i in nodesList ){
        if( nodesList[ i ].nodeType == 1 ){
            childNodesArray.push( nodesList[ i ] );
        }
    }
    console.log( childNodesArray );
    for( i in wordsArray ){
        childNodesArray[ i ].innerHTML = "";
        CheckAndAdd( wordsArray[ i ], search_text.value, i );

    }
}


function Init()
{
    wordsArray = new Array();
    insert_btn.addEventListener("click", trimWords);
    search_btn.addEventListener("click", SearchAndRender);
}

Init();