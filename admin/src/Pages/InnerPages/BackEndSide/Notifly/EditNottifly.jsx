import React, { useRef, useState } from "react";
import defualtImage from "../../../../resources/assets/images/add-image.png";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlertBox from "../../../../Components/AlertComp/AlertBox"
import ReactQuill from "react-quill";
import Select from "react-select";
import { useSelector } from "react-redux";

let url = process.env.REACT_APP_API_URL

const EditNottifly = () => {

    const adminToken = localStorage.getItem('token');
    const selectedNottiflyData = useSelector((state) => state?.NottiflyDataChange?.payload);

    console.log(selectedNottiflyData, "data")

    const Navigate = useNavigate()
    const [fileUrl, setFileUrl] = useState(selectedNottiflyData?.fileType === "image" ? "" : selectedNottiflyData?.fileUrl)
    const [desc, setdesc] = useState(selectedNottiflyData?.desc)
    const [productData, setProductData] = useState([])
    const [SelectedProduct, setSelectedProduct] = useState(selectedNottiflyData?.productName)
    const [fileType, setFileType] = useState(selectedNottiflyData?.fileType)
    const [previewImage, setPreviewImage] = useState();
    const [nottiflyAddStatus, setNottiflyAddStatus] = useState();
    const [statusMessage, setStatusMessage] = useState("");

    // get all product
    useEffect(() => {
        async function getProduct() {
            try {
                const res = await axios.get(`${url}/product/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    })
                setProductData(res?.data?.product || [])
            } catch (error) {
                console.log(error)
            }
        }
        getProduct()
    }, [productData])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (fileType !== "") {
            const formData = new FormData();
            // formData.append("nottiflyTitle", nottiflyTitle);
            if (fileType === "image") {
                formData.append("image", fileUrl);
            } else {
                formData.append("fileUrl", fileUrl);
            }
            formData.append("desc", desc);
            formData.append("fileType", fileType);
            formData.append("product", SelectedProduct?.productId || "");

            try {
                const adminToken = localStorage.getItem('token');
                let response = await axios.patch(
                    `${url}/nottifly/update/${selectedNottiflyData?._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                if (response.data.type === "success") {
                    setNottiflyAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box')
                    alertBox.classList.add('alert-wrapper')
                    setStatusMessage(response.data.message);
                    setTimeout(() => {
                        Navigate('/showNottifly');
                    }, 900);
                } else {
                    setNottiflyAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box')
                    alertBox.classList.add('alert-wrapper')
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setNottiflyAddStatus("error");
                let alertBox = document.getElementById('alert-box')
                alertBox.classList.add('alert-wrapper')
                setStatusMessage("Nottifly not Update !");
            }
        }
    };

    // options for select product
    const options = productData?.map((option, index) => ({
        productId: option?._id,
        label: option?.Product_Name?.charAt(0)?.toUpperCase() + option?.Product_Name?.slice(1),
    }));

    useEffect(() => {
        const timer = setTimeout(() => {
            setNottiflyAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById('alert-box')
            alertBox?.classList?.remove('alert-wrapper')
        }, 1500);

        return () => clearTimeout(timer);
    }, [nottiflyAddStatus, statusMessage]);

    //  for react quill (long desc)
    const editor = useRef();

    const handleTextChange = (value) => {
        setdesc(value);
    };


    const tableOptions = [];
    const maxRows = 8;
    const maxCols = 5;
    for (let r = 1; r <= maxRows; r++) {
        for (let c = 1; c <= maxCols; c++) {
            tableOptions.push('newtable_' + r + '_' + c);
        }
    }

    const editorModules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'video', 'image'],
            ['clean'],
            ['code-block'],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }, { table: tableOptions }],
        ],
    };

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
                                    <h4 className="mb-0">Add Nottifly</h4>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3 row">
                                                <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                    User Type:
                                                </label>
                                                <div className="col-md-10">
                                                    <select
                                                        required
                                                        className="form-select"
                                                        id="user-select"
                                                        value={fileType}
                                                        onChange={(e) => {
                                                            setFileType(e.target.value)
                                                        }}
                                                    >
                                                        <option value="image">Image</option>
                                                        <option value="video">Video</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Product Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <Select
                                                        value={SelectedProduct}
                                                        defaultInputValue={selectedNottiflyData?.productName}
                                                        defaultValue={selectedNottiflyData?.productName}
                                                        onChange={(e) => {
                                                            setSelectedProduct(e);
                                                        }}
                                                        options={options}
                                                        styles={customStyles}
                                                    />
                                                </div>
                                            </div>
                                            {fileType === "image" ?
                                                <div className="mb-3 row">
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Nottifly Image:
                                                        <div className="imageSize">(Recommended Resolution: W-1000 x H-1000 or Square Image)</div>
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="file"
                                                            onChange={(e) => {
                                                                setFileUrl(e.target.files[0]);
                                                                setPreviewImage(
                                                                    URL.createObjectURL(
                                                                        e.target.files[0]
                                                                    )
                                                                );
                                                            }}
                                                            id="example-text-input"
                                                        />
                                                        <div className="fileupload_img col-md-10 mt-3">
                                                            <img
                                                                type="image"
                                                                src={
                                                                    previewImage ||
                                                                    selectedNottiflyData?.fileUrl
                                                                }
                                                                alt="Nottifly image"
                                                                height={100}
                                                                width={100}
                                                            />
                                                        </div>
                                                    </div>
                                                </div> :
                                                <div className="mb-3 row">
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Nottifly Video:
                                                    </label>
                                                    <div className="col-md-10">
                                                        <input
                                                            required
                                                            className="form-control"
                                                            type="text"
                                                            onChange={(e) => {
                                                                setFileUrl(e.target.value)
                                                            }}
                                                            value={fileUrl}
                                                            id="example-text-input"
                                                        />
                                                    </div>
                                                </div>
                                            }
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Description:
                                                </label>
                                                <div className="col-md-10">
                                                    <ReactQuill
                                                        ref={editor}
                                                        value={desc}
                                                        onChange={handleTextChange}
                                                        modules={editorModules}
                                                        className="custom-quill-editor"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a className="btn btn-danger" onClick={() => Navigate('/showNottifly')}>
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
                <AlertBox status={nottiflyAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default EditNottifly;
