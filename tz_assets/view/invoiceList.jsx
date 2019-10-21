import React from "react";
import ListTableComponent from "../component/listTableComponent.jsx";
import { inject,observer } from "mobx-react";
import Address from "../component/dialog/address.jsx";
import InvoiceApplication from "../component/dialog/invoiceApplication.jsx";
const qs = require('qs');

const columnData = [
    { id: 'name', numeric: true, disablePadding: false, label: '名称' },
    { id: 'num', numeric: true, disablePadding: false, label: '企业编号' },
    { id: 'address', numeric: true, disablePadding: false, label: '地址' },
    { id: 'tel', numeric: true, disablePadding: false, label: '电话' },
    { id: 'bank', numeric: true, disablePadding: false, label: '开户银行' },
    { id: 'bank_acc', numeric: true, disablePadding: false, label: '银行账号' },
    { id: 'operat', numeric: true, disablePadding: false, extend: true, extendElement: (data,update) => {
        return (
            <InvoiceApplication {...data} customer_id={qs.parse(location.search.substr(1)).id} update={update} />
        )
    } ,label: '操作'}
];
const inputType = [
  {
    field: "name",
    label: "名称",
    type: "text",
    helperText: "*必填项"
  },
  {
    field: "num",
    label: "识别号",
    type: "text",
    helperText: "*必填项"
  },
//   {
//     field: "address",
//     label: "地址",
//     type: "component",
//     Component: Address,
//     helperText: "如果是开专票此项必须填写"
//   },
  {
    field: "address",
    label: "地址",
    type: "text",
    helperText: "如果是开专票此项必须填写"
  },
  {
    field: "tel",
    label: "电话",
    type: "text",
    helperText: "如果是开专票此项必须填写"
  },
  {
    field: "bank",
    label: "银行",
    type: "text",
    helperText: "如果是开专票此项必须填写"
  },
  {
    field: "bank_acc",
    label: "银行账号",
    type: "text",
    helperText: "如果是开专票此项必须填写"
  }
];
@inject("invoicesStores")
@observer
class InvoiceList extends React.Component {
    addData = (param,callbrak) => {
        // console.log(param);
        this.props.invoicesStores.addData(Object.assign(param,{
            user_id: qs.parse(location.search.substr(1)).id
        })).then((state) => {
            callbrak(state);
        });
    }
    delData = (selectedData,callbrak) => {
        const {invoicesStores} = this.props;
        let delIng = selectedData.map(item => invoicesStores.delData(item));
        callbrak(delIng);
    }
    changeData = (param,callbrak) => {
        const {invoicesStores} = this.props;
        invoicesStores.changeData(Object.assign(param,{
            user_id: qs.parse(location.search.substr(1)).id,
            payable_id: param.id
        })).then((state) => {
          callbrak(state);
        });
    }
    componentDidMount() {
        this.props.invoicesStores.getData({
            user_id: qs.parse(location.search.substr(1)).id
        });
    }
    render() {
        return (
          <ListTableComponent
            title="发票管理"
            operatBtns={<Address model="show" showText="地址管理" />}
            operattext="发票"
            inputType={inputType}
            headTitlesData={columnData}
            data={this.props.invoicesStores.invoices}
            currentStores={this.props.invoicesStores}
            addData={this.addData.bind(this)}
            delData={this.delData.bind(this)}
            changeData={this.changeData.bind(this)}
          />
        );
      }
}
export default InvoiceList;
