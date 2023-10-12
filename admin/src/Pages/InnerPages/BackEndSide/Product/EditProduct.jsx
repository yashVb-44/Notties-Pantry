import React, { useRef, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from "react-select";
import quillTable from 'quill-table';
import { useSelector } from "react-redux";
import AlertBox from "../../../../Components/AlertComp/AlertBox";

let url = process.env.REACT_APP_API_URL

const EditProduct = () => {

    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate()
    const selectedProductData = useSelector((state) => state?.ProductDataChange?.payload)
    const [productData, setProductData] = useState({})
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        async function getProduct() {
            try {
                const res = await axios.get(`${url}/product/get/${selectedProductData?._id}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setProductData(res?.data?.products || {});
            } catch (error) {
                console.log(error)
            }
        }
        getProduct();
    }, [selectedProductData]);


    useEffect(() => {
        setProductName(productData?.Product_Name);
        setSKUCode(productData?.SKU_Code);
        setDescription(productData?.Description || "");

        const selectedCategoriesIds = {
            value: productData?.Category?._id,
            label: productData?.Category?.categoryName
        };
        setSelectedCategories(selectedCategoriesIds);

        const selectedSubCategoriesIds = {
            value: productData?.Sub_Category?._id,
            label: productData?.Sub_Category?.subCategoryName
        };
        setSelectedSubCategories(selectedSubCategoriesIds);

        setPreviewImage(productData?.Product_Image)
        setPreviewVideo(productData?.Product_Video)
        setYoutubeVideo(productData?.Product_Youtube_Video)
        setWeight(productData?.Product_Weight)
        setDimenstion(productData?.Product_Dimenstion)
        setProductFeatureList(productData?.Features)
    }, [productData])

    const [productName, setProductName] = useState("");
    const [SKUCode, setSKUCode] = useState("")
    const [productImage, setProductImage] = useState();
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState("");
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState("");
    const [description, setDescription] = useState("");
    const [productAddStatus, setProductAddStatus] = useState();
    const [statusMessage, setStatusMessage] = useState("");
    const [previewImage, setPreviewImage] = useState(productData?.Product_Image)
    const [previewVideo, setPreviewVideo] = useState(productData?.Product_Video)
    const [weight, setWeight] = useState(0)
    const [dimenstion, setDimenstion] = useState("")
    const [youtubeVideo, setYoutubeVideo] = useState("")
    const [video, setVideo] = useState("")
    const [productFeatureList, setProductFeatureList] = useState("")
    const [homeFeatures, setHomeFeatures] = useState([])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonDisabled(true)
        setLoading(true)

        if (productName !== "") {

            const formData = new FormData();
            formData.append("Product_Name", productName);
            formData.append("SKU_Code", SKUCode);
            formData.append("image", productImage || "");
            const selectedCategoryIds = selectedCategories?.value;
            formData.append("Category", selectedCategoryIds);
            const selectedSubCategoryIds = selectedSubCategories?.value;
            formData.append("Sub_Category", selectedSubCategoryIds);
            formData.append("Description", description);
            formData.append("video", video || "");
            formData.append("Product_Weight", weight);
            formData.append("Product_Dimenstion", dimenstion);
            formData.append("Product_Youtube_Video", youtubeVideo);
            formData.append("Features", productFeatureList);

            try {
                let response = await axios.patch(
                    `${url}/product/update/${selectedProductData?._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                console.log(response)
                if (response.data.type === "success") {
                    setProductAddStatus(response.data.type);

                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);

                    //  for create variations
                    setTimeout(() => {
                        Navigate("/showProduct");
                    }, 900);

                } else {
                    setProductAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setProductAddStatus("error");
                let alertBox = document.getElementById("alert-box");
                alertBox.classList.add("alert-wrapper");
                setStatusMessage("Product not Update !");
            } finally {
                setButtonDisabled(false)
                setLoading(false)
            }

        }
    };

    const handleCategoryChange = (selectedOptions) => {
        setSelectedCategories(selectedOptions);
        setSelectedSubCategories("")
    };

    const handleSubCategoryChange = (selectedOptions) => {
        setSelectedSubCategories(selectedOptions);
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            setProductAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById("alert-box");
            alertBox?.classList?.remove("alert-wrapper");
        }, 1500);

        return () => clearTimeout(timer);
    }, [productAddStatus, statusMessage]);

    // get all category
    useEffect(() => {
        async function fetchCategoryData() {
            try {
                const categoryResponse = await axios.get(
                    `${url}/category/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                const options = categoryResponse?.data?.active_category_data?.map((option) => ({
                    value: option._id,
                    label: option.categoryName.charAt(0).toUpperCase() + option.categoryName.slice(1),
                }));
                setCategoryOptions(options);

            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        }

        // Fetch sub-category data from your API
        async function fetchSubCategoryData() {
            try {
                const response = await axios.get(`${url}/sub_category/get/all/categoryWise/${selectedCategories?.value}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });

                const options = response?.data?.active_sub_category_data?.map((option) => ({
                    value: option._id,
                    label: option.subCategoryName.charAt(0).toUpperCase() + option.subCategoryName.slice(1),
                }));
                setSubCategoryOptions(options);
            } catch (error) {
                console.error('Failed to fetch Subcategories:', error);
            }
        }


        fetchCategoryData();
        fetchSubCategoryData()
    }, [selectedCategories]);


    useEffect(() => {
        // Fetch Home Features data from your API
        async function fetchHomeFeaturesData() {
            try {
                const response = await axios.get(`${url}/homeFeatures/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setHomeFeatures(response?.data?.enablehomeFeatures)
            } catch (error) {
                console.error('Failed to fetch Home Features:', error);
            }
        }

        fetchHomeFeaturesData()
    }, [])



    //  for react quill (long desc)
    const editor = useRef();

    const handleTextChange = (value) => {
        setDescription(value);
    };


    Quill.register(quillTable.TableCell);
    Quill.register(quillTable.TableRow);
    Quill.register(quillTable.Table);
    Quill.register(quillTable.Contain);
    Quill.register('modules/table', quillTable.TableModule);

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


    // custom style for react quill
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
                                    <h4 className="mb-0">Edit Product</h4>
                                    {loading && <div className="loader">Loading...</div>}
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
                                                    Product Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={productName}
                                                        onChange={(e) => {
                                                            setProductName(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    SKU Code:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={SKUCode}
                                                        onChange={(e) => {
                                                            setSKUCode(e.target.value);
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
                                                        required
                                                        value={selectedCategories}
                                                        onChange={handleCategoryChange}
                                                        options={categoryOptions}
                                                        placeholder="Select Category"
                                                        className="w-full md:w-20rem"
                                                    // styles={customStyles}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Sub-Category Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <Select
                                                        required
                                                        value={selectedSubCategories}
                                                        onChange={handleSubCategoryChange}
                                                        options={subCategoryOptions}
                                                        placeholder="Select Sub-Category"
                                                        className="w-full md:w-20rem"
                                                    // styles={customStyles}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Product Weight:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-number-input"
                                                        value={weight}
                                                        onChange={(e) => {
                                                            setWeight(e.target.value);
                                                        }}
                                                        aria-label="Recipient's username" aria-describedby="basic-addon2"
                                                    />
                                                    <span style={{ color: "red", fontSize: "12px" }}>*This Value Provide in Kg</span>
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Product Dimenstion:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-number-input"
                                                        value={dimenstion}
                                                        onChange={(e) => {
                                                            setDimenstion(e.target.value);
                                                        }}
                                                        aria-label="Recipient's username" aria-describedby="basic-addon2"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Long Description:
                                                </label>
                                                <div className="col-md-10">
                                                    <ReactQuill
                                                        ref={editor}
                                                        value={description}
                                                        onChange={handleTextChange}
                                                        modules={editorModules}
                                                        className="custom-quill-editor"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Product You-Tube Video:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-number-input"
                                                        value={youtubeVideo}
                                                        onChange={(e) => {
                                                            setYoutubeVideo(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Product Image:
                                                    <div className="imageSize">(Recommended Resolution:
                                                        W-971 X H-1500,
                                                        W-1295 X H-2000,
                                                        W-1618 X H-2500 )</div>
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="file"
                                                        onChange={(e) => {
                                                            setProductImage(e.target.files[0]);
                                                        }}
                                                        id="example-text-input"
                                                    />
                                                    <div className="fileupload_img col-md-10 mt-3">
                                                        <img
                                                            type="image"
                                                            src={productImage ? URL.createObjectURL(productImage) : `${previewImage}`}
                                                            alt="product image"
                                                            height={100}
                                                            width={100}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Product Video:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="file"
                                                        accept="video/*"
                                                        onChange={(e) => {
                                                            const selectedFile = e.target.files[0];
                                                            if (selectedFile && selectedFile.size > 10000000) {
                                                                alert('File size is too large. Maximum size allowed is 10MB.');
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                            setVideo(selectedFile);
                                                        }}
                                                        id="example-text-input"

                                                    />
                                                    {/* <div className="fileupload_img col-md-10 mt-3">
                                                        {console.log(video, "this")}
                                                        {video ? (
                                                            <video
                                                                controls
                                                                width={200}
                                                                height={100}
                                                            >
                                                                <source src={URL.createObjectURL(video)} type="video/mp4" />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        ) : (
                                                            <video
                                                                controls
                                                                width={200}
                                                                height={100}
                                                            >
                                                                <source src={previewVideo} type="video/mp4" />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        )}

                                                    </div> */}
                                                    <div className="fileupload_img col-md-10 mt-3">
                                                        {video ? (
                                                            <video
                                                                controls
                                                                width={200}
                                                                height={100}
                                                                src={URL.createObjectURL(video)}
                                                            >
                                                                {/* <source src={URL.createObjectURL(video)} type="video/mp4" />
                                                                Your browser does not support the video tag. */}
                                                            </video>
                                                        ) : (
                                                            <video
                                                                controls
                                                                width={200}
                                                                height={100}
                                                                src={previewVideo}
                                                            >
                                                            </video>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Product Features List:
                                                </label>
                                                <div className="col-md-10">
                                                    <select name="o_type" id="o_type" style={{ width: "30%", height: "100%" }} className="select2" onChange={(e) => setProductFeatureList(e.target.value)} >
                                                        <option value={'None'}>{`None`}</option>
                                                        {homeFeatures?.map((feature, index) => {
                                                            if (productFeatureList === feature?.name) {
                                                                return <option key={index} value={feature?.name} selected>{feature?.name}</option>
                                                            }
                                                            else {
                                                                return <option key={index} value={feature?.name}>{feature?.name}</option>
                                                            }
                                                        })}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <div className="col-md-10 offset-md-2">
                                                    <div className="row mb-10">
                                                        <div className="col ms-auto">
                                                            <div className="d-flex flex-reverse flex-wrap gap-2">
                                                                <a
                                                                    className="btn btn-danger"
                                                                    onClick={() => Navigate("/showProduct")}
                                                                >
                                                                    {" "}
                                                                    <i className="fas fa-window-close"></i> Cancel{" "}
                                                                </a>
                                                                <button
                                                                    className="btn btn-success"
                                                                    type="submit"
                                                                    disabled={buttonDisabled}
                                                                >
                                                                    {" "}
                                                                    <i className="fas fa-save"></i> Save{" "}
                                                                </button>
                                                            </div>
                                                        </div>
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
                <AlertBox status={productAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    )
}

export default EditProduct
