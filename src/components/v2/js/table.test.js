import tableCreator from "./table";
import chai from "chai";
import R from "ramda";

describe("js table", () => {

  chai.config.truncateThreshold = 0;

  const byXY = (d) => d.x * 100000 + d.y;
  const sortByXY = R.sortBy(byXY);

  const createFakeData = (rows, cols) => {
    return R.range(0, rows).map(row => {
      const keys = R.range(0, cols).map(c => "f" + c);
      const values = R.range(0, cols).map(c => row + "_" + c);
      return R.zipObj(keys, values);
    })
  };

  const createExpectedData = (rowFrom, rowTo, colFrom, colTo, rowOffset = 0, colOffset = 0) => {
    return R.flatten(R.range(rowFrom, rowTo+1).map(row => {
      return R.range(colFrom, colTo+1).map(col => {
        return {
          type: 'cell',
          row: row,
          column: col,
          x: (col + colOffset) * 100,
          y: (row + rowOffset) * 10,
          width: 100,
          height: 10,
          value: row + "_" + col
        }
      });
    }))
  };

  const createColumnDefns = (cols) => {
    return R.range(0, cols).map(c => {
      return {
        name: "F"+c,
        key: "f"+c,
        width: 100
      }
    })
  }

  it("can get visible cell correctly", () => {

    const table = tableCreator.create();
    table.setDataArray(createFakeData(3, 2));

    table.setConfig({
      headerRowHeight: 30,
      rowHeight: 10,
      columns: createColumnDefns(2)
    });

    const expected = sortByXY(createExpectedData(0, 2, 0, 1));
    const actual = sortByXY(table.visibleCells());

    chai.expect(actual).to.have.lengthOf(expected.length);
    chai.expect(actual).to.be.deep.equal(expected);


  })

  it("can get visible cell correctly, with fixed column", () => {

    const table = tableCreator.create();
    table.setDataArray(createFakeData(3, 4));

    var columns = createColumnDefns(4);
    columns[0].fixed = true;
    columns[1].fixed = true;
    table.setConfig({
      headerRowHeight: 30,
      rowHeight: 10,
      columns: columns
    });

    const expected = sortByXY(createExpectedData(0, 2, 2, 3, 0, -2));
    const actual = sortByXY(table.visibleCells());

    chai.expect(actual).to.have.lengthOf(expected.length);
    chai.expect(actual).to.be.deep.equal(expected);


  })

  it("can get visible cell, for viewport", () => {

    const table = tableCreator.create();
    table.setDataArray(createFakeData(100, 100));

    table.setConfig({
      width: 100 * 6,
      height: 30 + 10 * 5,
      headerRowHeight: 30,
      rowHeight: 10,
      columns: createColumnDefns(100)
    });

    const expected = sortByXY(createExpectedData(0, 5, 0, 6));
    const actual = sortByXY(table.visibleCells());

    chai.expect(actual).to.have.lengthOf(expected.length);
    chai.expect(actual).to.be.deep.equal(expected);

  })

  it("can get visible cell, for viewport with offset", () => {

    const table = tableCreator.create();
    table.setDataArray(createFakeData(100, 100));

    table.setConfig({
      width: 100 * 6,
      height: 30 + 10 * 5,
      headerRowHeight: 30,
      rowHeight: 10,
      columns: createColumnDefns(100)
    });

    table.setViewport({
      offsetLeft: () => 300,
      offsetTop: () => 30,
    });

    const expected = sortByXY(createExpectedData(3, 8, 2, 9));
    const actual = sortByXY(table.visibleCells());

    chai.expect(actual).to.have.lengthOf(expected.length);
    chai.expect(actual).to.be.deep.equal(expected);

  })

  it("can get visible cell, for viewport with offset, with half size", () => {

    const table = tableCreator.create();
    table.setDataArray(createFakeData(100, 100));

    table.setConfig({
      width: 100 * 6,
      height: 30 + 10 * 5,
      headerRowHeight: 30,
      rowHeight: 10,
      columns: createColumnDefns(100)
    });

    table.setViewport({
      offsetLeft: () => 300 + 50,
      offsetTop: () => 30 + 5,
    });

    const expected = sortByXY(createExpectedData(3, 9, 3, 9));
    const actual = sortByXY(table.visibleCells());

    //console.log("actual", actual);
    //console.log("expected", expected);

    chai.expect(actual).to.have.lengthOf(expected.length);
    chai.expect(actual).to.be.deep.equal(expected);

  })

});
