/**
 * Created by wizcheng on 10/12/2017.
 */
import R from 'ramda';

const enrichGroups = (groups, key2columns) => {

  const enrichGroup = (group) => {
    if (group.type === 'column') {
      const column = key2columns[group.key];
      group.column = column;
    } else {
      if (group.children) {
        group.children.forEach((child) => {
          enrichGroup(child);
        })
      }
    }
  };

  groups.forEach(enrichGroup);

};

const calculateWidth = (group) => {

  if (group.type === 'column'){
    return group.column.width;
  } else {
    if (group.children) {
      return R.sum(R.map(calculateWidth, group.children));
    }
    return 0;
  }
};

const calculateLevel = (group, prevLevel = 0) => {

  if (group.type === 'column'){
    return prevLevel;
  } else {
    if (group.children) {
      return R.reduce((v, obj) => Math.max(calculateLevel(obj, prevLevel + 1), v), prevLevel, group.children);
    }
    return prevLevel;
  }

};

const isFixed = (group) => {

  if (group.type === 'column'){
    return group.column.fixed;
  } else {
    if (group.children) {
      return R.any(isFixed, group.children);
    }
    return false;
  }

};

export const compute = (columns, groups) => {

  const key2columns = R.reduce((acc, value) => {
    acc[value.key] = value;
    return acc;
  }, {}, columns);

  const numberOfRows = R.reduce((acc, group) => Math.max(acc, calculateLevel(group, 0)), 0, groups)
  const fixedGroups = [];
  const normalGroups = [];

  enrichGroups(groups, key2columns);

  let left = 0;
  groups.forEach(group => {

    const width = calculateWidth(group);
    const row = 0;
    const name = group.name;
    const obj = {
      row, left, width, name
    };

    if (isFixed(group)){
      fixedGroups.push(obj);
    } else {
      normalGroups.push(obj);
    }

    left += width;

  });


  return {
    numberOfRows,
    fixedGroups,
    normalGroups
  };

};



