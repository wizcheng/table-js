import R from "ramda";

const create = () => {

  const table = {

    dataSource: () => {

    },

    setDataArray: (array) => {

      table.dataSource = () => ({
        size: () => array.length,
        at: (i) => array[i]
      })

    },

    config: {
      width: 500,
      height: 500,
      rowHeight: 30,
      headerRowHeight: 50,
      columns: []
    },

    setConfig: (config) => {
      const columns = R.addIndex(R.map)((c, i) => {
        return Object.assign({}, c, {__index: i})
      }, config.columns);
      table.config = Object.assign({}, table.config, config, {columns});
    },

    utils: {
      bodyTop: () => table.utils.headerHeight(),
      bodyLeft: () => {return table.utils._sumOfWidth(table.utils._fixedColumns())},
      bodyVisibleWidth: () => { return table.config.width - table.utils.bodyLeft() },
      bodyVisibleHeight: () => { return table.config.height - table.config.headerRowHeight; },
      bodyWidth: () => R.sum(R.map(c => c.width, table.utils._normalColumns())),
      bodyHeight: () => table.config.rowHeight * table.dataSource().size(),

      headerTop: () => 0,
      headerLeft: () => {return table.utils._sumOfWidth(table.utils._fixedColumns())},
      headerVisibleWidth: () => { return table.config.width - table.utils.headerLeft() },
      headerVisibleHeight: () => { return table.config.headerRowHeight; },
      headerWidth: () => R.sum(R.map(c => c.width, table.utils._normalColumns())),
      headerHeight: () => { return table.config.headerRowHeight },

      _normalColumns: () => { return R.filter(c => !c.fixed, table.config.columns)},
      _fixedColumns: () => { return R.filter(c => c.fixed, table.config.columns)},
      _sumOfWidth: R.pipe(R.map(c => c.width), R.sum),
      _leftOfColumn: (column) => {
        let left = 0;
        var columns = table.config.columns;
        for (let i=0; i < columns.length; i++){
          if (columns[i].__index<column){
            left += columns[i].width;
          }
        }
        return left;
      },

      rowAndColumnToPosition: (row, column) => {

        let top = 0;
        let left = 0;
        let height = 0;
        let width = 0;

        if (typeof row !== "undefined"){
          top = row * table.config.rowHeight + table.config.headerRowHeight - table.viewport.offsetTop();
          height = table.config.rowHeight;
        } else {
          height = table.config.headerRowHeight;
        }

        if (column <= table.utils._fixedColumns().length){
          left = table.utils._leftOfColumn(column);
        } else {
          left = table.utils._leftOfColumn(column) - table.viewport.offsetLeft();
        }

        return {
          top,
          left,
          width,
          height,
        };

      }



    },

    viewport: {
      offsetLeft: () => 0,
      offsetTop: () => 0,
      width: () => table.config.width - table._fixedColumnWidth(),
      height: () => table.config.height - table._fixedRowHeight(),

      _xFrom: () => table.viewport.offsetLeft() + 0,
      _xTo: () => table.viewport.offsetLeft() + table.viewport.width(),
      _yFrom: () => table.viewport.offsetTop() + 0,
      _yTo: () => table.viewport.offsetTop() + table.viewport.height()
    },

    setViewport: (viewport) => {
      table.viewport = Object.assign({}, table.viewport, viewport);
    },

    _fixedRowHeight: () => table.config.headerRowHeight,
    _fixedColumnWidth: () => {
      return R.pipe(
        R.map(c => c.width),
        R.sum
      )(table.utils._fixedColumns())
    },

    visibleFixedHeaders: () => {

      const headers = [];
      let startX = 0;
      table.utils._fixedColumns().forEach(c => {
        headers.push({
          row: undefined,
          column: c.__index,
          x: startX,
          y: 0,
          width: c.width,
          height: table.config.headerRowHeight,
          value: c.name
        });

        startX += c.width;
      });
      return headers;

    },

    visibleHeaders: () => {

      const headers = [];
      let startX = 0;
      table.utils._normalColumns().forEach(c => {
        headers.push({
          row: undefined,
          column: c.__index,
          x: startX,
          y: 0,
          width: c.width,
          height: table.config.headerRowHeight,
          value: c.name
        });

        startX += c.width;
      });
      return headers;

    },



    _isVisible: (from, to, visibleFrom, visibleTo) => {
      return !(to < visibleFrom || from > visibleTo);
    },
    _visibleColumns: (columns) => {

      const viewport = table.viewport;
      const visibleColumns = [];

      // calculate visible columns
      let prevEnd = 0;
      console.log("viewport xFrom/xTo", viewport._xFrom(), viewport._xTo());
      for (let i = 0; i < columns.length; i++) {

        const currStart = prevEnd;
        const currEnd = prevEnd + columns[i].width;

        var visible = table._isVisible(currStart, currEnd, viewport._xFrom(), viewport._xTo());
        if (visible) {
          visibleColumns.push(i);
        }

        prevEnd = currEnd;
      }

      return visibleColumns
    },
    _visibleRows: () => {
      const visibleRows = [];
      const viewport = table.viewport;

      let rowFrom = Math.floor(viewport._yFrom() / table.config.rowHeight);
      rowFrom = Math.min(rowFrom, table.dataSource().size()-1);
      let rowTo = Math.ceil(viewport._yTo() / table.config.rowHeight);
      rowTo = Math.min(rowTo, table.dataSource().size()-1);
      R.range(rowFrom, rowTo + 1).forEach(r => {visibleRows.push(r)});
      return visibleRows;
    },
    _visibleCells: (visibleColumns, visibleRows, columns) => {
      const columnX = (col) => {
        return R.sum(R.map(column => column.width, R.addIndex(R.filter)((_, i) => i < col, table.utils._normalColumns())));
      };
      const visibleCells = [];
      const dataSource = table.dataSource();
      const rowHeight = table.config.rowHeight;
      visibleColumns.forEach((col) => {
        const columnConfig = columns[col];
        const x = columnX(col);
        visibleRows.forEach((row) => {
          const data = dataSource.at(row);
          const value = data[columnConfig.key];
          visibleCells.push({
            row: row,
            column: columnConfig.__index,
            y: rowHeight * row,
            x: x,
            width: columnConfig.width,
            height: rowHeight,
            value: value
          })
        })
      });

      return visibleCells;
    },


    visibleCells: () => {

      var columns = table.utils._normalColumns();

      const visibleColumns = table._visibleColumns(columns);
      const visibleRows = table._visibleRows();

      return table._visibleCells(visibleColumns, visibleRows, columns);
    },


    visibleFixedCells: () => {

      const columns = table.utils._fixedColumns();

      const visibleRows = table._visibleRows();
      const visibleColumns = R.range(0, columns.length);

      return table._visibleCells(visibleColumns, visibleRows, columns);


    },


  };

  return table;

};


export default {
  create
}
