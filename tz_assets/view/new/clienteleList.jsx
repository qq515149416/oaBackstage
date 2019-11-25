import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
    PagingState,
    IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel
} from '@devexpress/dx-react-grid-material-ui';
import { DataTypeProvider } from '@devexpress/dx-react-grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { get } from "../../tool/http.js";
import Menu from "../../component/new/menu.jsx";

const columnData = [
    { id: 'name', numeric: true, disablePadding: false, label: '用户名' },
    { id: 'nickname', numeric: true, disablePadding: false, label: '昵称' },
    { id: 'email', numeric: true, disablePadding: false, label: '邮箱' },
    { id: 'money', numeric: true, disablePadding: false, label: '余额' },
    { id: 'clerk_name', numeric: true, disablePadding: false, label: '业务员' },
    { id: 'status', numeric: true, disablePadding: false, label: '状态' },
    { id: 'created_at', numeric: true, disablePadding: false, label: '创建时间' },
    { id: 'operat', numeric: true, disablePadding: false, label: '操作' }
];

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
}));

const OperatFormatter = ({ value }) => (
    <Menu menus={value} />
);

export default () => {
    const classes = useStyles();
    const [columns] = useState(columnData.map(item => ({
        name: item.id,
        title: item.label
    })));
    const [rows,setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageSizes] = useState([5, 10, 15]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [tableColumnExtensions] = useState([
        { columnName: 'operat', align: 'center' },
    ]);
    const [operatColumns] = useState(['operat']);
    useEffect(() => {
        if((!loading) && (!rows.length)) {
            get("business/admin_customer").then(res => {
                if(res.data.code==1) {
                    setRows(res.data.data.map(item => ({
                        ...item,
                        operat: [{
                            buttonName: "顾客信息修改",
                            component: "SetCustomerInfo",
                            props: {
                                title: "顾客信息修改",
                                description: "修改客户的信息"
                            }
                        }]
                    })));
                    setLoading(true);
                }
            });
        }
    });
    return (
        <Paper style={{ position: 'relative' }}>
          <Grid
            rows={rows}
            columns={columns}
          >
            <PagingState
                defaultCurrentPage={currentPage}
                onCurrentPageChange={setCurrentPage}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
            />
            <IntegratedPaging />
            <DataTypeProvider
                formatterComponent={OperatFormatter}
                for={operatColumns}
            />
            <Table
                columnExtensions={tableColumnExtensions}
            />
            <TableHeaderRow />
            <PagingPanel
                pageSizes={pageSizes}
            />
          </Grid>
          {!loading && (
            <div className={classes.root}>
                <CircularProgress color="secondary" />
            </div>
          )}

        </Paper>
      );
}
