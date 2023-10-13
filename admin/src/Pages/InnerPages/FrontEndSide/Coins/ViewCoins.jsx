import React, { useState } from 'react'
import Modal from "react-modal";
import ImageModel from '../../../../Components/ImageComp/ImageModel';

const ViewsCoins = ({ handleCloseModal, selectedCoins }) => {

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
                                            <h4 className="mb-0">View Coin History</h4>
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
                                                User Name:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={selectedCoins?.User_Name}
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
                                                    value={selectedCoins?.User_Mobile_No}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Type:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={selectedCoins?.Trans_Type}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Amount:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={selectedCoins?.Amount}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Action:
                                            </label>
                                            <div className="col-md-10">
                                                <textarea
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={selectedCoins?.Type}
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
                                                    value={selectedCoins?.Date}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Time:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={selectedCoins?.Time}
                                                    readOnly
                                                />
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

export default ViewsCoins