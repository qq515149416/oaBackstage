import React from "react";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import ExpansionComponent from "../expansionComponent.jsx";
import Approval from "../icon/approval.jsx";
import PostData from "./postData.jsx";
const toolbarStyles = theme => ({
    root: {
      paddingRight: theme.spacing.unit,
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    spacer: {
      flex: '1 1 100%',
    },
    actions: {
      color: theme.palette.text.secondary,
      width: 48 * 2 + 10,
      textAlign: "right"
    },
    title: {
      flex: '0 0 auto',
      fontSize: 16
    },
    iconButton: {
        ...theme.tableIconButton
    }
  });



  let EnhancedTableToolbar = props => {
    const { numSelected, classes, selectedData, getParentData } = props;
    let data = selectedData.map(item => getParentData().find((e) => e.id == item));
    const delData = () => {
        let isDel = confirm(`是否要删除选中的${numSelected}个数据？`);
        if(isDel) {
            props.handleSelectAllEmptyClick();
            props.delData(selectedData,(delIng) => {
                Promise.all(delIng).then((ret) => {
                    ret.forEach(item => {
                        props.showPrompt(item.data.msg);
                    });
                    setTimeout(() => {
                        props.hidePrompt();
                    },2000);
                    // selectedData.forEach((item,index) => {
                    //   if(ret[index]) {
                    //     console.log("ID:"+item+"，删除成功");
                    //   } else {
                    //     console.warn("ID:"+item+"，删除失败");
                    //   }
                    // });
                });
            });
        }
    }
    const checkAllData = (result,param) => {
        let isCheck = confirm(`是否要对选中的${numSelected}个数据进行审批？`);
        const postAllData = selectedData.filter(id => {
            if(data.find(item => item.id == id).business_status!==undefined) {
                return data.find(item => item.id == id).business_status == 0;
            } else {
                return data.find(item => item.id == id).white_status == 0;
            }
        }).map(id => Object.assign(data.find(item => item.id == id),{
            id,
            business_number: data.find(item => item.id == id).business_number,
            business_status: param,
            check_note: result.note
        }));
        if(isCheck) {
            props.handleSelectAllEmptyClick();
            props.checkAll(postAllData,(checkAllIng) => {
                Promise.all(checkAllIng).then((ret) => {
                    selectedData.forEach((item,index) => {
                      if(ret[index]) {
                        console.log("ID:"+item+"，审批成功");
                      } else {
                        console.warn("ID:"+item+"，审批失败");
                      }
                    });
                });
            })
        }
    }
    const checkAllUnderData = (result,param) => {
      const { selectedData,updata } = props;
      props.handleSelectAllEmptyClick();
      const postAllData = selectedData.filter(id => data.find(item => item.id == id).remove_status==1).map(id => ({
        id,
        status: param,
        note: result.note
      }));
      props.checkUnderAll(postAllData,(checkAllIng) => {
          Promise.all(checkAllIng).then((ret) => {
              selectedData.forEach((item,index) => {
                if(ret[index]) {
                  console.log("ID:"+item+"，审批成功");
                } else {
                  console.warn("ID:"+item+"，审批失败");
                }
              });
              updata && updata();
          });
      })
  }
    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subheading">
              {numSelected} 选中
            </Typography>
          ) : (
            <div>
                <Typography style={{
                    marginRight: 16
                }} variant="title" id="tableTitle" dangerouslySetInnerHTML={{__html: props.title}}>
                </Typography>
                {props.operatBtns}
            </div>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 ? [
            <div>
              {
                props.delData && (<Tooltip title="删除">
                  <IconButton className={classes.iconButton} onClick={()=>{delData();}} aria-label="Delete">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>)
              }
              {
                  props.checkAll && (
                    <ExpansionComponent
                    type="confirm"
                    tip_title="批量审批操作"
                    tip_content="此操作将会应用在选中的数据上请谨慎操作"
                    ok={checkAllData.bind(this)}
                    select={true}
                    input={true}
                    data={{}}
                    icon={<Approval />}
                    selectOptions={(
                        props.checkSelectOptions ? props.checkSelectOptions : [
                            {
                                text: "审核通过",
                                value: 1
                            },
                            {
                                text: "审核不通过",
                                value: -2,
                                default: true
                            }
                        ]
                    )}
                    />
                  )
              }
              {
                props.checkUnderAll && (
                    <ExpansionComponent
                      type="confirm"
                      tip_title="批量下架操作"
                      tip_content="通知机房代表着你同意了这次的下架审核，网维将会收到这次的下架请求并进行处理，请您谨慎选择"
                      ok={checkAllUnderData.bind(this)}
                      data={{}}
                      select={true}
                      input={true}
                      icon={<Approval />}
                      selectOptions={(
                        props.checkSelectOptions ? props.checkSelectOptions : [
                            {
                                text: "同意",
                                value: 1,
                                default: true
                            },
                            {
                                text: "驳回",
                                value: 0
                            }
                        ]
                    )}
                    />
                  )
              }
            </div>
          ]: (
            <span>
              {
                props.addData && (
                  <PostData addTitle={props.addTitle} operattext={props.operattext || this.props.title} inputType={props.inputType} addData={props.addData} postType="add" />
                )
              }
            </span>
          )}
        </div>
      </Toolbar>
    );
  };

  EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
  };

 export default withStyles(toolbarStyles)(EnhancedTableToolbar);
