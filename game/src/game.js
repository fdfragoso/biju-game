const ITEM_W = 60;
const ITEM_H = 60;

window.onload = function()
{
    Crafty.init(800, 600);
    Crafty.canvas.init();
    
    createBackground();
    createItems();
    createBoard();
    
    Crafty.e("background");
    Crafty.e("board");
    
}

var createBackground = function() {
    Crafty.c("background", {
    
        init: function() {
            this.addComponent("2D, Canvas, Color");
            this.x = 0;
            this.y = 0;
            this.w = 800;
            this.h = 600;
            this.color("#800000");
        }
        
    });
}

var createItems = function() {

    Crafty.sprite(60, "img/item.png", { 
        "item-sprite-0": [0, 0],
        "item-sprite-1": [1, 0], 
        "item-sprite-2": [2, 0], 
        "item-sprite-3": [3, 0], 
        "item-sprite-4": [4, 0],
        "item-sprite-5": [5, 0],
        "item-sprite-6": [6, 0]
    });

    Crafty.c("item", {
    
        item_num: 0,
        
        initItem: function(num, x, y, posx, posy, clickCallback) {
            this.item_num = num;
            var item_class = "item-sprite-" + this.item_num;
            this.addComponent("2D, Canvas, Color, Mouse, " + item_class);
            
            this.x = x;
            this.y = y;
            this.posx = posx;
            this.posy = posy;
            
            this.w = 60;
            this.h = 60;
            
            this._clickCallback = clickCallback;
            
            this.bind("Click", function(obj) {
                if (this._clickCallback) clickCallback(this.posx, this.posy, this);
            });
            
            return this;
        }
    
    });
}

var createBoard = function() {
    const BOARD_X = 225;
    const BOARD_Y = 25;
    const DISTANCE_BETWEEN_ITEMS = 8;

    Crafty.c("board", {
    
        clickedFirst: null,
        
        init: function() {
            this.addComponent("2D, Canvas, Color");
            this.x = BOARD_X;
            this.y = BOARD_Y;
            this.w = 550;
            this.h = 550;
            this.color("#888888");
            
            this.boardInit();
        },
        
        boardInit: function() {
            this.board_items = new Array(8);
            
            var i_last = -1;
            var i_last_count = 1;
            
            for (var i = 0; i < this.board_items.length; i++)
            {
                this.board_items[i] = new Array(8);
                
                for (var j = 0; j < this.board_items[i].length; j++)
                {
                    var item_value = Math.floor(Math.random() * 7);
                    
                    if (i_last == item_value)
                    {
                        if (++i_last_count == 3) {
                            if (++item_value == 7) item_value = 0;
                        }
                    }
                    else {
                        i_last = item_value;
                        i_last_count = 1;
                    }
                    
                    if (i > 1) 
                    {
                        if (this.board_items[i-1][j].item_num == item_value && this.board_items[i-2][j].item_num == item_value)
                        {
                            if (++item_value == 7) item_value = 0;
                        }
                    }
                    
                    var that = this;
                    
                    this.board_items[i][j] = Crafty.e("item").initItem(
                                                item_value, 
                                                BOARD_X + DISTANCE_BETWEEN_ITEMS + ((DISTANCE_BETWEEN_ITEMS+ITEM_W) * i), 
                                                BOARD_Y + DISTANCE_BETWEEN_ITEMS + ((DISTANCE_BETWEEN_ITEMS+ITEM_H) * j),
                                                i,
                                                j,
                                                function (i, j, obj) {
                                                    that.clickItem(that, i, j, obj);
                                                }
                    );
                }
                    
                i_last = -1;
                i_last_count = 1;
            }
        },
        
        clickItem: function(that, i, j, obj) {
            obj.color("#FFFFFF");
        
            if (that.clickedFirst != null) {
                if (that.isNeighboor(that.clickedFirst, obj))
                    that.swapItems(that.clickedFirst, obj);
            
                that.clickedFirst.color(0);
                obj.color(0);
                that.clickedFirst = null;
            }
            else {
                that.clickedFirst = obj;
            }
            
        },
        
        isNeighboor: function(item1, item2) {
            var ret = false;
            
            if (item1.posx > 0) ret |= this.board_items[item1.posx-1][item1.posy] == item2;
            if (item1.posx < 6) ret |= this.board_items[item1.posx+1][item1.posy] == item2;
            if (item1.posy > 0) ret |= this.board_items[item1.posx][item1.posy-1] == item2;
            if (item1.posy < 6) ret |= this.board_items[item1.posx][item1.posy+1] == item2;
        
            return ret;
        },
        
        swapItems: function(item1, item2) {      
            
            var tempx = item1.x;
            item1.x = item2.x;
            item2.x = tempx;
            
            var tempy = item1.y;
            item1.y = item2.y;
            item2.y = tempy;
            
            var tempposx = item1.posx;
            item1.posx = item2.posx;
            item2.posx = tempposx;
            
            var tempposy = item1.posy;
            item1.posy = item2.posy;
            item2.posy = tempposy;
            
            this.board_items[item1.posx][item1.posy] = item1;
            this.board_items[item2.posx][item2.posy] = item2;
        },
        
        printItems: function() {
            var text_to_print = "";
        
            for (var i = 0; i < this.board_items.length; i++)
            {   
                for (var j = 0; j < this.board_items[i].length; j++)
                {
                    text_to_print += this.board_items[i][j].item_num + " ";
                }
                
                text_to_print += "\n";
            }
            
            alert(text_to_print);
        },
        
    });
}
