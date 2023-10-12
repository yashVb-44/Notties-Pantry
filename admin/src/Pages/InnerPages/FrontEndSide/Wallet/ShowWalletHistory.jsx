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
import { useDispatch } from "react-redux";
import { TextField } from '@mui/material'


let url = process.env.REACT_APP_API_URL

const ShowWalletHistory = () => {

    const adminToken = localStorage.getItem('token');
    const dispatch = useDispatch()

    const [walletData, setWalletData] = useState([]);
    const [walletName, setWalletName] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');

    const Navigate = useNavigate()

    const localeText = {
        noRowsLabel: "No Data Found 😔",
    };

    const columns = [
        {
            field: "_id",
            width: 140,
            headerName: "Id",
        },
        {
            field: "paymentId",
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
            field: "Trans_Type",
            headerName: "Type",
            width: 80,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "Amount",
            headerName: "Amount",
            width: 100,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
            renderCell: (params) => (
                <div>
                    {params?.row?.Trans_Type === "Credit" ? (
                        <a style={{ color: "green" }}>
                            +{params?.value}
                        </a>
                    ) : (
                        <a style={{ color: "red" }}>
                            -{params?.value}
                        </a>
                    )}
                </div>
            )
        },
        {
            field: "Type",
            headerName: "Actions",
            width: 120,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "action",
            headerName: "Action",
            width: 60,
            renderCell: (params) => (
                <Stack direction="row">
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleWalletDelete(params.row._id)}
                    >
                        <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                    </IconButton>
                    {/* <IconButton
                        aria-label="update"
                        onClick={() => handleWalletUpdate(params.row._id)}
                    >
                        <i class="fas fa-pencil-alt font-size-16 font-Icon-Up"></i>
                    </IconButton> */}
                </Stack>
            ),
            filterable: false,
            sortable: false,
            hide: false,
        },
    ];


    useEffect(() => {
        async function getWallet() {
            try {
                const res = await axios.get(`${url}/wallet/history/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setWalletData(res?.data?.wallet || []);
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getWallet();
    }, []);

    const handleWalletUpdate = (id) => {
        // dispatch(editWallet(id))
        Navigate('/editWallets')
    }

    const handleWalletDelete = (id) => {
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
                    .delete(`${url}/wallet/history/delete/${id}`,
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        })
                    .then(() => {
                        setWalletData(walletData.filter((d) => d?._id !== id) || []);
                        Swal.fire("Success!", "Wallet has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Wallet has not been deleted!", "error");
                    });
            }
        });
    };


    const handleMultipleWalletDelete = () => {
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
                    .delete(`${url}/wallet/history/deletes`, {
                        data: { ids: idsToDelete },
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    })
                    .then(() => {
                        setWalletData(walletData?.filter((d) => !idsToDelete?.includes(d?._id)) || []);
                        Swal.fire("Success!", "Wallet has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Wallet has not been deleted!", "error");
                    });
            }
        });
    };

    const handleFilter = () => {

        const filteredWalletList = walletData?.filter((wallet) => {
            const formattedWalletName = (wallet?.name || "").toUpperCase().replace(/\s/g, "");
            let isWalletName = true;
            if (walletName) {
                isWalletName = formattedWalletName.includes(walletName.toUpperCase().replace(/\s/g, ""));
            }

            return isWalletName;
        });

        // Apply date filtering
        let filteredByDate = filteredWalletList;
        if (startDateFilter || endDateFilter) {
            filteredByDate = filteredWalletList?.filter((wallet) => {
                let walletDate = wallet?.Date;
                const [day, month, year] = walletDate?.split('/');
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

        // Apply search query filtering
        const filteredData = filteredByDate.filter((wallet) => {
            const formattedSearchQuery = searchQuery.toUpperCase().replace(/\s/g, "");
            const rowValues = Object.values(wallet);
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
    };

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-2 table-heading">
                            Wallet History
                        </div>
                        <div className="d-flex flex-wrap gap-2 mt-2">

                            <button onClick={() => Navigate("/addWallet")} className="btn btn-primary waves-effect waves-light">
                                Add Wallet <i className="fas fa-arrow-right ms-2"></i>
                            </button>
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
                            {/* <div className="card"> */}

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
                            <a className="btn btn-danger waves-effect waves-light" style={{ margin: '12px' }} onClick={() => handleClearFilters()}>
                                Clear Filters
                            </a>


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
                                    localeText={localeText}
                                    loading={isLoading}
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
                                            onClick={() => handleMultipleWalletDelete()}
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

export default ShowWalletHistory;
