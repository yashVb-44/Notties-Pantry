import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

let url = process.env.REACT_APP_API_URL

const EditCustomerSupport = ({ handleCloseModal, selectedForm }) => {

    const Navigate = useNavigate()

    const [solution, setSolution] = useState("")
    const [imagePreviews, setImagePreviews] = useState(
        selectedForm?.CustomerSupport_Images
    );

    useEffect(() => {
        setSolution(selectedForm?.solution)
    }, [selectedForm])

    const handleSubmit = async (e) => {

        const formData = {
            solution: solution
        }

        try {
            const adminToken = localStorage.getItem("token");
            let response = await axios.patch(
                `${url}/feedback/update/solution/${selectedForm?._id}`,
                formData,
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );
            if (response.data.type === "success") {
                alert(response.data.message);
                handleCloseModal()
                window.location.reload();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("Solution not Update !");
        }

    };


    return (
        <>
            <div className="main-content-model dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card model-card">
                                    <div className="card-body">
                                        <div className="page-title-box d-flex align-items-center justify-content-between">
                                            <h4 className="mb-0">Post requirement</h4>
                                            <i
                                                className="fas fa-window-close"
                                                style={{ cursor: "pointer", color: "red" }}
                                                onClick={handleCloseModal}
                                            ></i>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Order Id:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={selectedForm?.orderId}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                User Name:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={selectedForm?.User_Name}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                User Mobile No:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    required
                                                    className="form-control"
                                                    id="example-text-input"
                                                    value={selectedForm?.User_Mobile_No}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Subject:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={selectedForm?.subject}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Comment:
                                            </label>
                                            <div className="col-md-10">
                                                <textarea
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={selectedForm?.comment}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Date:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={selectedForm?.Date}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                Images:
                                            </label>
                                            <div className="col-md-10">
                                                <img
                                                    src={imagePreviews}
                                                    alt="Preview"
                                                    style={{ marginTop: "5px", marginLeft: "15px" }}
                                                    height={150}
                                                    width={150}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                Solution:
                                            </label>
                                            <div className="col-md-10">
                                                <textarea
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={solution}
                                                    onChange={(e) => setSolution(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-10">
                                            <div className="col ms-auto">
                                                <div className="d-flex flex-reverse flex-wrap gap-2">
                                                    <a
                                                        className="btn btn-danger"
                                                        onClick={handleCloseModal}
                                                    >
                                                        {" "}
                                                        <i className="fas fa-window-close"></i>{" "}
                                                        Cancel{" "}
                                                    </a>
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={() => handleSubmit()}
                                                    >
                                                        {" "}
                                                        <i className="fas fa-save"></i> Save{" "}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditCustomerSupport