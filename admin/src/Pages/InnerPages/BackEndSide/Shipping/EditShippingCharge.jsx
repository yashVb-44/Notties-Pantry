import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertBox from "../../../../Components/AlertComp/AlertBox";
import Select from "react-select";
import { City, State } from "country-state-city";
import { useSelector } from "react-redux";

let url = process.env.REACT_APP_API_URL;

const EditShippingCharge = () => {
    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate();

    const selectedCategoryData = useSelector((state) => state?.ShippingChargeChange?.payload);
    console.log(selectedCategoryData?.weights)

    const [shippingChargeType, setShippingChargeType] = useState("everywhere");
    const [userType, setUserType] = useState("0");
    const [shippingChargeAddStatus, setShippingChargeAddStatus] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [w0, setw0] = useState(selectedCategoryData?.weights[0]?.price || 0)
    const [w1, setw1] = useState(selectedCategoryData?.weights[1]?.price || 0)
    const [w2, setw2] = useState(selectedCategoryData?.weights[2]?.price || 0)
    const [w3, setw3] = useState(selectedCategoryData?.weights[3]?.price || 0)
    const [w4, setw4] = useState(selectedCategoryData?.weights[4]?.price || 0)
    const [w5, setw5] = useState(selectedCategoryData?.weights[5]?.price || 0)
    const [w6, setw6] = useState(selectedCategoryData?.weights[6]?.price || 0)
    const [w7, setw7] = useState(selectedCategoryData?.weights[7]?.price || 0)
    const [w8, setw8] = useState(selectedCategoryData?.weights[8]?.price || 0)
    const [w9, setw9] = useState(selectedCategoryData?.weights[9]?.price || 0)
    const [w10, setw10] = useState(selectedCategoryData?.weights[10]?.price || 0)
    const [w11, setw11] = useState(selectedCategoryData?.weights[11]?.price || 0)
    const [w12, setw12] = useState(selectedCategoryData?.weights[12]?.price || 0)
    const [w13, setw13] = useState(selectedCategoryData?.weights[13]?.price || 0)
    const [w14, setw14] = useState(selectedCategoryData?.weights[14]?.price || 0)
    const [w15, setw15] = useState(selectedCategoryData?.weights[15]?.price || 0)
    const [w16, setw16] = useState(selectedCategoryData?.weights[16]?.price || 0)
    const [w17, setw17] = useState(selectedCategoryData?.weights[17]?.price || 0)
    const [w18, setw18] = useState(selectedCategoryData?.weights[18]?.price || 0)
    const [w19, setw19] = useState(selectedCategoryData?.weights[19]?.price || 0)
    const [w20, setw20] = useState(selectedCategoryData?.weights[20]?.price || 0)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (shippingChargeType !== "") {

            try {
                let response = await axios.patch(
                    `${url}/shippingCharge/update/${selectedCategoryData?._id}`,
                    {
                        w0, w1, w2, w3, w4, w5, w6, w7, w8, w9,
                        w10, w11, w12, w13, w14, w15, w16, w17, w18, w19, w20
                    },
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                if (response?.data?.type === "success") {
                    setShippingChargeAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box');
                    alertBox.classList.add('alert-wrapper');
                    setStatusMessage(response.data.message);
                    setTimeout(() => {
                        Navigate('/showShippingCharge');
                    }, 900);
                } else {
                    setShippingChargeAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box');
                    alertBox.classList.add('alert-wrapper');
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                console.log(error)
                setShippingChargeAddStatus("error");
                let alertBox = document.getElementById('alert-box');
                alertBox.classList.add('alert-wrapper');
                setStatusMessage("Shipping charges not Add !");
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShippingChargeAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById('alert-box')
            alertBox?.classList?.remove('alert-wrapper')
        }, 1500);

        return () => clearTimeout(timer);
    }, [shippingChargeAddStatus, statusMessage]);

    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Edit Shipping Charges</h4>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3 row">
                                                <label className="col-md-2 col-form-label">Type :</label>
                                                <div className="col-md-10">
                                                    {/* <select
                                                        required
                                                        className="form-select"
                                                        value={shippingChargeType}
                                                        onChange={(e) => setShippingChargeType(e.target.value)}
                                                    >
                                                        <option value="everywhere">Everywhere</option>
                                                        <option value="specific">Specific</option>
                                                    </select> */}
                                                    <input
                                                        readOnly
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={selectedCategoryData?.Type}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label className="col-md-2 col-form-label">User Type :</label>
                                                <div className="col-md-10">
                                                    {/* <select
                                                        required
                                                        className="form-select"
                                                        value={userType}
                                                        onChange={(e) => setUserType(e.target.value)}
                                                    >
                                                        <option value="0">User</option>
                                                        <option value="1">R1</option>
                                                        <option value="2">R2</option>
                                                        <option value="3">R3</option>
                                                        <option value="4">R4</option>
                                                    </select> */}
                                                    <input
                                                        readOnly
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={selectedCategoryData?.UserType}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label className="col-md-2 col-form-label">State :</label>
                                                <div className="col-md-10">
                                                    {/* <Select
                                                        className="select"
                                                        required
                                                        placeholder="Select State"
                                                        options={State?.getStatesOfCountry('IN')}
                                                        getOptionLabel={(options) => {
                                                            return options["name"];
                                                        }}
                                                        getOptionValue={(options) => {
                                                            return options["name"];
                                                        }}
                                                        value={selectedState}
                                                        onChange={(item) => {
                                                            setSelectedState(item);
                                                        }}
                                                    /> */}
                                                    <input
                                                        readOnly
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={selectedCategoryData?.state}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label className="col-md-2 col-form-label">Country :</label>
                                                <div className="col-md-10">
                                                    {/* <Select
                                                        className="select"
                                                        required
                                                        placeholder="Select City"
                                                        options={City.getCitiesOfState(
                                                            selectedState?.countryCode,
                                                            selectedState?.isoCode
                                                        )}
                                                        getOptionLabel={(options) => {
                                                            return options["name"];
                                                        }}
                                                        getOptionValue={(options) => {
                                                            return options["name"];
                                                        }}
                                                        value={selectedCity}
                                                        onChange={(item) => {
                                                            setSelectedCity(item);
                                                        }}
                                                    /> */}
                                                    <input
                                                        readOnly
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={selectedCategoryData?.city}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row" >
                                                <label className="col-md-2 col-form-label">{`Weight Charge :`}</label>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 0-1 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w0}
                                                        onChange={(e) => setw0(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 1-2 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w1}
                                                        onChange={(e) => setw1(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 2-3 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w2}
                                                        onChange={(e) => setw2(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 3-4 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w3}
                                                        onChange={(e) => setw3(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 4-5 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w4}
                                                        onChange={(e) => setw4(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 5-6 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w5}
                                                        onChange={(e) => setw5(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 6-7 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w6}
                                                        onChange={(e) => setw6(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 7-8 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w7}
                                                        onChange={(e) => setw7(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 8-9 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w8}
                                                        onChange={(e) => setw8(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 9-10 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w9}
                                                        onChange={(e) => setw9(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 10-11 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w10}
                                                        onChange={(e) => setw10(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 11-12 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w11}
                                                        onChange={(e) => setw11(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 12-13 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w12}
                                                        onChange={(e) => setw12(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 13-14 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w13}
                                                        onChange={(e) => setw13(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 14-15 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w14}
                                                        onChange={(e) => setw14(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 15-16 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w15}
                                                        onChange={(e) => setw15(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 16-17 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w16}
                                                        onChange={(e) => setw16(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 17-18 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w17}
                                                        onChange={(e) => setw17(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 18-19 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w18}
                                                        onChange={(e) => setw18(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 19-20 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w19}
                                                        onChange={(e) => setw19(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight above 20 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w20}
                                                        onChange={(e) => setw20(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a className="btn btn-danger" onClick={() => Navigate('/showShippingCharge')}>
                                                            <i className="fas fa-window-close"></i> Cancel
                                                        </a>
                                                        <button className="btn btn-success" type="submit">
                                                            <i className="fas fa-save"></i> Save
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
                <AlertBox status={shippingChargeAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default EditShippingCharge;
