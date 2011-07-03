const ITEM_W = 60;
const ITEM_H = 60;

window.onload = function()
{
    Crafty.init(800, 600);
    
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
    
        init: function() {
            //this.initItem(1);
        },
        
        initItem: function(num, x, y) {
            this.item_num = num;
            
            var item_class = "item-sprite-" + this.item_num;
            
            this.addComponent("2D, Canvas, Color, Mouse, " + item_class);
            
            this.x = x;
            this.y = y;
            this.w = 60;
            this.h = 60;
            
            return this;
        }
    
    });
}

var createBoard = function() {
    const BOARD_X = 225;
    const BOARD_Y = 25;
    const DISTANCE_BETWEEN_ITEMS = 8;

    Crafty.c("board", {
        
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
            
            for (var i = 0; i < this.board_items.length; i++)
            {
                this.board_items[i] = new Array(8);
                
                for (var j = 0; j < this.board_items[i].length; j++)
                {
                    var item_value = Math.floor(Math.random() * 7);
                    
                    this.board_items[i][j] = Crafty.e("item").initItem(
                                                item_value, 
                                                BOARD_X + DISTANCE_BETWEEN_ITEMS + ((DISTANCE_BETWEEN_ITEMS+ITEM_W) * i), 
                                                BOARD_Y + DISTANCE_BETWEEN_ITEMS + ((DISTANCE_BETWEEN_ITEMS+ITEM_H) * j)
                    );
                }
            }
        }
        
    });
}
