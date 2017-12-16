/**
 * Created by wizcheng on 10/12/2017.
 */
import R from 'ramda';

const enrichGroups = (groups, key2columns) => {

  const enrichGroup = (group) => {
    if (group.type === 'column') {
      const column = key2columns[group.key];
      if (R.isNil(column)){
        throw Error(`column definition with key ${group.key} not found, referenced by group ${JSON.stringify(group)}`)
      }

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

const attachLeft = (columns) => {

  let left = 0;

  const fixedColumns = columns.filter(c => c.fixed);
  const normalColumns = columns.filter(c => !c.fixed);

  left = 0;
  fixedColumns.forEach(column => {
    column.left = left;
    left += column.width;
  });

  left = 0;
  normalColumns.forEach(column => {
    column.left = left;
    left += column.width;
  });

  return columns;

};

const calculateLeft = (group) => {

  if (group.type === 'column'){
    return group.column.left;
  } else {
    if (group.children) {
      if (group.children) {
        return R.reduce((v, obj) => {

          const currLeft = calculateLeft(obj);
          if (v === null) return currLeft;
          if (currLeft === null) return v;
          return Math.min(currLeft, v)
        }, null, group.children);
      }
    }
    return null;
  }

};

export const computeGroups = (columns, groups) => {

  if (R.isNil(groups) || R.isEmpty(groups)){
    return {
      numberOfRows: 0,
      fixedGroups: [],
      normalGroups: []
    };
  }

  columns = attachLeft(columns);

  const key2columns = R.reduce((acc, value) => {
    acc[value.key] = value;
    return acc;
  }, {}, columns);

  const numberOfRows = R.reduce((acc, group) => Math.max(acc, calculateLevel(group, 0)), 0, groups)
  const fixedGroups = [];
  const normalGroups = [];

  enrichGroups(groups, key2columns);

  const convertToGroups = (group, row) => {

    if (group.type === 'column') {

      return null;

    } else {

      const left = calculateLeft(group);
      const width = calculateWidth(group);
      const name = group.name;
      const className = group.className;
      const obj = {
        row, left, width, name, className
      };

      if (isFixed(group)){
        fixedGroups.push(obj);
      } else {
        normalGroups.push(obj);
      }

      if (group.children){
        group.children.forEach(group => convertToGroups(group, row + 1));
      }
    }

  };

  groups.forEach(group => convertToGroups(group, 0));

  return {
    numberOfRows,
    fixedGroups,
    normalGroups
  };

};



