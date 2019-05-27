import React from "react";
import {Route} from "react-router-dom";
import UsersList from "../view/usersList.jsx";
import UsersLinkList from "../view/usersLinkList.jsx";
import IpList from "../view/ipList.jsx";
import MachineRoomList from "../view/machineRoomList.jsx";
import NewList from "../view/newList.jsx";
import CpuList from "../view/cpuList.jsx";
import HarddiskList from "../view/harddiskList.jsx";
import MemoryList from "../view/memoryList.jsx";
import CabinetList from "../view/cabinetList.jsx";
import MachineLibraryList from "../view/machineLibraryList.jsx";
import EmployeeManagementList from "../view/employeeManagementList.jsx";
import ClienteleList from "../view/clienteleList.jsx";
import BusinesList from "../view/businesList.jsx";
import CheckBusinessList from "../view/checkBusinessList.jsx";
import OrderList from "../view/orderList.jsx";
import FinanceList from "../view/financeList.jsx";
import StatisticalPerformanceList from "../view/statisticalPerformanceList.jsx";
import WhitelistList from "../view/whitelistList.jsx";
import WorkOrderTypeList from "../view/workOrderTypeList.jsx";
import WorkOrderList from "../view/workOrderList.jsx";
import Home from "../view/home.jsx";
import DepartmentList from "../view/departmentList.jsx";
import PositionList from "../view/positionList.jsx";
import UserList from "../view/userList.jsx";
import RechargeList from "../view/rechargeList.jsx";
import ReviewRechargeList from "../view/reviewRechargeList.jsx";
import DefenseipList from "../view/defenseipList.jsx";
import DefensePackageList from "../view/defensePackageList.jsx";
import DefenseBusinesList from "../view/defenseBusinesList.jsx";
import DefenseipReviewList from "../view/defenseipReviewList.jsx";
import DismissalReviewList from "../view/dismissalReviewList.jsx";
import DisposalList from "../view/disposalList.jsx";
import DisposalHistoryList from "../view/disposalHistoryList.jsx";
import MachineProcessing from "../view/machineProcessing.jsx";
import NewTypeManagementList from "../view/newTypeManagementList.jsx";
import DefenseBusinesReviewList from "../view/defenseBusinesReviewList.jsx";
import CustomerStatisticsList from "../view/customerStatisticsList.jsx";
import BusinessStatisticssList from "../view/businessStatisticssList.jsx";
import OverlayList from "../view/overlayList.jsx";
import OverlayBusinessList from "../view/overlayBusinessList.jsx";





import { routerConfig } from "../config/common/config.js"

const baseUrl = routerConfig.baseUrl;

export default () => [
    <Route path={`${baseUrl}/user_list`} component={UsersList} />,
    <Route path={`${baseUrl}/user_link_list`} component={UsersLinkList} />,
    <Route path={`${baseUrl}/resource/ip`} component={IpList} />,
    <Route path={`${baseUrl}/resource/machine_room`} component={MachineRoomList} />,
    <Route path={`${baseUrl}/article`} component={NewList} />,
    <Route path={`${baseUrl}/resource/cpu`} component={CpuList} />,
    <Route path={`${baseUrl}/resource/harddisk`} component={HarddiskList} />,
    <Route path={`${baseUrl}/resource/memory`} component={MemoryList} />,
    <Route path={`${baseUrl}/resource/cabinet`} component={CabinetList} />,
    <Route path={`${baseUrl}/resource/machinelibrary`} component={MachineLibraryList} />,
    <Route path={`${baseUrl}/hr/employeeManagement`} component={EmployeeManagementList} />,
    <Route path={`${baseUrl}/crm/clientele`} component={ClienteleList} />,
    <Route path={`${baseUrl}/business`} exact component={BusinesList} />,
    <Route path={`${baseUrl}/checkbusiness`} component={CheckBusinessList} />,
    <Route path={`${baseUrl}/business/order`} component={OrderList} />,
    <Route path={`${baseUrl}/finance`} component={FinanceList} />,
    <Route path={`${baseUrl}/statisticalPerformance`} component={StatisticalPerformanceList} />,
    <Route path={`${baseUrl}/whitelist`} component={WhitelistList} />,
    <Route path={`${baseUrl}/work_order_type`} component={WorkOrderTypeList} />,
    <Route path={`${baseUrl}/work_order`} component={WorkOrderList} />,
    <Route path="/tz_admin" component={Home} exact />,
    <Route path={`${baseUrl}/hr/departmentview`} component={DepartmentList} />,
    <Route path={`${baseUrl}/hr/position`} component={PositionList} />,
    <Route path={`${baseUrl}/hr/usermanagement`} component={UserList} />,
    <Route path={`${baseUrl}/checkrecharge`} component={RechargeList} />,
    <Route path={`${baseUrl}/reviewRecharge`} component={ReviewRechargeList} />,
    <Route path={`${baseUrl}/defenseip`} component={DefenseipList} />,
    <Route path={`${baseUrl}/defensePackage`} component={DefensePackageList} />,
    <Route path={`${baseUrl}/defenseBusines`} component={DefenseBusinesList} />,
    <Route path={`${baseUrl}/defenseipReview`} component={DefenseipReviewList} />,
    <Route path={`${baseUrl}/dismissalReview`} component={DismissalReviewList} />,
    <Route path={`${baseUrl}/disposal`} component={DisposalList} />,
    <Route path={`${baseUrl}/disposalHistory`} component={DisposalHistoryList} />,
    <Route path={`${baseUrl}/machineProcessing`} component={MachineProcessing} />,
    <Route path={`${baseUrl}/newTypeManagement`} component={NewTypeManagementList} />,
    <Route path={`${baseUrl}/defenseBusinesReview`} component={DefenseBusinesReviewList} />,
    <Route path={`${baseUrl}/customerStatistics`} component={CustomerStatisticsList} />,
    <Route path={`${baseUrl}/businessStatistics`} component={BusinessStatisticssList} />,
    <Route path={`${baseUrl}/overlay`} component={OverlayList} />,
    <Route path={`${baseUrl}/overlayBusiness`} component={OverlayBusinessList} />

];
