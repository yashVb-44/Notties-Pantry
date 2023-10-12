import React, { useState } from "react";
import defualtImage from "../../../../resources/assets/images/add-image.png";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlertBox from "../../../../Components/AlertComp/AlertBox"
import Select from "react-select";


let url = process.env.REACT_APP_API_URL

const AddSubCategory = () => {

    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate()

    const [subCategoryName, setSubCategoryName] = useState("");
    const [subCategoryAddStatus, setSubCategoryAddStatus] = useState();
    const [statusMessage, setStatusMessage] = useState("");
    const [selectedCategories, setSelectedCategories] = useState("");
    const [categoryOptions, setCategoryOptions] = useState([]);

    useEffect(() => {
        // Fetch category data from your API
        async function fetchCategoryData() {
            try {
                const response = await axios.get(`${url}/category/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                const options = response?.data?.active_category_data?.map((option) => ({
                    value: option._id,
                    label: option.categoryName.charAt(0).toUpperCase() + option.categoryName.slice(1),
                }));
                setCategoryOptions(options);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        }
        fetchCategoryData();
    }, []);

    const handleCategoryChange = (selectedOptions) => {
        setSelectedCategories(selectedOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (subCategoryName !== "") {
            const formData = {
                subCategoryName: subCategoryName,
                category: selectedCategories?.value
            }

            try {
                const adminToken = localStorage.getItem('token');
                let response = await axios.post(
                    `${url}/sub_category/add`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                if (response.data.type === "success") {
                    setSubCategoryAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box')
                    alertBox.classList.add('alert-wrapper')
                    setStatusMessage(response.data.message);
                    setSubCategoryName("");
                    setTimeout(() => {
                        Navigate('/showSubCategory');
                    }, 900);
                } else {
                    setSubCategoryAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box')
                    alertBox.classList.add('alert-wrapper')
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setSubCategoryAddStatus("error");
                let alertBox = document.getElementById('alert-box')
                alertBox.classList.add('alert-wrapper')
                setStatusMessage("SubCategory not Add !");
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setSubCategoryAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById('alert-box')
            alertBox?.classList?.remove('alert-wrapper')
        }, 1500);

        return () => clearTimeout(timer);
    }, [subCategoryAddStatus, statusMessage]);

    const customStyles = {
        singleValue: (provided) => ({
            ...provided,
            color: 'black',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? 'white' : 'white',
            color: state.isSelected ? 'black' : 'black',
            ':hover': {
                backgroundColor: '#e6f7ff',
            },
        }),
    };


    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Add SubCategory</h4>
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
                                                    SubCategory Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={subCategoryName}
                                                        onChange={(e) => {
                                                            setSubCategoryName(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Category Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <Select
                                                        value={selectedCategories}
                                                        onChange={handleCategoryChange}
                                                        options={categoryOptions}
                                                        placeholder="Select Categories"
                                                        className="w-full md:w-20rem"
                                                        maxMenuHeight={150}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a className="btn btn-danger" onClick={() => Navigate('/showSubCategory')}>
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
                <AlertBox status={subCategoryAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default AddSubCategory;
