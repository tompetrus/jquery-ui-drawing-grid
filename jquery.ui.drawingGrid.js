(function ($, undefined) {
  "use strict"
  var WIDGET_NS = 'draw-grid';
  var WIDGET_PREFIX = WIDGET_NS + '-';
  var GRID_CONTAINER_CLASS = WIDGET_PREFIX + 'container';
  var GRID_CLASS = 'grid';
  var SLCT_GRID = '.' + GRID_CLASS;
  var SLCT_CELL = SLCT_GRID + ' div';
  var SELECTION_CLASS = WIDGET_PREFIX + 'selection';
  
  $.widget('ui.drawingGrid',
  { 
    options: {
      cellSize    : 50
    , minCellSize : 10
    , columns     : null
    , rows        : null
    , shapes      : []
    }
    ,
    _create: function () {
      var uiw = this;
      uiw._createGrid(uiw.options.cellSize);
    }
    ,
    _values: {
        columns:0
      , rows:0
      , shapes: []
    }
    ,
    _getCol: function (pIndex){
      var x = (pIndex + 1) % this._values.columns;
      return x === 0 ? this._values.columns : x;
    }
    ,
    _getRow: function (pIndex){
      return Math.ceil((pIndex + 1) / this._values.columns);
    }
    ,
    _getIndex: function (pX, pY){
      return ((pY - 1) * this._values.columns + pX) - 1;
    }
    ,
    _saveShape: function (){
      var uiw = this;
      var shape = [];
      $("."+SELECTION_CLASS, uiw.element).each(function(){
        shape.push([uiw._getCol($(this).index()),uiw._getRow($(this).index())]);
        console.log("Cell selected at X:"+uiw._getCol($(this).index())+",Y:"+uiw._getRow($(this).index()));
      });
      uiw._values.shapes.push(shape);
    }
    ,
    _createGrid: function () {
      var uiw = this;
      var lMaxWidth;
      var lCellSize;
      
      $(uiw.element).addClass(GRID_CONTAINER_CLASS);

      
      if (uiw.options.columns){
        lMaxWidth = uiw.options.columns * uiw.options.cellSize;
        lCellSize = ( $(uiw.element).width() / lMaxWidth ) * uiw.options.cellSize;
        
        if ( lCellSize < uiw.options.minCellSize ) {
          lCellSize = uiw.options.minCellSize;
        };
        uiw._values.columns = uiw.options.columns;
        uiw._values.rows = uiw.options.rows;
      } else {
        uiw._values.columns = Math.floor($(uiw.element).width()/uiw.options.cellSize);
        uiw._values.rows = Math.floor($(uiw.element).height()/uiw.options.cellSize);
        
        lCellSize = uiw.options.cellSize;
      }
      
      console.log('columns: ', uiw._values.columns, ' - rows: ', uiw._values.rows);
      
      var parent = $('<div />', {
          class: GRID_CLASS, 
          width: uiw._values.columns  * lCellSize, 
          height: uiw._values.rows  * lCellSize
      }).addClass(GRID_CLASS).appendTo(uiw.element);

      for (var i = 0; i < uiw._values.rows; i++) {
        for(var p = 0; p < uiw._values.columns; p++){
          $('<div />', {
              width: lCellSize - 1, 
              height: lCellSize - 1
          }).appendTo(parent);
        }
      };      
      
      var handlers = {};
      handlers["mousedown "+SLCT_CELL] = function(e){
        console.log("mousedown - event: ", e)
        //remove existing selection
        $("."+SELECTION_CLASS, uiw.element).removeClass(SELECTION_CLASS);
        //mark this first element as being selected
        $(e.target).addClass(SELECTION_CLASS); 
        //when the mouse moves over other cells, mark them as being selected
        //$(SLCT_CELL, uiw.element).not(this).on("mouseenter", function(){ $(this).addClass(SELECTION_CLASS); });
        var handler = {};
        handler["mouseenter "+SLCT_CELL] = function(e){ $(e.target).addClass(SELECTION_CLASS); };
        uiw._on(uiw.element, handler);
        
        //when the mousebutton is released or moved out of the grid, remove the mouseenter handler and save the selection
        $(SLCT_GRID).one("mouseleave."+WIDGET_NS+" mouseup."+WIDGET_NS, function(){
          uiw._off(uiw.element, "mouseenter "+SLCT_CELL);
          $(SLCT_GRID).off("mouseleave."+WIDGET_NS+" mouseup."+WIDGET_NS);
          uiw._saveShape();
        });
        
        /*
        uiw._on(SLCT_GRID, 
        { "mouseup": function(){
            uiw._off(uiw.element, "mouseenter "+SLCT_CELL);
            uiw._off(SLCT_GRID, "mouseleave");
            uiw._off(uiw.element, "mouseup "+SLCT_GRID);
            //uiw._off(SLCT_GRID, "mouseup");
            uiw._saveShape();
          }
        , "mouseleave": function(e){
            console.log("mouseleave, this: ", this);
            console.log("mouseleave, event: ", e);
            uiw._off(uiw.element, "mouseenter "+SLCT_CELL);
            $(this)._off(SLCT_GRID, "mouseleave");
            uiw._off(uiw.element, "mouseup "+SLCT_GRID);
            uiw._saveShape();
          }
        });
        */
      };
      uiw._on(this.element, handlers);
      
      /*uiw._on(window, {"resize": function(){
        $(uiw.element).empty();
        uiw._createGrid();
      }});*/
    }
    ,
    redrawShapes: function (){
      var uiw = this;
      console.log("redrawshapes - shapes:", uiw._values.shapes);
      uiw._values.shapes.forEach(function(shape){
        console.log("redrawing shape: ", shape);
        shape.forEach(function(coordinate){
          console.log("index of block: "+uiw._getIndex(coordinate[0], coordinate[1]) );
          $("."+GRID_CLASS+" div", uiw.element).eq(uiw._getIndex(coordinate[0], coordinate[1])).addClass("isShape");
        });
      });
    }
    
  });
})(jQuery);