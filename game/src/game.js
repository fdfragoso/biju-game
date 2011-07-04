const ITEM_W = 60;
const ITEM_H = 60;

// Initialize the game itself
window.onload = function()
{
    Crafty.init(800, 600);
    Crafty.canvas.init();
    
    // Crafty is a bit weird, those functions will create every "class" in the game
    createBackground();
    createItems();
    createBoard();
    
    // Add elements to the game
    Crafty.e("background");
    Crafty.e("board");
    
}

// The background class
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

// Items
var createItems = function() {

    // Adding the spritesheet. Crafty seems to work nice with them. :)
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
            // the name of the sprite, acording to its number
            this.item_num = num;
            var item_class = "item-sprite-" + this.item_num;
            this.addComponent("2D, Canvas, Color, Mouse, " + item_class);
            
            // X and Y are the coordinates, POSX and POSY are its index on the board matrix
            this.x = x;
            this.y = y;
            this.posx = posx;
            this.posy = posy;
            
            this.w = ITEM_W;
            this.h = ITEM_H;
            
            // The click "event"
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
    
        // This stores the first item clicked
        clickedFirst: null,
        
        init: function() {
            this.addComponent("2D, Canvas, Color");
            this.x = BOARD_X;
            this.y = BOARD_Y;
            this.w = 550;
            this.h = 550;
            this.color("#888888");
            
            // Init the board items
            this.boardInit();
        },
        
        boardInit: function() {
            this.board_items = new Array(8);
            
            // This needs an explanation. I use them to help creating the 'perfect puzzle'
            var i_last = -1;
            var i_last_count = 1;
            
            for (var i = 0; i < this.board_items.length; i++)
            {
                this.board_items[i] = new Array(8);
                
                for (var j = 0; j < this.board_items[i].length; j++)
                {
                    // Get the random item
                    var item_value = Math.floor(Math.random() * 7);
                    
                    // Now I make the first verification. If the random item number
                    // is equals to the last one and there's more than three, then
                    // I change this number. It will avoid three or more equal items
                    // in a column
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
                    
                    // Time to avoid three or more items in a line
                    if (i > 1) 
                    {
                        if (this.board_items[i-1][j].item_num == item_value && this.board_items[i-2][j].item_num == item_value)
                        {
                            if (++item_value == 7) item_value = 0;
                        }
                    }
                    
                    // You'll see, this is a beautiful workaround to send THIS to
                    // the event function. (Saw that in the Crafty examples)
                    var that = this;
                    
                    // Finally I create the item
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
                    
                // Reset hehe
                i_last = -1;
                i_last_count = 1;
            }
        },
        
        clickItem: function(that, i, j, obj) {
            // Colorize the item clicked for indication, will change later
            obj.color("#FFFFFF");
        
            // Add the clicket to that clickedFirst object created earlier
            // if there's an object in that, then check if they are 'neighboors'
            // if so, swap them. Easy, right? :)      
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
        
        // Ok, does this function need a comment?
        isNeighboor: function(item1, item2) {
            var ret = false;
            
            if (item1.posx > 0) ret |= this.board_items[item1.posx-1][item1.posy] == item2;
            if (item1.posx < 6) ret |= this.board_items[item1.posx+1][item1.posy] == item2;
            if (item1.posy > 0) ret |= this.board_items[item1.posx][item1.posy-1] == item2;
            if (item1.posy < 6) ret |= this.board_items[item1.posx][item1.posy+1] == item2;
        
            return ret;
        },
        
        swapItems: function(item1, item2) {
        
            // First I swap the items coordiate,
            // then I swap their index in the matrix
            // and them swap them in the matrix.
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
        
        // Oh, this is a simple "debug" function. Though I haven't used that much...
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
