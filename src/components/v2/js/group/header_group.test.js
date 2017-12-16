/**
 * Created by wizcheng on 10/12/2017.
 */
import * as headerGroup from './header_group';
import chai from 'chai';
import {computeGroups} from "./header_group";

describe('header group', () => {


  describe('computeGroups', () => {


    describe('general', () => {

      const columns = [
        {name: 'Column 1', key: 'col_1', width: 100, fixed: true},
        {name: 'Column 2', key: 'col_2', width: 100},
        {name: 'Column 3', key: 'col_3', width: 100}
      ];

      it('can handle null', () => {

        const result = computeGroups(columns, null);
        chai.expect(result.numberOfRows).to.be.equal(0);
        chai.expect(result.normalGroups).to.be.empty;
        chai.expect(result.fixedGroups).to.be.empty;

      })

      it('can handle undefined', () => {

        const result = computeGroups(columns, undefined);
        chai.expect(result.numberOfRows).to.be.equal(0);
        chai.expect(result.normalGroups).to.be.empty;
        chai.expect(result.fixedGroups).to.be.empty;

      })

    });

    describe('single level', () => {

      const columns = [
        {name: 'Column 1', key: 'col_1', width: 100, fixed: true},
        {name: 'Column 2', key: 'col_2', width: 100},
        {name: 'Column 3', key: 'col_3', width: 100}
      ];

      const groups = [
        {
          name: 'Group 1', key: 'group_1', type: 'group', className:'level-1', children: [
            {type: 'column', key: 'col_1'}
          ]
        },
        {
          name: 'Group 2', key: 'group_2', type: 'group', className:'level-1', children: [
            {type: 'column', key: 'col_2'},
            {type: 'column', key: 'col_3'}
          ]
        }
      ];

      const groupingDefinition = headerGroup.computeGroups(columns, groups);

      it('can computeGroups number of rows', () => {
        chai.expect(groupingDefinition.numberOfRows).to.be.equals(1);
      });

      it('can computeGroups fixed groups', () => {
        const expected = [
          {row: 0, left: 0, width: 100, name: "Group 1", className: 'level-1'}
        ];
        chai.expect(groupingDefinition.fixedGroups).to.be.deep.equals(expected);
      });

      it('can computeGroups normal groups', () => {
        const expected = [
          {row: 0, left: 0, width: 200, name: "Group 2", className: 'level-1'}
        ];
        chai.expect(groupingDefinition.normalGroups).to.be.deep.equals(expected);
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
          name: 'Group 1', key: 'group_1', type: 'group', className:'level-1', children: [
            {name: 'Sub-Group 1', type: 'group', className:'level-2', key: 'sub_group_1', children: [
                {type: 'column', key: 'col_1'}
            ]}
          ]
        },
        {
          name: 'Group 2', key: 'group_2', type: 'group', className:'level-1', children: [
            {name: 'Sub-Group 2', type: 'group', className:'level-2', key: 'sub_group_2', children: [
                {type: 'column', key: 'col_2'},
                {type: 'column', key: 'col_3'},
              ]},
            {name: 'Sub-Group 3', type: 'group', className:'level-2', key: 'sub_group_3', children: [
                {type: 'column', key: 'col_4'},
                {type: 'column', key: 'col_5'},
              ]},
          ]
        }
      ];

      const groupingDefinition = headerGroup.computeGroups(columns, groups);

      it('can computeGroups number of rows', () => {
        chai.expect(groupingDefinition.numberOfRows).to.be.equals(2)
      });

      it('can computeGroups fixed groups', () => {
        const expected = [
          {row: 0, left: 0, width: 100, name: "Group 1", className: 'level-1'},
          {row: 1, left: 0, width: 100, name: "Sub-Group 1", className: 'level-2'},
        ];

        chai.expect(groupingDefinition.fixedGroups).to.be.deep.equals(expected)
      });

      it('can computeGroups normal groups', () => {
        const expected = [
          {row: 0, left: 0, width: 400, name: "Group 2", className: 'level-1'},
          {row: 1, left: 0, width: 200, name: "Sub-Group 2", className: 'level-2'},
          {row: 1, left: 200, width: 200, name: "Sub-Group 3", className: 'level-2'},
        ];

        chai.expect(groupingDefinition.normalGroups).to.be.deep.equals(expected)
      });

    });


  })


});
