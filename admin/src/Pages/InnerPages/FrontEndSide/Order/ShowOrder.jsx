import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridPagination, GridToolbarExport } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import CircularProgress from '@mui/material/CircularProgress'
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { editOrder, orderTrackId } from "../../../../Redux/Actions/FronendActions/OrderActions";
import { useDispatch } from "react-redux";
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';


let url = process.env.REACT_APP_API_URL

const ShowOrder = () => {

    const adminToken = localStorage.getItem('token');
    const dispatch = useDispatch()

    const [orderData, setOrderData] = useState([]);
    const [orderName, setOrderName] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [minAmountFilter, setMinAmountFilter] = useState('');
    const [maxAmountFilter, setMaxAmountFilter] = useState('');
    const [orderTypeFilter, setOrderTypeFilter] = useState('')

    const localeText = {
        noRowsLabel: "No Data Found 😔",
    };

    const Navigate = useNavigate()

    const columns = [
        {
            field: "orderId",
            width: 140,
            headerName: "Id",
            renderCell: (params) => (
                <h6
                    onClick={() => handleOrderUpdate(params.row._id, params.row.Track_id)}
                    style={{ cursor: "pointer" }}
                >
                    {params?.row?.orderId}
                </h6>
            )
        },
        {
            field: "PaymentId",
            width: 140,
            headerName: "Payment Id",
        },
        {
            field: "User_Name",
            headerName: "User Name",
            width: 130,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "User_Mobile_No",
            headerName: "Mobile No",
            width: 130,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "Date",
            headerName: "Date",
            width: 130,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "Time",
            headerName: "Time",
            width: 120,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "Shipping_Charge",
            headerName: "Shipping Charge",
            width: 100,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "OnlineCharge",
            headerName: "Online Charge",
            width: 100,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "FinalPrice",
            headerName: "Amount",
            width: 100,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "PaymentType",
            headerName: "PaymentType",
            width: 120,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "OrderType",
            headerName: "OrderType",
            width: 120,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "ShippingType",
            headerName: "ShippingType",
            width: 120,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "action",
            headerName: "Action",
            width: 100,
            renderCell: (params) => (
                <Stack direction="row">
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleOrderDelete(params.row._id)}
                    >
                        <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                    </IconButton>
                    <IconButton
                        aria-label="update"
                        onClick={() => handleOrderUpdate(params.row._id, params.row.Track_id)}
                    >
                        <i class="fas fa-pencil-alt font-size-16 font-Icon-Up"></i>
                    </IconButton>
                </Stack>
            ),
            filterable: false,
            sortable: false,
            hide: false,
        },
    ];


    useEffect(() => {
        async function getOrder() {
            try {
                const res = await axios.get(`${url}/order/get/all`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                setOrderData(res?.data?.orderList || []);
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getOrder();
    }, [startDateFilter, endDateFilter]);

    const handleOrderUpdate = (id, trackId) => {
        dispatch(editOrder(id))
        dispatch(orderTrackId(trackId))
        Navigate('/editOrders')
    }

    const handleOrderDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${url}/order/delete/${id}`,
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        })
                    .then(() => {
                        setOrderData(orderData.filter((d) => d?._id !== id) || []);
                        Swal.fire("Success!", "Order has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Order has not been deleted!", "error");
                    });
            }
        });
    };


    const handleMultipleOrderDelete = () => {
        let idsToDelete = selectedRows

        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${url}/order/deletes`, {
                        data: { ids: idsToDelete },
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    })
                    .then(() => {
                        setOrderData(orderData?.filter((d) => !idsToDelete?.includes(d?._id)) || []);
                        Swal.fire("Success!", "Order has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Order has not been deleted!", "error");
                    });
            }
        });
    };


    const handleFilter = () => {

        const filteredOrderList = orderData?.filter((order) => {
            const formattedOrderName = (order?.name || "").toUpperCase().replace(/\s/g, "");
            let isOrderName = true;
            if (orderName) {
                isOrderName = formattedOrderName.includes(orderName.toUpperCase().replace(/\s/g, ""));
            }
            return isOrderName;
        });

        // Apply date filtering
        let filteredByDate = filteredOrderList;
        if (startDateFilter || endDateFilter) {
            filteredByDate = filteredOrderList?.filter((order) => {
                let orderDate = order?.Date;
                const [day, month, year] = orderDate?.split('/');
                const newDate = new Date(year, month - 1, day);
                newDate.setHours(0, 0, 0, 0);

                let isDateInRange = true;
                if (startDateFilter && endDateFilter) {
                    const startDate = new Date(startDateFilter);
                    startDate.setHours(0, 0, 0, 0);

                    const endDate = new Date(endDateFilter);
                    endDate.setHours(0, 0, 0, 0);

                    isDateInRange = newDate >= startDate && newDate <= endDate;
                } else if (startDateFilter) {
                    const startDate = new Date(startDateFilter);
                    startDate.setHours(0, 0, 0, 0);
                    isDateInRange = newDate >= startDate;
                } else if (endDateFilter) {
                    const endDate = new Date(endDateFilter);
                    endDate.setHours(0, 0, 0, 0);
                    isDateInRange = newDate <= endDate;
                }
                return isDateInRange;
            });
        }

        // Apply order type filtering
        let filteredByOrderType = filteredByDate;
        if (orderTypeFilter) {
            filteredByOrderType = filteredByDate?.filter((order) =>
                order?.OrderType?.toUpperCase() === orderTypeFilter.toUpperCase()
            );
        }

        // Apply order amount filtering
        // let filteredByAmount = filteredByDate;
        // if (minAmountFilter || maxAmountFilter) {
        //     filteredByAmount = filteredByDate?.filter((order) => {
        //         const orderAmount = parseFloat(order?.FinalPrice);
        //         let isAmountInRange = true;
        //         if (minAmountFilter && maxAmountFilter) {
        //             const minAmount = parseFloat(minAmountFilter);
        //             const maxAmount = parseFloat(maxAmountFilter);
        //             isAmountInRange = orderAmount >= minAmount && orderAmount <= maxAmount;
        //         } else if (minAmountFilter) {
        //             const minAmount = parseFloat(minAmountFilter);
        //             isAmountInRange = orderAmount >= minAmount;
        //         } else if (maxAmountFilter) {
        //             const maxAmount = parseFloat(maxAmountFilter);
        //             isAmountInRange = orderAmount <= maxAmount;
        //         }
        //         return isAmountInRange;
        //     });
        // }



        // Apply search query filtering
        const filteredData = filteredByOrderType?.filter((order) => {
            const formattedSearchQuery = searchQuery.toUpperCase().replace(/\s/g, "");
            const rowValues = Object.values(order);
            for (let i = 0; i < rowValues.length; i++) {
                const formattedRowValue = String(rowValues[i]).toUpperCase().replace(/\s/g, "");
                if (formattedRowValue.includes(formattedSearchQuery)) {
                    return true;
                }
            }
            return false;
        });

        return filteredData;
    };



    const getRowId = (row) => row._id;

    const handleCellClick = (params, event) => {
        if (event.target.type !== "checkbox") {
            event.stopPropagation();
        }
    };

    const handleClearFilters = () => {
        setStartDateFilter('');
        setEndDateFilter('');
        setMinAmountFilter('');
        setMaxAmountFilter('');
        setOrderTypeFilter('')
    };

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-2 table-heading">
                            Order List
                        </div>
                        <div className="searchContainer mb-3">
                            <div className="searchBarcontainer">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="searchBar"
                                />
                                <ClearIcon className="cancelSearch" onClick={() => setSearchQuery("")} />
                            </div>
                        </div>
                        <div className="col-12">

                            <TextField
                                label='Start Date'
                                type='date'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: '5px', width: "135px" }}
                                value={startDateFilter}
                                onChange={(e) => setStartDateFilter(e.target.value)}
                            />
                            <TextField
                                label='End Date'
                                type='date'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: '5px', width: "135px" }}
                                value={endDateFilter}
                                onChange={(e) => setEndDateFilter(e.target.value)}
                            />
                            <FormControl style={{ margin: '2px', width: "135px" }} variant="outlined" className="dropdown">
                                <InputLabel>Order Type</InputLabel>
                                <Select
                                    value={orderTypeFilter}
                                    onChange={(e) => setOrderTypeFilter(e.target.value)}
                                    label="Order Type"
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Accepted">Accepted</MenuItem>
                                    <MenuItem value="Rejected">Rejected</MenuItem>
                                    <MenuItem value="Processing">Processing</MenuItem>
                                    <MenuItem value="Ready to Ship">Ready to Ship</MenuItem>
                                    <MenuItem value="Shipped">Shipped</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                    <MenuItem value="Returned">Returned</MenuItem>
                                </Select>
                            </FormControl>


                            {/* <TextField
                                label='Min Amount'
                                type='number'
                                value={minAmountFilter}
                                onChange={(e) => setMinAmountFilter(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: '5px', width: "120px" }}
                                placeholder='Min Amount'
                            />
                            <TextField
                                label='Max Amount'
                                type='number'
                                value={maxAmountFilter}
                                onChange={(e) => setMaxAmountFilter(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: '5px', width: "120px" }}
                                placeholder='Max Amount'
                            /> */}

                            <a className="btn btn-danger waves-effect waves-light" style={{ margin: '12px' }} onClick={() => handleClearFilters()}>
                                Clear Filters
                            </a>

                            {/* <div className="card"> */}
                            <div className="datagrid-container">
                                <DataGrid
                                    style={{ textTransform: "capitalize" }}
                                    rows={handleFilter()}
                                    columns={columns}
                                    checkboxSelection
                                    disableSelectionOnClick
                                    getRowId={getRowId}
                                    filterPanelDefaultOpen
                                    filterPanelPosition="top"
                                    slots={{
                                        toolbar: (props) => (
                                            <div>
                                                <GridToolbar />
                                            </div>
                                        ),
                                    }}
                                    loading={isLoading}
                                    localeText={localeText}
                                    onCellClick={handleCellClick}
                                    onRowSelectionModelChange={(e) => setSelectedRows(e)}
                                    initialState={{
                                        pagination: { paginationModel: { pageSize: 10 } },
                                    }}
                                    pageSizeOptions={[10, 25, 50, 100]}
                                />
                                {selectedRows.length > 0 && (
                                    <div className="row-data">
                                        <div>{selectedRows.length} Categories selected</div>
                                        <DeleteIcon
                                            style={{ color: "red" }}
                                            className="cursor-pointer"
                                            onClick={() => handleMultipleOrderDelete()}
                                        />
                                    </div>
                                )}
                            </div>
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowOrder;
