import R from "ramda";

const loadData = (n, x = 5) => {

  const fields = R.map(f=>"field_" + f,R.range(1, x+1));
  const createItem = (i) => {
    var values = R.map(f => "r" + i + "_" + f, fields);
    return R.zipObj(fields, values)
  };

  return R.map(createItem, R.range(1, n+1));

};


export default {
  loadData
}
