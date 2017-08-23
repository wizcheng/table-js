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
      table.config = Object.assign({}, table.config, config);
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
    _fixedColumnWidth: () => 0,

    visibleCells: () => {

      const isVisible = (from, to, visibleFrom, visibleTo) => {
        return !(to < visibleFrom || from > visibleTo);
      };

      const visibleColumns = [];
      const visibleRows = [];
      const viewport = table.viewport;

      // calculate visible columns
      let i = 0;
      let prevEnd = 0;
      console.log("viewport xFrom/xTo", viewport._xFrom(), viewport._xTo());
      for (i = 0; i < table.config.columns.length; i++) {

        const currStart = prevEnd;
        const currEnd = prevEnd + table.config.columns[i].width;

        var visible = isVisible(currStart, currEnd, viewport._xFrom(), viewport._xTo());
        if (visible) {
          visibleColumns.push(i);
        }

        prevEnd = currEnd;
      }

      // calculate visible rows
      let rowFrom = Math.floor(viewport._yFrom() / table.config.rowHeight);
      rowFrom = Math.min(rowFrom, table.dataSource().size()-1);
      let rowTo = Math.ceil(viewport._yTo() / table.config.rowHeight);
      rowTo = Math.min(rowTo, table.dataSource().size()-1);
      R.range(rowFrom, rowTo + 1).forEach(r => {visibleRows.push(r)});

      console.log("rowFrom/To", rowFrom, rowTo, table.config.rowHeight);
      console.log("visible (rows/columns)", visibleRows, visibleColumns);

      const columnX = (col) => {
        return R.sum(R.map(column => column.width, R.addIndex(R.filter)((_, i) => i < col, table.config.columns)));
      };
      const visibleCells = [];
      const dataSource = table.dataSource();
      const rowHeight = table.config.rowHeight;
      visibleColumns.forEach((col) => {
        const columnConfig = table.config.columns[col];
        const x = columnX(col);
        visibleRows.forEach((row) => {
          const data = dataSource.at(row);
          const value = data[columnConfig.key];
          visibleCells.push({
            y: rowHeight * row,
            x: x,
            width: columnConfig.width,
            height: rowHeight,
            value: value
          })
        })
      });

      return visibleCells;
    }


  };

  return table;

};


export default {
  create
}
