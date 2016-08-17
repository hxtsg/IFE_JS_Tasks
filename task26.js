/**
 * Created by 鑫 on 2016/8/14.
 */



( function(){

    var SPACE_SHIP_SIZE = 20;
    var SPACESHIP_ORBIT_INTERVAL = 60;
    var SPACESHIP_MAX_COUNT = 4;
    var SPACESHIP_SPEED = 1;
    var SPACE_CONSUME_RATE = 0.005;
    var SPACE_CHARGE_RATE = 0.002;
    var PACKAGE_MISS_RAGE = 0.3;
    var SCREEN_HEIGHT = 600;
    var SCREEN_WIDTH = 600;
    var SCREEN_CENTER_X = SCREEN_WIDTH / 2;
    var SCREEN_CENTER_Y = SCREEN_HEIGHT / 2;
    var SHIP_HP_OFFSET = -10;
    var SHIP_HP_LENGTH = 20;
    var SHIP_HP_WIDTH = 5;
    var STATEMACHINE_INTERVAL = 100;
    var ANIMATION_INTERVAL = 20;
    var HP_WELL_COLOR = "#ffffff";
    var HP_HEALTH_COLOR = "#faf44b";
    var HP_WEAK_COLOR = "#dc151b";
    var Anim = function( medi ){
        this.canvas = null;
        this.ctx = null;
        this.Mediator = medi;
    }
    
    Anim.prototype.Init = function () {
        this.canvas = document.getElementById("draw");
        this.canvas.width = SCREEN_WIDTH;
        this.canvas.height = SCREEN_HEIGHT;
        this.ctx = this.canvas.getContext('2d');
    }

    var ConsoleManager = function(){
        this.console_log = document.getElementById("console-list");
    }

    ConsoleManager.prototype.append_li = function( txt ){
        var li_ele = document.createElement('li');
        li_ele.textContent = txt;
        this.console_log.appendChild( li_ele );
    }

    Anim.prototype.DrawOnScreen = function(){
        var self = this;
        return{

            DrawInEachFrame:function(){
                self.ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
                self.DrawOnScreen().DrawOrbit( self.ctx );
                for( var i = 0 ; i < SPACESHIP_MAX_COUNT ; i ++ ){
                    if( self.Mediator.ships[ i ] != null ){
                        self.DrawOnScreen().DrawSpaceShip( i );
                    }
                }
            },
            DrawSpaceShip:function( id ){
                var shipImage = new Image();
                var spaceship = self.Mediator.ships[ id ];
                shipImage.src = "min-iconfont-rocket.png";
                 if( spaceship.current_energy > 60 ){
                    self.ctx.stokeStyle = "#00FF00";
                     self.ctx
                 }
                 else if( spaceship.current_energy > 30 ){
                     self.ctx.stokeStyle = "#0000FF";
                 }
                 else{
                     self.ctx.stokeStyle = "#FF0000";
                 }
                console.log( spaceship.angle );
                shipImage.onload = function(){
                    try{
                        self.ctx.save();
                        self.ctx.translate( SCREEN_CENTER_X, SCREEN_CENTER_Y );
                        self.ctx.rotate( - spaceship.angle * Math.PI / 180 );
                        self.ctx.drawImage( shipImage, spaceship.fly_orbit_radius,0, SPACE_SHIP_SIZE, SPACE_SHIP_SIZE);





                        self.ctx.lineWidth = SHIP_HP_WIDTH;
                        self.ctx.beginPath();
                        self.ctx.moveTo( spaceship.fly_orbit_radius, SHIP_HP_OFFSET );
                        self.ctx.lineTo( spaceship.fly_orbit_radius + SHIP_HP_LENGTH * spaceship.current_energy / 100, SHIP_HP_OFFSET );
                        self.ctx.closePath();
                        self.ctx.stroke();
                        self.ctx.restore();
                    }
                    catch(err)
                    {
                        console.log(err);
                        return false;
                    }
                }

            },
            DrawOrbit:function( _cvs ) {

                for( var i = 0 ; i < SPACESHIP_MAX_COUNT ; i ++ ){

                    _cvs.strokeStyle = "#979797";
                    _cvs.beginPath();
                    _cvs.arc(SCREEN_CENTER_X,SCREEN_CENTER_Y, ( i + 1 ) * SPACESHIP_ORBIT_INTERVAL,0, Math.PI * 2);
                    _cvs.closePath();
                    _cvs.stroke();

                }
            }
        }
    }


    var SpaceShip = function( id ){
        this.id = id;
        this.current_energy = 100;
        this.fly_orbit_radius = (id + 1) * SPACESHIP_ORBIT_INTERVAL;
        this.current_state = 'stop';
        this.angle = 0;
        this.Commander = null;
        this.Mediator = null;
        this.timer = null;
    }
    SpaceShip.prototype.StateMachine = function(){
        this.Mediator.ship_display[ this.id ].textContent = this.current_energy;
        switch( this.current_state ){
            case 'fly':
                if(this.Dynamics().Fly() == false){
                    this.current_state = 'stop';
                    return;
                }
                break;
            case 'stop':
                this.Dynamics().Stop();
                break;
            case 'to_be_destroyed':
                this.Destroy();
                break;
        }

    }
    SpaceShip.prototype.Dynamics = function(){
        var self = this;
        return{

            Fly:function(){
                if( self.Energy().Discharge() == false ){
                    return false;
                }
                self.angle += SPACESHIP_SPEED;
                if( self.angle >= 360 ){
                    self.angle -= 360;
                }
                return true;
            },
            Stop:function(){
                self.Energy().Charge();
            }
        }
    }
    SpaceShip.prototype.Energy = function(){
        var self = this;
        return{
            Charge:function(){
                self.current_energy += 100 * SPACE_CHARGE_RATE;
                if( self.current_energy > 100 ){
                    self.current_energy = 100;
                }
            },
            Discharge:function(){
                self.current_energy -= 100 * SPACE_CONSUME_RATE;
                if( self.current_energy < 0 ){
                    self.current_energy = 0;
                }
                return self.current_energy > 0;
            }
        }
    }
    SpaceShip.prototype.Destroy = function(){
        this.Mediator.ships[ this.id ] = null;
        clearInterval( this.timer );
        this.Mediator.ship_display[ this.id ].textContent = "null";
        this.timer = null;
    }
    SpaceShip.prototype.Signal = function(){
        var self = this;
        return{
            Recieve:function( command ){
                switch( command.command ){
                    case 'fly':
                        self.current_state = 'fly';

                        break;
                    case 'stop':
                        self.current_state = 'stop';

                        break;
                    case 'destroy':
                        self.current_state = 'to_be_destroyed';
                        break;
                }
            }
        }
    }

    var Medator = function(){
        this.ships = new Array(SPACESHIP_MAX_COUNT);
        this.commander = null;
        this.conManager = null;
        for( var index in this.ships ){
            this.ships[ index ] = null;
        }
        this.ship_display = null;
    }

    Medator.prototype.Register = function( obj ){
        if( obj instanceof Commander ){
            this.commander = obj;
        }
        else if( obj instanceof SpaceShip ){
            this.ships[ obj.id ] = obj;
            obj.Mediator = this;
            obj.Commander = this.commander;

            obj.timer = setInterval( function(){
                obj.StateMachine();

            }, STATEMACHINE_INTERVAL);
        }
        else if( obj instanceof ConsoleManager ){
            this.conManager = obj;
        }
    }

    var Command = function( id, command ){
        this.id = id;
        this.command = command;
    }
    var Commander = function( mediator ){
        this.medi = mediator;
    }
    Commander.prototype.BroadCast = function( command ) {
        if( Math.random() < PACKAGE_MISS_RAGE ){
            return;
        }
        for( var index in this.medi.ships ){
            if( index == command.id ){
                this.medi.ships[ index ].Signal().Recieve( command );
            }
        }
    }
    Commander.prototype.Create = function(id) {
        if( this.medi.ships[ id ] != null && this.medi.ships[ id ] != undefined ){
            console.log("already exist");
            return false;
        }
        if( Math.random() < PACKAGE_MISS_RAGE ){
            return;
        }
        var spaceship = new SpaceShip( id );

        this.medi.Register( spaceship );
        return true;
    }
    Commander.prototype.ToFly = function( id ){
        if( this.medi.ships[ id ] == null || this.medi.ships[ id ] == undefined ){
            return false;
        }
        var com = new Command( id, 'fly' );
        this.BroadCast( com );
        return true;
    }
    Commander.prototype.ToStop = function( id ){
        if( this.medi.ships[ id ] == null || this.medi.ships[ id ] == undefined ){
            return false;
        }
        var com = new Command( id, 'stop' );
        this.BroadCast( com );
        return true;
    }
    Commander.prototype.ToDestroy = function( id ){
        if( this.medi.ships[ id ] == null || this.medi.ships[ id ] == undefined ){
            console.log("Can't destroy, the ship does not exist");
            return false;
        }
        var com = new Command( id, 'destroy' );
        this.BroadCast( com );
        return true;
    }



    window.onload = function(){
        var yitai = new Medator();
        var Nimiz = new Commander( yitai );
        yitai.Register(Nimiz);
        yitai.ship_display = $("li[name='ship']");
        $(".btn").on("click",function(){
            var cmdName = $(this).attr("name");
            switch( cmdName ){
                case "launch":
                    console.log("launch");
                    Nimiz.Create( parseInt( $(this).parent().attr("id") ));
                    break;
                case "fly":
                    Nimiz.ToFly( parseInt( $(this).parent().attr("id") ));
                    break;
                case "stop":
                    Nimiz.ToStop( parseInt( $(this).parent().attr("id") ) );
                    break;
                case "destroy":
                    Nimiz.ToDestroy( parseInt( $(this).parent().attr("id") ) );
                    break;
            }
            return false;
        });
        var conManager = new ConsoleManager();
        yitai.Register( conManager );
        var animation = new Anim( yitai );
        animation.Init();
        animation.DrawOnScreen().DrawOrbit( animation.ctx );
        setInterval( function(){
            animation.DrawOnScreen().DrawInEachFrame();
        }, ANIMATION_INTERVAL );
    }

})();
