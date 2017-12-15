import R from "ramda";

const create = () => {

  const table = {

    sort: (columnIdx, order) => {
      const column = R.find(R.propEq("__index", columnIdx))(table.config.columns);
      table.dataSource().sort(column, order);
    },

    filter: (columnIdx, filter) => {
      const column = R.find(R.propEq("__index", columnIdx))(table.config.columns);
      table.dataSource().filter(column, filter);
    },

    dataSource: () => {

    },

    setDataArray: (array) => {

      const dataSource = {
        _arrayRaw: array,
        _array: array,
        size: () => dataSource._array.length,
        at: (i) => dataSource._array[i],
        sort: (column, order) => {
          const sortWith = [];
          switch (order) {
            case "descending":
              sortWith.push(R.descend(R.prop(column.key)));
              break;
            case "ascending":
              sortWith.push(R.ascend(R.prop(column.key)));
              break;
            default:
          }

          if (sortWith.length > 0) {
            dataSource._array = R.sortWith(sortWith, dataSource._array);
          } else {
            dataSource._array = dataSource._arrayRaw;
          }
        },
        filter: (column, filter) => {
          const regex = new RegExp(".*" + filter + ".*", "i");
          const filterFn = R.filter(o => {
            return String(R.prop(column.key, o)).match(regex);
          });
          console.log("before filter", dataSource._arrayRaw);
          dataSource._array = filterFn(dataSource._arrayRaw);
          console.log("after filter", dataSource._array);
        }
      };

      table.dataSource = () => dataSource;

    },

    config: {
      width: 500,
      height: 500,
      rowHeight: 30,
      headerRowHeight: 50,
      columns: [],
      headerGroup: {}
    },

    configProcessed: {},

    setConfig: (config) => {
      const columns = R.addIndex(R.map)((c, i) => {
        return Object.assign({}, c, {__index: i})
      }, config.columns);
      table.config = Object.assign({}, table.config, config, {columns});

    },


    headerGroup: {

      _numberOfRows: () => {
        return 2;
      },
      _normalGroups: () => {
        // should be calculated based on config.headerGroup & config.columns
        return [
          {row: 0, left: 0, width: 500, name: "group a"},
          {row: 1, left: 0, width: 100, name: "group 1"},
          {row: 1, left: 100, width: 100, name: "group 2"}
        ];
      },
      _fixedGroups: () => {
        // should be calculated based on config.headerGroup & config.columns
        return [
          {row: 0, left: 0, width: 100, name: "group a"}
        ];
      }
    },

    utils: {


      bodyTop: () => table.utils.headerHeight(),
      bodyLeft: () => {
        return table.utils._sumOfWidth(table.utils._fixedColumns())
      },
      bodyVisibleWidth: () => {
        return table.config.width - table.utils.bodyLeft()
      },
      bodyVisibleHeight: () => {
        return table.config.height - table.utils.headerVisibleHeight();
      },
      bodyWidth: () => R.sum(R.map(c => c.width, table.utils._normalColumns())),
      bodyHeight: () => table.config.rowHeight * table.dataSource().size(),

      headerTop: () => 0,
      headerLeft: () => {
        return table.utils._sumOfWidth(table.utils._fixedColumns())
      },
      headerVisibleWidth: () => {
        return table.config.width - table.utils.headerLeft()
      },
      headerVisibleHeight: () => table.utils.headerHeight(),
      headerWidth: () => R.sum(R.map(c => c.width, table.utils._normalColumns())),
      headerHeight: () => {
        return table.config.headerRowHeight * (table.headerGroup._numberOfRows() + 1);
      },

      _headerGroupTop: () => 0,
      _headerGroupHeight: () => table.headerGroup._numberOfRows() * table.config.headerRowHeight,

      _normalColumns: () => {
        return R.filter(c => !c.fixed, table.config.columns)
      },
      _fixedColumns: () => {
        return R.filter(c => c.fixed, table.config.columns)
      },
      _sumOfWidth: R.pipe(R.map(c => c.width), R.sum),
      _leftOfColumn: (column) => {
        let left = 0;
        var columns = table.config.columns;
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].__index < column) {
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

        if (typeof row !== "undefined") {
          top = row * table.config.rowHeight + table.config.headerRowHeight - table.viewport.offsetTop();
          height = table.config.rowHeight;
        } else {
          height = table.config.headerRowHeight;
        }

        if (column <= table.utils._fixedColumns().length) {
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
          y: table.utils._headerGroupHeight(),
          width: c.width,
          height: table.config.headerRowHeight,
          value: c.name
        });

        startX += c.width;
      });

      table.headerGroup._fixedGroups().forEach(g => {
        headers.push({
          row: undefined,
          column: undefined,
          x: g.left,
          y: table.config.headerRowHeight * g.row,
          width: g.width,
          height: table.config.headerRowHeight,
          value: g.name
        });
      });


      return headers;

    },

    visibleHeaders: () => {

      let xFrom = table.viewport._xFrom();
      let xTo = table.viewport._xTo();
      const visiable = (x, width) => {
        let start = x;
        let end = x + width;
        return !(end < xFrom || start > xTo)
      };

      const headers = [];
      let startX = 0;
      table.utils._normalColumns().forEach(c => {
        if (visiable(startX, c.width)) {
          headers.push({
            row: undefined,
            column: c.__index,
            x: startX,
            y: table.utils._headerGroupHeight(),
            width: c.width,
            height: table.config.headerRowHeight,
            value: c.name
          });
        }
        startX += c.width;
      });

      table.headerGroup._normalGroups().forEach(g => {
        if (visiable(g.left, g.width)) {
          headers.push({
            row: undefined,
            column: undefined,
            x: g.left,
            y: table.config.headerRowHeight * g.row,
            width: g.width,
            height: table.config.headerRowHeight,
            value: g.name
          });
        }
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
      rowFrom = Math.min(rowFrom, table.dataSource().size() - 1);
      let rowTo = Math.ceil(viewport._yTo() / table.config.rowHeight);
      rowTo = Math.min(rowTo, table.dataSource().size() - 1);
      R.range(rowFrom, rowTo + 1).forEach(r => {
        visibleRows.push(r)
      });

      const rowCount = table.dataSource().size();
      return R.filter(r => r < rowCount && r > -1, visibleRows);
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


    }


  };

  return table;

};


export default {
  create
}
