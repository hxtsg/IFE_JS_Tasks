/**
 * Created by 鑫 on 2016/9/7.
 */


var MainController = function(){
    this.htmlElements = {
        mainWrapper : document.getElementById('fall-wrapper'),
        colWrappers : null
    };
    this.colWidth = null;
    this.imgSrcArray = [];  // 用户添加的图片的地址
    this.colHeightArray = null; //  每一列的高度
    this.colNum = 4; // 用户可以设置
    this.colInterval = 16;
    this.marginVertical = 20;
}

MainController.prototype.run = function(){
    this.Init();
    window.controller = this;
    window.onresize = function(){
        window.controller.Init();
    }
}

MainController.prototype.Init = function(){
    this.htmlElements.innerHTML = "";
    var wrapWidth = parseInt(getComputedStyle( this.htmlElements.mainWrapper ).width.slice(0,-2));
    this.colWidth = parseInt( ( wrapWidth - (this.colNum + 1) * this.colInterval ) / this.colNum );
    this.colHeightArray = [];
    this.htmlElements.colWrappers = [];
    for( var i = 0 ; i < this.colNum ; i ++ ){
        this.colHeightArray.push( 0 );
        var wrpElement = document.createElement('div');
        wrpElement.className = "fall-column";
        wrpElement.style.width = this.colWidth;

        this.htmlElements.mainWrapper.appendChild( wrpElement );
        this.htmlElements.colWrappers.push( wrpElement );
    }

    this.DrawAll();
}



MainController.prototype.DrawAll = function(){
    for( var i = 0 ; i < this.imgSrcArray ; i ++ ){
        this.Draw( i );
    }
}

MainController.prototype.Draw = function( index ){   // 把下标为index的图片添加到相应的栏里面并且更新colHeight
    var imgElement = document.createElement('img');
    imgElement.src = this.imgSrcArray[ index ];
    imgElement.className = "fall-img";

    var ele_height = this.ElementResize( imgElement );
    var s_column = this.GetShortestColumn();
    this.htmlElements.colWrappers[ s_column ].appendChild( imgElement );
    this.colHeightArray[ s_column ] += parseInt(ele_height)
                                        + this.marginVertical;

}

MainController.prototype.AddImage = function( imgPath ){
    this.imgSrcArray.push( imgPath );
    this.Draw( this.imgSrcArray.length - 1 );
}

MainController.prototype.GetShortestColumn = function(){
    var rst_height = this.colHeightArray[ 0 ];
    var rst_index = 0;
    for( var i = 0 ; i < this.colNum ; i ++ ){
        if( this.colHeightArray[ i ] < rst_height ){
            rst_height = this.colHeightArray[ i ];
            rst_index = i;
        }
    }
    return rst_index;
}
MainController.prototype.Display = function(){

}

MainController.prototype.ElementResize = function( imgElement ){ // 调整图像的大小，并且返回调整以后的高度
    var rst = parseInt(imgElement.naturalHeight) * this.colWidth / parseInt( imgElement.naturalWidth );
    imgElement.style.width = this.colWidth + "px";
    return rst;
}

window.onload = function(){
    var controller = new MainController();
    controller.run();
    controller.AddImage("img/1.jpg");
    controller.AddImage("img/2.jpg");
    controller.AddImage("img/3.jpg");
    controller.AddImage("img/4.jpg");
    controller.AddImage("img/5.jpg");
    controller.AddImage("img/6.jpg");
    controller.AddImage("img/2.jpg");
    controller.AddImage("img/1.jpg");
    controller.AddImage("img/3.jpg");
}