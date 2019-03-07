import React from "react";
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
// const columnData = [
//     { id: 'contactname', numeric: false, disablePadding: true, label: '姓名' },
//     { id: 'qq', numeric: true, disablePadding: false, label: 'QQ' },
//     { id: 'mobile', numeric: true, disablePadding: false, label: '手机' },
//     { id: 'email', numeric: true, disablePadding: false, label: '邮箱' },
//     { id: 'rank', numeric: true, disablePadding: false, label: '权重' },
//     { id: 'site', numeric: true, disablePadding: false, label: '显示位置' },
//     { id: 'created_at', numeric: true, disablePadding: false, label: '创建时间' },
//     { id: 'updated_at', numeric: true, disablePadding: false, label: '更新时间' },
//     { id: 'operat', numeric: true, disablePadding: false, label: '操作' }
// ];
const styles = theme => ({
  td: {
    textAlign: "center",
    fontFamily: [
      'Microsoft YaHei',
      'SimHei',
      'SimSun',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 14,
  }
});

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {onSelectAllClick, order, orderBy, numSelected, rowCount, classes} = this.props;

    return (
        <TableHead>
          <TableRow>
            <TableCell className={classes.td} padding="checkbox">
              <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={numSelected === rowCount}
                  onChange={onSelectAllClick}
              />
            </TableCell>
            {this.props.headTitlesData.map(column => {
              return (
                  <TableCell
                      key={column.id}
                      numeric={column.numeric}
                      padding={column.disablePadding ? 'none' : 'default'}
                      sortDirection={orderBy === column.id ? order : false}
                      className={classes.td}
                  >
                    <Tooltip
                        title="排序"
                        placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                        enterDelay={300}
                    >
                      <TableSortLabel
                          active={orderBy === column.id}
                          direction={order}
                          onClick={this.createSortHandler(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
              );
            }, this)}
          </TableRow>
        </TableHead>
    );
  }
}
EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
const EnhancedTableHeadComponent = (props) => {
  return <EnhancedTableHead {...props} />
};
export default withStyles(styles)(EnhancedTableHead);
