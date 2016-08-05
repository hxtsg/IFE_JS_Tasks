/**
 * Created by 鑫 on 2016/7/29.
 */
function $(id)
{
    return document.getElementById(id);
}




( function(){
    var list_src = $('source').childNodes;
    var rst_list = new Array();
    for( var i = 0 ; i < list_src.length ; i ++ ){
        if( list_src[ i ].nodeType == 1 ){
            var ele = list_src[ i ];
            var ele_list = ele.textContent.split('空气质量');
            // console.log( ele_list );
            var rst_ele = new Array();
            rst_ele.push( ele_list[ 0 ] );
            rst_ele.push( ele_list[ 1 ].substring( 1 ) );
            rst_list.push( rst_ele );
        }
    }

    var btn_sort = $('btn_sort');
    btn_sort.addEventListener( "click", function(){
        rst_list.sort( function( a, b ){
        return b[ 1 ] - a[ 1 ];
    } );
    var list_resort = $('resort_list');
    for( var i = 0 ; i < rst_list.length ; i ++ ){
        // create element
        var resort_ele = document.createElement( 'li' );
        resort_ele.textContent = rst_list[ i ][ 0 ] + "空气质量： " + rst_list[ i ][ 1 ];

        // set textcontent
        list_resort.appendChild( resort_ele );
        // append child
    }
    console.log( rst_list );

    } );


}() );