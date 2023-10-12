import React, { useRef, useState } from "react";
import defualtImage from "../../../../resources/assets/images/add-image.png";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddVariation from "../Variation/AddVariation";
import AlertBox from "../../../../Components/AlertComp/AlertBox";
import Modal from "react-modal";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from "react-select";

let url = process.env.REACT_APP_API_URL

const AddProduct = () => {

    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate();

    // product
    const [productName, setProductName] = useState("");
    const [SKUCode, setSKUCode] = useState("")
    const [productImage, setProductImage] = useState("");
    const [selectedCategories, setSelectedCategories] = useState("");
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState("");
    // const [originalPrice, setOriginalPrice] = useState(0)
    // const [goldPrice, setGoldPrice] = useState(0)
    const [weight, setWeight] = useState(0)
    const [dimenstion, setDimenstion] = useState("")
    const [youtubeVideo, setYoutubeVideo] = useState("")
    const [video, setVideo] = useState("")
    const [description, setDescription] = useState("");
    const [productAddStatus, setProductAddStatus] = useState();
    const [statusMessage, setStatusMessage] = useState("");

    // variation
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [variations, setVariations] = useState([]);

    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        Modal.setAppElement(document.body);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        setButtonDisabled(true)

        if (productName !== "" && productImage !== "") {
            if (variations.length <= 0) {
                setProductAddStatus("warning")
                setStatusMessage("Please Add atleast one variations")
            }
            else {
                const formData = new FormData();
                formData.append("Product_Name", productName);
                formData.append("SKU_Code", SKUCode);
                formData.append("image", productImage);
                formData.append("video", video);
                const selectedCategoryIds = selectedCategories?.value;
                formData.append("Category", selectedCategoryIds);
                const selectedSubCategoryIds = selectedSubCategories?.value;
                formData.append("Sub_Category", selectedSubCategoryIds);
                formData.append("Product_Weight", weight);
                formData.append("Product_Dimenstion", dimenstion);
                formData.append("Product_Youtube_Video", youtubeVideo);
                formData.append("Description", description);

                try {
                    let response = await axios.post(
                        `${url}/product/add`,
                        formData,
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        }
                    );
                    if (response.data.type === "success") {
                        setProductAddStatus(response.data.type);
                        let alertBox = document.getElementById("alert-box");
                        alertBox.classList.add("alert-wrapper");
                        setStatusMessage(response.data.message);

                        const productId = response?.data?.productId

                        try {
                            for (const variation of variations) {
                                const variationFormData = new FormData();
                                variationFormData.append('Variation_Name', variation?.name);
                                variation?.sizes?.forEach((size) => {
                                    variationFormData.append('Size_Name', size?.size);
                                    variationFormData.append('Size_Stock', size?.stock);
                                    variationFormData.append('Disc_Price', size?.disc_pirce);
                                    variationFormData.append('R0_Price', size?.user_price);
                                    variationFormData.append('R1_Price', size?.r1_price);
                                    variationFormData.append('R2_Price', size?.r2_price);
                                    variationFormData.append('R3_Price', size?.r3_price);
                                    variationFormData.append('R4_Price', size?.r4_price);
                                    variationFormData.append('R1_Min_Quantity', size?.r1_quan);
                                    variationFormData.append('R2_Min_Quantity', size?.r2_quan);
                                    variationFormData.append('R3_Min_Quantity', size?.r3_quan);
                                    variationFormData.append('R4_Min_Quantity', size?.r4_quan);
                                });
                                variation?.images?.forEach((image) => {
                                    variationFormData.append('images', image);
                                });

                                await axios.post(`${url}/product/variation/add/${productId}`, variationFormData,
                                    {
                                        headers: {
                                            Authorization: `${adminToken}`,
                                        },
                                    });
                                setVariations("")
                            }

                        } catch (error) {
                            console.log(error)
                        }
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
                    setStatusMessage("Product not Add !");
                }
                finally {
                    setLoading(false)
                    setButtonDisabled(false)
                }
            }
        }
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
                console.error('Failed to fetch categories:', error);
            }
        }

        fetchCategoryData();
        fetchSubCategoryData()
    }, [selectedCategories, selectedSubCategories]);

    const handleCategoryChange = (selectedOptions) => {
        setSelectedCategories(selectedOptions);
        setSelectedSubCategories("")
    };


    const handleSubCategoryChange = (selectedOptions) => {
        setSelectedSubCategories(selectedOptions);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDeleteVariation = (index) => {
        const updatedVariations = [...variations];
        updatedVariations.splice(index, 1);
        setVariations(updatedVariations);
    };

    //  for react quill (long desc)
    const editor = useRef();

    const handleTextChange = (value) => {
        setDescription(value);
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
                                    <h4 className="mb-0">Add Product</h4>
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

                                            {/* <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Original Price:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={originalPrice}
                                                        onChange={(e) => {
                                                            setOriginalPrice(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div> */}

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Product Weight:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        min={0}
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
                                                        required
                                                        className="form-control"
                                                        type="file"
                                                        onChange={(e) => {
                                                            const selectedFile = e.target.files[0];
                                                            if (selectedFile && selectedFile.size > 10000000) {
                                                                alert('File size is too large. Maximum size allowed is 10MB.');
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                            setProductImage(selectedFile)
                                                        }}
                                                        id="example-text-input"
                                                    />
                                                    <div className="fileupload_img col-md-10 mt-3">
                                                        <img
                                                            type="image"
                                                            src={
                                                                productImage
                                                                    ? URL.createObjectURL(productImage)
                                                                    : defualtImage
                                                            }
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
                                                        required
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
                                                    <div className="fileupload_img col-md-10 mt-3">
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
                                                            <img
                                                                src={defualtImage}
                                                                alt="product video"
                                                                height={100}
                                                                width={100}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3 mt-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Add Variation:
                                                </label>
                                                <div className="col-md-10">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a
                                                            className="btn btn-primary"
                                                            onClick={handleOpenModal}
                                                        >
                                                            {" "}
                                                            <i className="fas fa-plus-circle"></i> Add{" "}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <Modal
                                                className="main-content dark"
                                                isOpen={isModalOpen}
                                                onRequestClose={handleCloseModal}
                                            >
                                                <AddVariation />
                                            </Modal>

                                            {!variations.length <= 0 &&
                                                <div className="mb-3 row">
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        Variation :
                                                    </label>
                                                    <table>
                                                        <tr>
                                                            <th>No.</th>
                                                            <th>Name</th>
                                                            <th>Size</th>
                                                            <th>Stock</th>
                                                            {/* <th>Price</th> */}
                                                            <th>Action</th>
                                                        </tr>
                                                        {variations?.map((variation, index) => {
                                                            const defaultSize = variation?.sizes?.[0]?.size; // Get the first size as the default value

                                                            return (
                                                                <>
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{variation?.name}</td>
                                                                        <td>
                                                                            <select
                                                                                style={{ width: "50px" }}
                                                                                value={variation?.selectedSize || defaultSize}
                                                                                onChange={(e) => {
                                                                                    const selectedSize = e.target.value;
                                                                                    const updatedVariations = variations.map((v, i) => {
                                                                                        if (i === index) {
                                                                                            return {
                                                                                                ...v,
                                                                                                selectedSize: selectedSize,
                                                                                            };
                                                                                        }
                                                                                        return v;
                                                                                    });
                                                                                    setVariations(updatedVariations);
                                                                                }}
                                                                            >
                                                                                {variation?.sizes?.map((vari, sizeIndex) => {
                                                                                    return (
                                                                                        <option key={sizeIndex} value={vari?.size}>
                                                                                            {vari?.size}
                                                                                        </option>
                                                                                    );

                                                                                })}
                                                                            </select>
                                                                        </td>
                                                                        <td>
                                                                            {variation?.sizes?.map((vari) => {
                                                                                if (vari?.size === (variation?.selectedSize || defaultSize)) {
                                                                                    return vari?.stock;
                                                                                }
                                                                                return null;
                                                                            })}
                                                                        </td>
                                                                        {/* <td>
                                                                            {variation?.sizes?.map((vari) => {
                                                                                if (vari?.size === (variation?.selectedSize || defaultSize)) {
                                                                                    return vari?.disc_pirce;
                                                                                }
                                                                                return null;
                                                                            })}
                                                                        </td> */}
                                                                        <td>
                                                                            <i class="fa fa-trash"
                                                                                onClick={() => handleDeleteVariation(index)}
                                                                                aria-hidden="true"
                                                                                style={{ color: "red", cursor: "pointer" }}
                                                                            ></i>
                                                                        </td>
                                                                    </tr>
                                                                </>
                                                            );
                                                        })}
                                                    </table>
                                                </div>
                                            }

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
                                                    <AlertBox status={productAddStatus} statusMessage={statusMessage} />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
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
                    <AddVariation
                        variations={variations}
                        setVariations={setVariations}
                        handleCloseModal={handleCloseModal}
                    />
                </Modal>
            </div>
        </>
    );
};

export default AddProduct;