import UsersInfoStores from "../../stores/users-info-stores.js";
import UsersLinkInfoStores from "../../stores/usersLink-info-stores.js";
import IpsStores from "../../stores/ip-stores";
import MachineRoomsStores from "../../stores/machineRoom-stores";
import NewsStores from "../../stores/new-stores";
import CpusStores from "../../stores/cpu-stores";
import HarddisksStores from "../../stores/harddisk-stores";
import MemorysStores from "../../stores/memory-stores";
import CabinetsStores from "../../stores/cabinet-stores";
import MachineLibrarysStores from "../../stores/machineLibrary-stores";
import EmployeeManagementsStores from "../../stores/employeeManagement-stores";
import ClientelesStores from "../../stores/clientele-stores";
import BusinessStores from "../../stores/business-stores";
import OrdersStores from "../../stores/order-stores";
import FinancesStores from "../../stores/finance-stores";
import StatisticalPerformancesStores from "../../stores/statisticalPerformance-stores";
import WhitelistsStores from "../../stores/whitelist-stores";
import WorkOrderTypesStores from "../../stores/workOrderType-stores";
import WorkOrdersStores from "../../stores/workOrder-stores";
import DepartmentsStores from "../../stores/department-stores";
import PositionsStores from "../../stores/position-stores";
import UsersStores from "../../stores/user-stores";
import RechargesStores from "../../stores/recharge-stores";
import ReviewRechargesStores from "../../stores/reviewRecharge-stores";
import DefenseipsStores from "../../stores/defenseip-stores";
import DefensePackagesStores from "../../stores/defensePackage-stores";
import DefenseBusinessStores from "../../stores/defenseBusiness-stores";
import DefenseipReviewsStores from "../../stores/defenseipReview-stores";
import DismissalReviewsStores from "../../stores/dismissalReview-stores";
import DisposalHistorysStores from "../../stores/disposalHistory-stores";
import NewTypesStores from "../../stores/newType-stores";
import ActionBoundStores from "../../stores/common/action-bound-stores";
import DefenseBusinesReviewsStores from "../../stores/defenseBusinesReview-stores";
import CustomerStatisticssStores from "../../stores/customerStatistics-stores";
import BusinessStatisticssStores from "../../stores/businessStatistics-stores";
import OverlaysStores from "../../stores/overlay-stores";
import OverlayBusinesssStores from "../../stores/overlayBusiness-stores";
import ResourceHistorysStores from "../../stores/resourceHistory-stores";



//路由配置共用参数
export const routerConfig = {
    baseUrl: "/tz_admin/show"
}

// 前端Models操作
export const stores = {
    commonStores: new ActionBoundStores(),
    usersInfoStores: new UsersInfoStores(), //用户通信录
    usersLinkInfoStores: new UsersLinkInfoStores(), //用户联系人信息
    ipsStores: new IpsStores(), //ip资源库
    MachineRoomsStores: new MachineRoomsStores(), //机房管理
    newsStores: new NewsStores(),
    cpusStores: new CpusStores(),
    harddisksStores: new HarddisksStores(),
    memorysStores: new MemorysStores(),
    cabinetsStores: new CabinetsStores(),
    machineLibrarysStores: new MachineLibrarysStores(),
    employeeManagementsStores: new EmployeeManagementsStores(),
    clientelesStores: new ClientelesStores(),
    businessStores: new BusinessStores(),
    ordersStores: new OrdersStores(),
    financesStores: new FinancesStores(),
    statisticalPerformancesStores: new StatisticalPerformancesStores(),
    whitelistsStores: new WhitelistsStores(),
    workOrderTypesStores: new WorkOrderTypesStores(),
    workOrdersStores: new WorkOrdersStores(),
    departmentsStores: new DepartmentsStores(),
    positionsStores: new PositionsStores(),
    usersStores: new UsersStores(),
    rechargesStores: new RechargesStores(),
    reviewRechargesStores: new ReviewRechargesStores(),
    defenseipsStores: new DefenseipsStores(),
    defensePackagesStores: new DefensePackagesStores(),
    defenseBusinessStores: new DefenseBusinessStores(),
    defenseipReviewsStores: new DefenseipReviewsStores(),
    dismissalReviewsStores: new DismissalReviewsStores(),
    disposalHistorysStores: new DisposalHistorysStores(),
    newTypesStores: new NewTypesStores(),
    defenseBusinesReviewsStores: new DefenseBusinesReviewsStores(),
    customerStatisticssStores: new CustomerStatisticssStores(),
    businessStatisticssStores: new BusinessStatisticssStores(),
    overlaysStores: new OverlaysStores(),
    overlayBusinesssStores: new OverlayBusinesssStores(),
    resourceHistorysStores: new ResourceHistorysStores()
}
export const domIds = [
    "user_list",
    "link_user",
    "ip_list",
    "machine_room",
    "new",
    "cpu_list",
    "harddisk_list",
    "memory_list",
    "cabinet_list",
    "machine_library",
    "employeeManagement_list",
    "clientele",
    "business",
    "checkBusiness",
    "order",
    "finance",
    "statisticalPerformance",
    "whitelist",
    "workOrderType",
    "workOrder",
    "home",
    "department",
    "position",
    "user",
    "recharge",
    "reviewRecharge",
    "defenseip",
    "defensePackage",
    "defenseBusiness",
    "defenseipReview",
    "dismissalReview",
    "disposal",
    "disposalHistory",
    "machineProcessing",
    "newTypeManagement",
    "defenseBusinesReview",
    "customerStatistics",
    "businessStatistics",
    "overlay",
    "overlayBusiness",
    "resourceHistory"
];
