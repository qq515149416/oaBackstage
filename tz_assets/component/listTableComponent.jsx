import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { observer, inject } from "mobx-react";
import PostData from "./listTable/postData.jsx";
import EnhancedTableHead from "./listTable/enhancedTableHead.jsx";
import EnhancedTableToolbar from "./listTable/enhancedTableToolbar.jsx";
import ExpansionComponent from "./expansionComponent.jsx";
import FilterTableToolbar from "./listTable/filterTableToolbar.jsx";
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const qs = require('qs');

function getSorting(order, orderBy) {
    if(orderBy=="calories") {
        return (a,b) => {
            if(typeof a.haveBusiness == "number"&&typeof b.haveBusiness == "number") {
                if (a.haveBusiness < b.haveBusiness) {
                    return 1;
                }else if(a.haveBusiness > b.haveBusiness){
                    return -1;
                }else{
                    return 0;
                }
            } else {
                return b.id - a.id;
            }
        };
    }
    if(orderBy === "money") {
        return order === 'desc'
            ? (a, b) => (Number(b[orderBy]) < Number(a[orderBy]) ? -1 : 1)
            : (a, b) => (Number(a[orderBy]) < Number(b[orderBy]) ? -1 : 1);
    }
    return order === 'desc'
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);

}
//计算字符串长度包含中文
function getByteLen(val) {
  var len = 0;
  for (var i = 0; i < val.length; i++) {
       var a = val.charAt(i);
       if (a.match(/[^\x00-\xff]/ig) != null)
      {
          len += 2;
      }
      else
      {
          len += 1;
      }
  }
  return len;
}
const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit,
      position: "relative"
    },
    table: {
      minWidth: 1020,
    },
    tableWrapper: {
      overflowX: 'auto',
      overflowY: 'hidden'
    },
    paper: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2
    },
    td: {
      paddingLeft: 0,
      paddingRight: 0,
      textAlign: "center",
      fontSize: 16
    },
    tdLast: {
      textAlign: "center"
    },
    tdFirst: {
      textAlign: "center"
    },
    tableComponent: {
        width: 35,
        height: 35
    },
    excelBtn: {
        position: "absolute",
        bottom: 5,
        left: 5,
        zIndex: 99
    },
    placeholder: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 4
    }
  });
  @inject("commonStores")
  @observer
  class EnhancedTable extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        order: 'asc',
        orderBy: 'calories',
        selected: [],
        page: 0,
        rowsPerPage: 10
      };

    }
    componentDidMount() {
        if(this.props.otherConfig) {
            this.setState({
                ...this.props.otherConfig
            });
        }
        // this.props.usersLinkInfoStores.getData();
    }
    getData() {
        return this.props.data;
    }
    handleRequestSort = (event, property) => {
      const orderBy = property;
      let order = 'desc';

      if (this.state.orderBy === property && this.state.order === 'desc') {
        order = 'asc';
      }

      this.setState({ order, orderBy });
    };
    handleSelectAllEmptyClick = () => {
      this.setState({ selected: [] });
    }
    handleSelectAllClick = (event, checked) => {
      if (checked) {
        this.setState({ selected: this.props.data.map(n => n.id) });
        return;
      }
      this.setState({ selected: [] });
    };

    handleClick = (event, id) => {
      const { selected } = this.state;
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }

      this.setState({ selected: newSelected });
    };

    handleChangePage = (event, page) => {
        const currentStores = this.props.currentStores || this.props.commonStores;
        if(currentStores&&currentStores.page) {
            if(currentStores[currentStores.page].current_page!=(page+1)) {
                currentStores.getPageData((page+1));
            }
        } else {
            this.setState({ page });
        }
    };

    handleChangeRowsPerPage = event => {
        const currentStores = this.props.currentStores || this.props.commonStores;
        if(currentStores&&currentStores.page) {
            return ;
        }
      this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;
    renderLinkComponent = (data) => {
        const { classes } = this.props;
      let operat = this.props.headTitlesData.find(item => item.id=="operat");
      return operat.extendUrl.map(extendUrl => {
        if(extendUrl.rule) {
            if(extendUrl.rule.type=="equal") {
              if(data[extendUrl.rule.term]==extendUrl.rule.execute) {
                return (
                  <ExpansionComponent
                      type="link"
                      className={classes.tableComponent}
                      title={extendUrl.title}
                      icon={extendUrl.icon}
                      link={extendUrl.link+"?"+qs.stringify(Object.keys(data).reduce((result,item) => {
                        if(extendUrl.param && extendUrl.param.find(e => {
                          if(Object.prototype.toString.call(e)!="[object Object]") {
                            return item==e;
                          } else {

                            return e.field==item;
                          }
                        })) {

                          if(Object.prototype.toString.call(data[item])!="[object Object]") {
                            result[item] = data[item];
                          } else {
                            Object.assign(result,{
                              ...Object.keys(data[item]).reduce((result,attr) => {
                                if(extendUrl.param.find(e => e.value==attr)) {
                                  result[attr] = data[item][attr];
                                }
                                return result;
                              },{})
                            });

                          }
                        }
                        return result;
                      },{}))}
                    />
                )
              } else {
                return null;
              }
            } else if(extendUrl.rule.type=="more") {
              if(data[extendUrl.rule.term] > extendUrl.rule.execute) {
                return (
                  <ExpansionComponent
                      type="link"
                      className={classes.tableComponent}
                      title={extendUrl.title}
                      icon={extendUrl.icon}
                      link={extendUrl.link+"?"+qs.stringify(Object.keys(data).reduce((result,item) => {
                        if(extendUrl.param && extendUrl.param.find(e => {
                          if(Object.prototype.toString.call(e)!="[object Object]") {
                            return item==e;
                          } else {

                            return e.field==item;
                          }
                        })) {

                          if(Object.prototype.toString.call(data[item])!="[object Object]") {
                            result[item] = data[item];
                          } else {
                            Object.assign(result,{
                              ...Object.keys(data[item]).reduce((result,attr) => {
                                if(extendUrl.param.find(e => e.value==attr)) {
                                  result[attr] = data[item][attr];
                                }
                                return result;
                              },{})
                            });

                          }
                        }
                        return result;
                      },{}))}
                    />
                )
              } else {
                return null;
              }
            } else {
              if(data[extendUrl.rule.term]!=extendUrl.rule.execute) {
                return (
                  <ExpansionComponent
                      type="link"
                      className={classes.tableComponent}
                      title={extendUrl.title}
                      icon={extendUrl.icon}
                      link={extendUrl.link+"?"+qs.stringify(Object.keys(data).reduce((result,item) => {
                        if(extendUrl.param && extendUrl.param.find(e => {
                          if(Object.prototype.toString.call(e)!="[object Object]") {
                            return item==e;
                          } else {

                            return e.field==item;
                          }
                        })) {

                          if(Object.prototype.toString.call(data[item])!="[object Object]") {
                            result[item] = data[item];
                          } else {
                            Object.assign(result,{
                              ...Object.keys(data[item]).reduce((result,attr) => {
                                if(extendUrl.param.find(e => e.value==attr)) {
                                  result[attr] = data[item][attr];
                                }
                                return result;
                              },{})
                            });

                          }
                        }
                        return result;
                      },{}))}
                    />
                )
              } else {
                return null;
              }
            }

          }
          return (
            <ExpansionComponent
                type="link"
                className={classes.tableComponent}
                title={extendUrl.title}
                icon={extendUrl.icon}
                link={extendUrl.link+"?"+qs.stringify(Object.keys(data).reduce((result,item) => {
                    if(extendUrl.param && extendUrl.param.find(e => {
                      if(Object.prototype.toString.call(e)!="[object Object]") {
                        return item==e;
                      } else {

                        return e.field==item;
                      }
                    })) {

                      if(Object.prototype.toString.call(data[item])!="[object Object]") {
                        result[item] = data[item];
                      } else {
                        Object.assign(result,{
                          ...Object.keys(data[item]).reduce((result,attr) => {
                            if(extendUrl.param.find(e => e.value==attr)) {
                              result[attr] = data[item][attr];
                            }
                            return result;
                          },{})
                        });

                      }
                    }
                    return result;
                  },{}))}
              />
          )
      });
    }
    renderExpansionComponent = (data) => {
        const { classes } = this.props;
      if(!this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule) {
        return (
          <ExpansionComponent
            type="confirm"
            className={classes.tableComponent}
            tip_title={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.title}
            tip_content={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.content}
            ok={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.ok}
            cancel={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.cancel}
            input={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.input}
            data={data}
            updata = {this.props.updata}
            select={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.select}
            selectOptions={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.selectOptions}
            icon={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.icon}
          />
        );
      }
      if(this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule && this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule.type=="equal") {
        if(this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule.execute==data[this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule.term]) {
          return (
            <ExpansionComponent
              type="confirm"
              className={classes.tableComponent}
              tip_title={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.title}
              tip_content={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.content}
              ok={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.ok}
              cancel={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.cancel}
              input={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.input}
              data={data}
              updata = {this.props.updata}
              select={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.select}
              selectOptions={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.selectOptions}
              icon={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.icon}
            />
          );
        }
      }
      if(this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule && this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule.type=="unequal") {
        if(this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule.execute!=data[this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule.term]) {
          return (
            <ExpansionComponent
              type="confirm"
              className={classes.tableComponent}
              tip_title={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.title}
              tip_content={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.content}
              ok={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.ok}
              cancel={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.cancel}
              input={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.input}
              data={data}
              updata = {this.props.updata}
              select={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.select}
              selectOptions={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.selectOptions}
              icon={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.icon}
            />
          );
        }
      }
      if(this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule && this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule.type=="max") {
        if(this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule.execute > data[this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule.term]) {
            return (
              <ExpansionComponent
                type="confirm"
                className={classes.tableComponent}
                tip_title={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.title}
                tip_content={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.content}
                ok={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.ok}
                cancel={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.cancel}
                input={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.input}
                data={data}
                updata = {this.props.updata}
                select={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.select}
                selectOptions={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.selectOptions}
                icon={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.icon}
              />
            );
          }
      }

      if(this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule && this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule.type=="min") {
        if(this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule.execute < data[this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.rule.term]) {
            return (
              <ExpansionComponent
                type="confirm"
                className={classes.tableComponent}
                tip_title={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.title}
                tip_content={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.content}
                ok={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.ok}
                cancel={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.cancel}
                input={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.input}
                data={data}
                updata = {this.props.updata}
                select={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.select}
                selectOptions={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.selectOptions}
                icon={this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.icon}
              />
            );
          }
      }

    }
    render() {
      const { classes } = this.props;
      const {  order, orderBy, selected  } = this.state;
      let { page } = this.state;
      let { rowsPerPage } = this.state;
        if(this.props.prohibitedPage) {
            rowsPerPage = this.props.data.length;
        }

    const ExtendComponent = this.props.extendComponent || null;
      const currentStores = this.props.currentStores || this.props.commonStores;
      const excelHeadTitlesData = Array.from(this.props.headTitlesData);
      if(this.props.headTitlesData.find(item => item.id=="operat") && this.props.headTitlesData.find(item => item.id=="operat").extend && this.props.headTitlesData.find(item => item.id=="operat").extendData) {
        this.props.headTitlesData.find(item => item.id=="operat").extendData.forEach(item => {
            excelHeadTitlesData.push(item);
        });
      }
    if(currentStores&&currentStores.page) {
        rowsPerPage = this.props.data.length;
        // page = currentStores[currentStores.page].current_page-1;
    }
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.props.data.length - page * rowsPerPage);
      // console.log(currentStores.getRequestState);
      return [
          <div>
             {
              this.props.filterType && (
                <Paper className={`${classes.paper} ${this.props.listFilterComponentClassName}`} elevation={1}>
                      <FilterTableToolbar filterData={this.props.filterData} types={this.props.headTitlesData} filterType={this.props.filterType} />
                </Paper>
              )
            }
          </div>,
        <Paper className={`${classes.root} ${this.props.className}`}>
            {
                ExtendComponent && (
                    <ExtendComponent getRef={(ref) => this.extendComponent = ref} />
                )
            }
          <EnhancedTableToolbar
            operatBtns={this.props.operatBtns}
            title={(this.props.title || "未定义")}
            inputType={this.props.inputType}
            operattext={this.props.operattext}
            addData={this.props.addData}
            numSelected={selected.length}
            getParentData={this.getData.bind(this)}
            handleSelectAllEmptyClick={this.handleSelectAllEmptyClick}
            delData={this.props.delData}
            checkAll={this.props.checkAll}
            selectedData={selected}
            addTitle={this.props.addTitle}
          />
          {
              this.props.customizeToolbar && (
                <Paper className={classes.paper} style={{
                    boxShadow: "none",
                    paddingTop: 0,
                    paddingBottom: 0
                }} elevation={1}>
                      {this.props.customizeToolbar}
                </Paper>
              )
            }
          <div className={classes.tableWrapper}>

                {
                    this.props.data && (
                        <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={this.props.data.length}
                headTitlesData = {this.props.headTitlesData}
              />

              <TableBody>
                {
                    (currentStores.getRequestState == 2) && (
                        <TableRow>
                            <TableCell className={classes.td} numeric colSpan={this.props.headTitlesData.length}>
                                <CircularProgress color="secondary" size={50} />
                            </TableCell>
                        </TableRow>
                    )
                }
                {
                    (currentStores.getRequestState < 2 && this.props.data.length <= 0) && (
                        <TableRow>
                            <TableCell className={classes.td} numeric colSpan={this.props.headTitlesData.length}>
                                暂无数据
                            </TableCell>
                        </TableRow>
                    )
                }
                {this.props.data.length > 0 && this.props.data
                  .sort(getSorting(order, orderBy))
                //   .sort()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((n,i,arr) => {
                    const isSelected = this.isSelected(n.id);
                    let styleParma = {};
                    if(this.props.tableRowStyle) {
                        styleParma = this.props.tableRowStyle(n);
                    }
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n.id}
                        selected={isSelected}
                        {...styleParma}
                      >
                        <TableCell onClick={event => this.handleClick(event, n.id)} className={classes.tdFirst} padding="checkbox">
                          <Checkbox checked={isSelected} />
                        </TableCell>
                        {
                          this.props.headTitlesData.map((item,index,original) => {
                            if(item.id=="operat") {
                              return null;
                            }
                            // if(index==0&&getByteLen(this.props.data[index][item.id]) > 13) {
                            //   return (
                            //     <TableCell component="th" scope="row" padding="none">
                            //       {item.id.indexOf(".") > -1 ? n[item.id.split(".")[0]][item.id.split(".")[1]] : n[item.id]}
                            //     </TableCell>
                            //   )
                            // } else {
                            if(item.render) {
                                return item.render((element) => {
                                    return (
                                        <TableCell className={classes.td} numeric>
                                            {element}
                                        </TableCell>
                                    );
                                },n[item.id]);
                            }
                              return (
                                <TableCell className={classes.td} numeric>{item.id.indexOf(".") > -1 ? n[item.id.split(".")[0]][item.id.split(".")[1]] : n[item.id]}</TableCell>
                              )
                            // }
                          })
                        }
                        {
                          this.props.headTitlesData.find(item => item.id=="operat") ? (
                            <TableCell className={classes.tdLast} numeric>
                              {this.props.changeData && (
                                <PostData className={classes.tableComponent} operattext={this.props.operattext || this.props.title} inputType={this.props.inputType} postType="edit" editData={n} changeData={this.props.changeData} />
                              )}
                              {
                                (this.props.headTitlesData.find(item => item.id=="operat").extend && this.props.headTitlesData.find(item => item.id=="operat").extendData ) && (<ExpansionComponent
                                  type="show"
                                  data={this.props.headTitlesData.find(item => item.id=="operat").extendData.map((item,index) => {
                                    // console.log(item,i,arr);
                                    return {
                                      ...item,
                                      content: n[item.id]
                                    };
                                  })}
                                />)
                              }
                              {
                                (this.props.headTitlesData.find(item => item.id=="operat").extend && this.props.headTitlesData.find(item => item.id=="operat").extendConfirm && !this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.last ) && (
                                    this.renderExpansionComponent(n)
                                )
                              }
                              {
                                (this.props.headTitlesData.find(item => item.id=="operat").extend && this.props.headTitlesData.find(item => item.id=="operat").extendElement ) && (
                                  this.props.headTitlesData.find(item => item.id=="operat").extendElement(Object.assign(n,{
                                    extendComponent: this.extendComponent
                                  }),this.props.updata)
                                )
                              }
                              {
                                (this.props.headTitlesData.find(item => item.id=="operat").extend && this.props.headTitlesData.find(item => item.id=="operat").extendUrl ) && (
                                  this.renderLinkComponent(n)
                                )
                              }
                              {
                                (this.props.headTitlesData.find(item => item.id=="operat").extend && this.props.headTitlesData.find(item => item.id=="operat").extendConfirm && this.props.headTitlesData.find(item => item.id=="operat").extendConfirm.last ) && (
                                    this.renderExpansionComponent(n)
                                )
                              }
                            </TableCell>
                          ):null
                        }
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={this.props.headTitlesData.length+1} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
                    )
                }

          </div>
          <ExcelFile filename={"TZOA"+(this.props.title || "未定义")+Math.round(new Date().getTime()/1000)} element={(
            <Button className={classes.excelBtn} color="primary">
                导出excel
            </Button>
          )}>
            <ExcelSheet data={this.props.data
                  .sort(getSorting(order, orderBy))
                  .sort((a,b) => {
                        return b.id - a.id
                })} name="OA数据">
                {
                    excelHeadTitlesData.filter(item => item.id != "operat").map(item => (
                        <ExcelColumn label={item.label} value={item.id}/>
                    ))
                }
            </ExcelSheet>
        </ExcelFile>
        {
            this.props.prohibitedPage && (
                <div className={classes.placeholder}>

                </div>
            )
        }
          {
              !this.props.prohibitedPage && (
                <TablePagination
                    component="div"
                    count={(currentStores&&currentStores.page) ? currentStores[currentStores.page].total : this.props.data.length}
                    rowsPerPage={(currentStores&&currentStores.page) ? (this.props.data.length == currentStores[currentStores.page].per_page ? rowsPerPage : currentStores[currentStores.page].per_page):rowsPerPage}
                    page={(currentStores&&currentStores.page) ? currentStores[currentStores.page].current_page-1 : page}
                    backIconButtonProps={{
                    'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                    'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    labelRowsPerPage="每页行数："
                    labelDisplayedRows={({ from, to, count }) => {
                        if(currentStores&&currentStores.page) {
                            return `${currentStores[currentStores.page].from}到${currentStores[currentStores.page].to}条，一共： ${currentStores[currentStores.page].total}条`;
                        } else {
                            return `${from}到${to}条，一共： ${count}条`;
                        }

                    } }
                />
              )
          }

        </Paper>
      ];
    }
  }
  EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  const ListTableComponent = (props) => {
    return <EnhancedTable {...props} />
  }
  export default withStyles(styles)(ListTableComponent);
