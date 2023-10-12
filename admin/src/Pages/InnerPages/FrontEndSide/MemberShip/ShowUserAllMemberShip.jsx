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
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import ShowMemberShipForm from "./ShowMemberShipForm";


let url = process.env.REACT_APP_API_URL

const ShowUserAllMemberShip = () => {

    const adminToken = localStorage.getItem('token');
    const selectedMemberShipData = useSelector((state) => state?.MemberShipDataChange?.payload)

    const [memberShipDatas, setMemberShipDatas] = useState([]);
    const [memberShipData, setMemberShipData] = useState([])

    const Navigate = useNavigate()

    // show membership form 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState()

    useEffect(() => {
        Modal.setAppElement(document.body);
    }, []);

    const handleOpenModal = (data) => {
        setSelectedForm(data)
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    useEffect(() => {
        async function getMemberShip() {
            try {
                const res = await axios.get(`${url}/memberShip/history/get/${selectedMemberShipData?._id}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setMemberShipDatas(res?.data?.memberShips || []);
                setMemberShipData(memberShipDatas?.[0]?.MemberShipData || [])
            } catch (error) {
                console.log(error)
            }
        }
        getMemberShip();
    }, [memberShipDatas, memberShipData]);

    // function to convert date
    const convertToDate = (date) => {
        const startDate = new Date(date);

        const year = startDate.getUTCFullYear();
        const month = String(startDate.getUTCMonth() + 1).padStart(2, "0");
        const day = String(startDate.getUTCDate()).padStart(2, "0");

        const formattedStartDate = `${day}-${month}-${year}`;
        return formattedStartDate

    }


    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                {/* <div className="card"> */}
                                <div className="form-group mt-3">
                                    <label htmlFor="example-text-input"
                                        className="col-md-3" style={{ color: "#5b73e8", textDecoration: "underline" }}>
                                        MemberShip Details :
                                    </label>
                                    <div className="col-md-12 ">
                                        <table id="t01" style={{ width: "100%" }} border="1">
                                            <tr>
                                                <th>No.</th>
                                                <th>Payment Id</th>
                                                <th>MemberShip Name</th>
                                                <th>MemberShip Price</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>Form</th>
                                            </tr>

                                            {memberShipData && memberShipData?.map((ship, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{ship?.PaymentId}</td>
                                                        <td>{ship?.MemberShip?.MemberShip_Name}</td>
                                                        <td>₹ {ship?.MemberShip?.MemberShip_Price}</td>
                                                        <td> {convertToDate(ship?.MemberShip?.startDate)}</td>
                                                        <td> {convertToDate(ship?.MemberShip?.endDate)}</td>
                                                        <td
                                                            style={{
                                                                color: "#5b73e8",
                                                                fontSize: "small",
                                                                textDecoration: "underline",
                                                                cursor: "pointer"
                                                            }}
                                                            onClick={() => handleOpenModal(ship)}
                                                        >
                                                            view
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </table>
                                    </div>
                                </div>
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                className="main-content dark"
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
            >
                <ShowMemberShipForm
                    handleCloseModal={handleCloseModal}
                    selectedForm={selectedForm}
                />
            </Modal>
        </>
    );
};

export default ShowUserAllMemberShip;
