import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridPagination, GridToolbarExport } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import userImage from '../../../../resources/assets/images/3135715.png'
import { useDispatch } from "react-redux";
import { editUser, showUserCart } from "../../../../Redux/Actions/FronendActions/UserActionsAction";
import Modal from "react-modal";
import ImageModel from "../../../../Components/ImageComp/ImageModel";

let url = process.env.REACT_APP_API_URL

const ShowUser = () => {

    const [userData, setUserData] = useState([]);
    const [userName, setUserName] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true)

    // for big image
    const [selectedImage, setSelectedImage] = useState("");
    const [isModalOpenforImage, setIsModalOpenforImage] = useState(false);

    const handleImageClick = (imageURL) => {
        setSelectedImage(imageURL);
        setIsModalOpenforImage(true);
    };

    const Navigate = useNavigate()
    const dispatch = useDispatch()

    const localeText = {
        noRowsLabel: "No Data Found 😔",
    };

    const columns = [
        {
            field: "_id",
            width: 220,
            headerName: "Id",
        },
        {
            field: "showUserType",
            headerName: "Type",
            width: 90,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "User_Name",
            headerName: "Name",
            width: 130,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "User_Image",
            headerName: "Image",
            width: 110,
            renderCell: (params) => (
                <img
                    src={`${params?.value}` !== "undefined" ? `${url}/${params?.value}` : userImage}
                    alt="User Image"
                    height={35}
                    width={35}
                    style={{ borderRadius: '50%', cursor: "pointer" }}
                    onClick={() => handleImageClick(`${params?.value}` !== "undefined" ? `${url}/${params?.value}` : userImage)}
                />
            ),
            sortable: false,
            filterable: false,
        },
        {
            field: "User_Email",
            headerName: "Email",
            width: 190,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "User_Mobile_No",
            headerName: "Mobile No",
            width: 115,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "Wallet",
            headerName: "Wallet",
            width: 80,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        // {
        //     field: "Referral_Use",
        //     headerName: "Code Use",
        //     width: 80,
        //     filterable: true,
        //     sortable: true,
        //     filterType: "multiselect",
        // },
        {
            field: "Coins",
            headerName: "Coins",
            width: 80,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "Referral",
            headerName: "Referral Code",
            width: 120,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "Block",
            headerName: "Block",
            width: 90,
            renderCell: (params) => (
                <div className="form-check form-switch-user">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`customSwitch-${params.id}`}
                        onChange={() => handleUserStatus(params.row, !params.value)}
                        checked={params.value}
                        onClick={(event) => event.stopPropagation()}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={`customSwitch-${params.id}`}
                        style={{ color: params.value ? "red" : "grey" }}
                    >
                        {params.value ? "Block" : "UnBlock"}
                    </label>
                </div>
            ),
            filterable: false,
            sortable: true,
            hide: false,
        },
        {
            field: "isAbleWallet",
            headerName: "Wallet Status",
            width: 90,
            renderCell: (params) => (
                <div className="form-check form-switch-user">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`customSwitch-${params.id}`}
                        onChange={() => handleUserWalletStatus(params.row, !params.value)}
                        checked={params.value}
                        onClick={(event) => event.stopPropagation()}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={`customSwitch-${params.id}`}
                        style={{ color: params.value ? "green" : "grey" }}
                    >
                        {params.value ? "Yes" : "No"}
                    </label>
                </div>
            ),
            filterable: false,
            sortable: true,
            hide: false,
        },
        {
            field: "action",
            headerName: "Action",
            width: 90,
            renderCell: (params) => (
                <Stack direction="row">
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleUserDelete(params.row._id)}
                    >
                        <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                    </IconButton>
                    <IconButton
                        aria-label="update"
                        onClick={() => handleUserUpdate(params.row)}
                    >
                        <i class="fas fa-pencil-alt font-size-16 font-Icon-Up"></i>
                    </IconButton>
                </Stack>
            ),
            filterable: false,
            sortable: false,
            hide: false,
        },
        {
            field: "view",
            headerName: "View Cart",
            width: 90,
            renderCell: (params) => (
                <Stack direction="row">
                    <IconButton
                        aria-label="view"
                        onClick={() => handleCartDetailsView(params.row?._id)}
                    >
                        <i className="fas fa-eye font-Icon-view" />
                    </IconButton>
                </Stack>
            ),
            filterable: false,
            sortable: false,
            hide: false,
        },
    ];

    useEffect(() => {
        async function getUser() {
            try {
                const adminToken = localStorage.getItem('token');

                const res = await axios.get(`${url}/user/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                setUserData(res?.data?.user || []);
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getUser();
    }, []);


    const handleUserDelete = (id) => {
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
                    .delete(`${url}/user/delete/${id}`)
                    .then(() => {
                        setUserData(userData.filter((d) => d?._id !== id));
                        Swal.fire("Success!", "User has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "User has not been deleted!", "error");
                    });
            }
        });
    };

    const handleUserUpdate = (user) => {
        dispatch(editUser(user))
        Navigate('/editUser')
    };

    const handleCartDetailsView = (product) => {
        dispatch(showUserCart(product))
        Navigate('/showUserCart')
    };



    const handleMultipleUserDelete = () => {
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
                    .delete(`${url}/user/deletes`, { data: { ids: idsToDelete } })
                    .then(() => {
                        setUserData(userData?.filter((d) => !idsToDelete?.includes(d?._id)));
                        Swal.fire("Success!", "User has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "User has not been deleted!", "error");
                    });
            }
        });
    };

    const handleUserStatus = async (user, newStatus) => {
        try {
            await axios.patch(
                `${url}/user/update/status/${user?._id}`,
                {
                    Block: newStatus,
                }
            );

            const updatedUserData = userData.map((c) =>
                c._id === user._id ? { ...c, Block: newStatus } : c
            );
            setUserData(updatedUserData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUserWalletStatus = async (user, newStatus) => {
        try {
            await axios.patch(
                `${url}/user/update/wallet/status/${user?._id}`,
                {
                    isAbleWallet: newStatus,
                }
            );

            const updatedUserData = userData.map((c) =>
                c._id === user._id ? { ...c, isAbleWallet: newStatus } : c
            );
            setUserData(updatedUserData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilter = () => {
        const filteredUserList = userData?.filter((user) => {
            const formattedUserName = (user?.name || "").toUpperCase().replace(/\s/g, "");
            let isUserName = true;
            if (userName) {
                isUserName = formattedUserName.includes(userName.toUpperCase().replace(/\s/g, ""));
            }

            return isUserName;
        });

        // Apply search query filtering
        const filteredData = filteredUserList.filter((user) => {
            const formattedSearchQuery = searchQuery.toUpperCase().replace(/\s/g, "");
            const rowValues = Object.values(user);
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

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-2 table-heading">
                                User List
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
                                                onClick={() => handleMultipleUserDelete()}
                                            />
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                className="main-content dark"
                isOpen={isModalOpenforImage}
            >

                <ImageModel
                    isOpen={isModalOpenforImage}
                    onClose={() => setIsModalOpenforImage(false)}
                    imageURL={selectedImage}
                />
            </Modal>
        </>
    );
};

export default ShowUser;
