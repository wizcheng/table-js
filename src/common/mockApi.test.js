import mockApi from "./mockApi";

describe("mock api", () => {

  it("can load data", () => {

    expect(mockApi.loadData(10).length).toEqual(10)

  });

});
