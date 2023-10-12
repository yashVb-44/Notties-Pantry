import React, { useState } from "react";
import defualtImage from "../../../../resources/assets/images/add-image.png";
import axios from "axios";

let url = process.env.REACT_APP_API_URL

const AddVariationByTable = ({ handleCloseModal, variations, setVariations, productId }) => {
    const adminToken = localStorage.getItem('token');
    const color = [
        "Red", "Yellow", "Blue", "Black", "Orange", "White", "Purple", "Pink",
        "Brown", "Maroon", "Magenta", "Gold", "Mustard", "Lemon", "Beige", "Silver",
        "Cream", "Green", "Gray", "Navy Blue", "Violet", "Indigo", "Lime", "Olive",
        "Aqua", "Turquoise"
    ]

    const [variationName, setVariationName] = useState("");
    const [variationImages, setVariationImages] = useState([]);
    const [sizeInputs, setSizeInputs] = useState([
        {
            index: 1, size: "", stock: 0, disc_pirce: 0, r1_quan: 0, r2_quan: 0, r3_quan: 0, r4_quan: 0,
            user_price: 0, r1_price: 0, r2_price: 0, r3_price: 0, r4_price: 0,
        }
    ]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setVariationImages(files);
        setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    };

    const handleAddSizeInput = () => {
        const newSizeInput = {
            index: sizeInputs.length + 1,
            size: "",
            stock: 0,
            disc_pirce: 0,
            r1_quan: 0,
            r2_quan: 0,
            r3_quan: 0,
            r4_quan: 0,
            user_price: 0,
            r1_price: 0,
            r2_price: 0,
            r3_price: 0,
            r4_price: 0,
        };
        setSizeInputs([...sizeInputs, newSizeInput]);
    };

    const handleRemoveSizeInput = (index) => {
        const updatedSizeInputs = sizeInputs.filter((sizeInput) => sizeInput.index !== index);
        setSizeInputs(updatedSizeInputs.map((sizeInput, i) => ({ ...sizeInput, index: i + 1 })));
    };

    const handleAddVariation = async (e) => {
        e.preventDefault();
        setLoading(true)
        setButtonDisabled(true)

        const formData = new FormData();
        formData.append("Variation_Name", variationName);
        sizeInputs.forEach((size) => {
            formData.append("Size_Name", size.size);
            formData.append("Size_Stock", size.stock);
            formData.append('Disc_Price', size?.disc_pirce);
            formData.append('R0_Price', size?.user_price);
            formData.append('R1_Price', size?.r1_price);
            formData.append('R2_Price', size?.r2_price);
            formData.append('R3_Price', size?.r3_price);
            formData.append('R4_Price', size?.r4_price);
            formData.append('R1_Min_Quantity', size?.r1_quan);
            formData.append('R2_Min_Quantity', size?.r2_quan);
            formData.append('R3_Min_Quantity', size?.r3_quan);
            formData.append('R4_Min_Quantity', size?.r4_quan);
        });
        variationImages.forEach((image) => {
            formData.append("images", image);
        });

        try {
            const response = await axios.post(`${url}/product/variation/add/${productId}`, formData,
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                });
            if (response.data.type === "success") {
                setVariations([...variations, response.data.variation]);
                setVariationName("");
                setVariationImages([]);
                setSizeInputs([{
                    index: 1, size: "", stock: 0, disc_pirce: 0, r1_quan: 0, r2_quan: 0, r3_quan: 0, r4_quan: 0,
                    user_price: 0, r1_price: 0, r2_price: 0, r3_price: 0, r4_price: 0,
                }]);
                handleCloseModal();
            } else {
                console.error("Failed to add variation:", response.data.message);
            }
        } catch (error) {
            console.error("Failed to add variation:", error);
        } finally {
            setLoading(false)
            setButtonDisabled(false)
        }
    };

    return (
        <div className="main-content-model dark">
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card model-card">
                                <div className="card-body">
                                    <div className="page-title-box d-flex align-items-center justify-content-between">
                                        <h4 className="mb-0">Add Variation</h4>
                                        {loading && <div className="loader">Loading...</div>}
                                        <i
                                            className="fas fa-window-close"
                                            style={{ cursor: "pointer", color: "red" }}
                                            onClick={handleCloseModal}
                                        ></i>
                                    </div>
                                    <form onSubmit={handleAddVariation}>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Color Name:
                                            </label>
                                            <div className="col-md-10">
                                                <select
                                                    required
                                                    className="form-select"
                                                    id="subcategory-select"
                                                    value={variationName}
                                                    onChange={(e) => {
                                                        setVariationName(e.target.value)
                                                    }}
                                                >
                                                    <option value="">Select Color</option>
                                                    {color?.map(color => {
                                                        return (
                                                            <option value={color}>{color}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Color Images:
                                                <div className="imageSize">(Recommended Resolution:
                                                    W-971 X H-1500,
                                                    W-1295 X H-2000,
                                                    W-1618 X H-2500 )</div>
                                            </label>
                                            <div className="col-md-10">
                                                <div className="fileupload_block">
                                                    <input
                                                        type="file"
                                                        max={5}
                                                        name="banner_image"
                                                        className="form-control"
                                                        multiple
                                                        onChange={handleFileSelect}
                                                        id="example-text-input"
                                                        required
                                                    />
                                                </div>
                                                <div className="fileupload_img col-md-10 mt-3">
                                                    {imagePreviews.length <= 0 && (
                                                        <img
                                                            type="image"
                                                            src={defualtImage}
                                                            alt="product image"
                                                            height={100}
                                                            width={100}
                                                        />
                                                    )}
                                                    {imagePreviews?.map((preview, index) => (
                                                        <img
                                                            key={index}
                                                            src={preview}
                                                            alt="Preview"
                                                            style={{ marginTop: "15px", marginLeft: "15px" }}
                                                            height={100}
                                                            width={100}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {sizeInputs.map((sizeInput, index) => (
                                            <div className="mb-3 row" key={sizeInput.index}>
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Size {sizeInput.index}:
                                                </label>
                                                <div className="col-md-3">
                                                    Size
                                                    <select
                                                        required
                                                        className="form-select"
                                                        id="subcategory-select"
                                                        value={sizeInput.size}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].size = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    >
                                                        <option value="">Select Size</option>
                                                        <option value="One Size ">One Size</option>
                                                        <option value="Unstitched Material">UNSTITCHED MATERIAL</option>
                                                        <option value="xs">xs</option>
                                                        <option value="s">s</option>
                                                        <option value="m">m</option>
                                                        <option value="l">l</option>
                                                        <option value="xl">xl</option>
                                                        <option value="xxl">xxl</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-3">
                                                    Stock
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.stock}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].stock = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-2">
                                                    Original Price
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.disc_pirce}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].disc_pirce = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div></div>

                                                <div className="col-md-2 mt-4">
                                                    Minimum Quantity
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    R1 Min_Quantity
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r1_quan}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r1_quan = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    R2 Min_Quantity
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r2_quan}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r2_quan = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    R3 Min_Quantity
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r3_quan}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r3_quan = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    R4 Min_Quantity
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r4_quan}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r4_quan = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div></div>

                                                <div className="col-md-2 mt-4">
                                                    Price
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    User Price
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.user_price}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].user_price = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    R1 Price
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r1_price}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r1_price = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    R2 Price
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r2_price}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r2_price = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    R3 Price
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r3_price}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r3_price = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-md-2 mt-2">
                                                    R4 Price
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={sizeInput.r4_price}
                                                        onChange={(e) => {
                                                            const updatedSizeInputs = [...sizeInputs];
                                                            updatedSizeInputs[index].r4_price = e.target.value;
                                                            setSizeInputs(updatedSizeInputs);
                                                        }}
                                                    />
                                                </div>

                                                {sizeInputs.length > 1 && (
                                                    <div className="col-md-1">
                                                        <i
                                                            className="fa fa-times mt-1"
                                                            style={{ fontSize: "34px", cursor: "pointer", color: "red" }}
                                                            onClick={() => handleRemoveSizeInput(sizeInput.index)}
                                                        ></i>
                                                    </div>
                                                )}
                                                {index === sizeInputs.length - 1 && (
                                                    <>
                                                        <div className="col-md-1">
                                                            <i
                                                                className="fa fa-plus mt-1"
                                                                style={{ fontSize: "32px", cursor: "pointer", color: "#5b73e8" }}
                                                                onClick={handleAddSizeInput}
                                                            ></i>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}

                                        <div className="d-flex flex-reverse flex-wrap gap-2">
                                            <a className="btn btn-danger" onClick={handleCloseModal}>
                                                <i className="fas fa-window-close"></i> Cancel{" "}
                                            </a>
                                            <button className="btn btn-success" type="submit" disabled={buttonDisabled}>
                                                <i className="fas fa-save"></i> Save{" "}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddVariationByTable;

