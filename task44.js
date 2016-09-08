/**
 * Created by 鑫 on 2016/9/7.
 */


var MainController = function(){
    this.htmlElements = {
        mainWrapper : document.getElementById('fall-wrapper'),
        colWrappers : null,
        blackveil : null,
        blanket:null
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
    imgElement.addEventListener("click",function( ev ){
        window.controller.Display( ev.target );
    });
    imgElement.onload = function(){
        var ele_height = window.controller.ElementResize( this );
        var s_column = window.controller.GetShortestColumn();
        window.controller.htmlElements.colWrappers[ s_column ].appendChild( this );
        window.controller.colHeightArray[ s_column ] += parseInt(ele_height)
                                            + window.controller.marginVertical;
    }


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
MainController.prototype.Display = function( img ){
    var blackveil_element = document.createElement('div');
    var blanket_element = document.createElement('div');
    var imgElement = document.createElement('img');
    imgElement.src = img.src;
    blackveil_element.className = "black-veil";
    blanket_element.className = "blanket";
    imgElement.className = "veil-img";
    this.htmlElements.mainWrapper.appendChild( blackveil_element );
    this.htmlElements.mainWrapper.appendChild( blanket_element );
    blanket_element.appendChild( imgElement );
    var eleWidth = parseInt( imgElement.naturalWidth );
    var eleHeight = parseInt( imgElement.naturalHeight );
    var veilWidth = parseInt(getComputedStyle(blackveil_element).width.slice(0,-2));
    var veilHeight = parseInt(getComputedStyle(blackveil_element).height.slice(0,-2));
    if( eleWidth / veilWidth  < eleHeight / veilHeight ){
        imgElement.style.height = veilHeight * 0.8 + "px";
    }
    else{
        imgElement.style.width = veilWidth * 0.8 + "px";
    }
    eleWidth = parseInt( getComputedStyle( imgElement ).width.slice(0,-2) );
    eleHeight = parseInt( getComputedStyle( imgElement ).height.slice(0,-2) );
    imgElement.style.marginLeft = -1 * eleWidth / 2 + "px";
    imgElement.style.marginTop = -1 * eleHeight / 2 + "px";
    window.controller.htmlElements.blackveil = blackveil_element;
    window.controller.htmlElements.blanket = blanket_element;
    blanket_element.addEventListener("click",function( ev ){
       if( ev.target.className != 'veil-img' ){
           window.controller.htmlElements.mainWrapper.removeChild(window.controller.htmlElements.blackveil);
           window.controller.htmlElements.mainWrapper.removeChild(window.controller.htmlElements.blanket);
       }

    });

    
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
    controller.AddImage("img/7.jpg");
    controller.AddImage("img/8.jpg");
    controller.AddImage("img/9.jpg");
    controller.AddImage("img/10.jpg");
    controller.AddImage("img/11.jpg");
    controller.AddImage("img/12.jpg");
    controller.AddImage("img/13.jpg");
    controller.AddImage("img/14.jpg");
}