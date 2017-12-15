/**
 * Created by wizcheng on 10/12/2017.
 */
import * as headerGroup from './header_group';
import chai from 'chai';

describe('header group', () => {


  describe('compute', () => {


    describe('single level', () => {

      const columns = [
        {name: 'Column 1', key: 'col_1', width: 100, fixed: true},
        {name: 'Column 2', key: 'col_2', width: 100},
        {name: 'Column 3', key: 'col_3', width: 100}
      ];

      const groups = [
        {
          name: 'Group 1', key: 'group_1', type: 'group', children: [
            {type: 'column', key: 'col_1'}
          ]
        },
        {
          name: 'Group 2', key: 'group_2', type: 'group', children: [
            {type: 'column', key: 'col_2'},
            {type: 'column', key: 'col_3'}
          ]
        }
      ];

      const groupingDefinition = headerGroup.compute(columns, groups);

      it('can compute number of rows', () => {
        chai.expect(groupingDefinition.numberOfRows).to.be.equals(1)
      });

      it('can compute fixed groups', () => {
        const expected = [
          {row: 0, left: 0, width: 100, name: "Group 1"}
        ];
        chai.expect(groupingDefinition.fixedGroups).to.be.deep.equals(expected)
      });

      it('can compute normal groups', () => {
        const expected = [
          {row: 0, left: 100, width: 200, name: "Group 2"}
        ];
        chai.expect(groupingDefinition.normalGroups).to.be.deep.equals(expected)
      });

    });

    describe('multiple level', () => {

      const columns = [
        {name: 'Column 1', key: 'col_1', width: 100, fixed: true},
        {name: 'Column 2', key: 'col_2', width: 100},
        {name: 'Column 3', key: 'col_3', width: 100},
        {name: 'Column 4', key: 'col_4', width: 100},
        {name: 'Column 5', key: 'col_5', width: 100},
      ];

      const groups = [
        {
          name: 'Group 1', key: 'group_1', type: 'group', children: [
            {name: 'Sub-Group 1', type: 'group', key: 'sub_group_1', children: [
                {type: 'column', key: 'col_1'}
            ]}
          ]
        },
        {
          name: 'Group 2', key: 'group_2', type: 'group', children: [
            {name: 'Sub-Group 2', type: 'group', key: 'sub_group_2', children: [
                {type: 'column', key: 'col_2'},
                {type: 'column', key: 'col_3'},
              ]},
            {name: 'Sub-Group 3', type: 'group', key: 'sub_group_3', children: [
                {type: 'column', key: 'col_4'},
                {type: 'column', key: 'col_5'},
              ]},
          ]
        }
      ];

      const groupingDefinition = headerGroup.compute(columns, groups);

      it('can compute number of rows', () => {
        chai.expect(groupingDefinition.numberOfRows).to.be.equals(2)
      });

      // it('can compute fixed groups', () => {
      //   const expected = [
      //     {row: 0, left: 0, width: 100, name: "Group 1"},
      //     {row: 1, left: 0, width: 100, name: "Sub-Group 1"},
      //   ];
      //   chai.expect(groupingDefinition.fixedGroups).to.be.deep.equals(expected)
      // });
      //
      // it('can compute normal groups', () => {
      //   const expected = [
      //     {row: 0, left: 100, width: 200, name: "Group 2"}
      //   ];
      //   chai.expect(groupingDefinition.normalGroups).to.be.deep.equals(expected)
      // });

    });


  })


});
