import React, { useState } from "react";
import defualtImage from "../../../../resources/assets/images/add-image.png";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlertBox from "../../../../Components/AlertComp/AlertBox"

let url = process.env.REACT_APP_API_URL

const AddHomeFeatures = () => {

    const adminToken = localStorage.getItem('token');

    const Navigate = useNavigate()
    const [homeFeatureName, setHomeFeatureName] = useState("");
    const [homeFeatureAddStatus, setHomeFeatureAddStatus] = useState();
    const [statusMessage, setStatusMessage] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (homeFeatureName !== "") {

            try {
                let response = await axios.post(
                    `${url}/homeFeatures/add`,
                    {
                        name: homeFeatureName,
                    },
                    {

                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                if (response.data.type === "success") {
                    setHomeFeatureAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box')
                    alertBox.classList.add('alert-wrapper')
                    setStatusMessage(response.data.message);
                    setHomeFeatureName("");
                    setTimeout(() => {
                        Navigate('/showHomeFeature');
                    }, 900);
                } else {
                    setHomeFeatureAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box')
                    alertBox.classList.add('alert-wrapper')
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setHomeFeatureAddStatus("error");
                let alertBox = document.getElementById('alert-box')
                alertBox.classList.add('alert-wrapper')
                setStatusMessage("HomeFeature not Add !");
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setHomeFeatureAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById('alert-box')
            alertBox?.classList?.remove('alert-wrapper')
        }, 1500);

        return () => clearTimeout(timer);
    }, [homeFeatureAddStatus, statusMessage]);


    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Add Home Feature</h4>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Home Feature Name :
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={homeFeatureName}
                                                        onChange={(e) => {
                                                            setHomeFeatureName(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a className="btn btn-danger" onClick={() => Navigate('/showHomeFeature')}>
                                                            {" "}
                                                            <i className="fas fa-window-close"></i> Cancel{" "}
                                                        </a>
                                                        <button className="btn btn-success" type="submit">
                                                            {" "}
                                                            <i className="fas fa-save"></i> Save{" "}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AlertBox status={homeFeatureAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default AddHomeFeatures;
