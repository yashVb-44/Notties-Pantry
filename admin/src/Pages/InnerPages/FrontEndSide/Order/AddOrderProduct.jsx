import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";

let url = process.env.REACT_APP_API_URL

const AddOrderProduct = ({ handleCloseModal, selectedOrderProductData, selectedOrderData, selectOrderId }) => {
    const orderPorductId = selectedOrderProductData?._id
    const adminToken = localStorage.getItem('token');

    const userId = selectedOrderData?.userId

    const Navigate = useNavigate()

    const [productOptions, setProductOptions] = useState([])
    const [variationOptions, setVariationOptions] = useState([])
    const [variationSizeOptions, setVariationSizeOptions] = useState([])
    const [selectedProduct, setSelectedProduct] = useState("")
    const [selectedVariation, setSelectedVariation] = useState("")
    const [selectedSize, setSelectedSize] = useState("")

    const [quantity, setQuantity] = useState(1);
    const [oriPrice, setOriPrice] = useState(1)
    const [price, setPrice] = useState(1);
    const [totalPrice, setTotalPrice] = useState(quantity * price)
    const [weight, setWeight] = useState(0)
    const [totalWeight, setTotalWeight] = useState(quantity * weight)

    useEffect(() => {
        setTotalPrice(quantity * price)
        setTotalWeight(quantity * weight)
    }, [quantity, price])

    const handleUpdateSize = async (e) => {
        e.preventDefault();

        try {
            // Send the updated order product data to the server
            const response = await axios.post(
                `${url}/order/modify/product/add/${selectOrderId}`,
                {
                    userId,
                    product: selectedProduct?.value,
                    variation: selectedVariation?.value,
                    sizeName: selectedSize?.value,
                    quantity: quantity,
                    discountPrices: price,
                    originalPrices: oriPrice,
                    old_weight: weight,
                    total_weight: totalWeight
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            if (response?.data?.type === 'success') {
                // handleOrderProductUpdate(selectedOrderProductData?._id, { Size_Name: quantity, Size_Stock: price });
                handleCloseModal();
            } else {
                console.log('Error updating quantity:', response?.data?.message);
            }
        } catch (error) {
            console.log('Error updating quantity:', error);
        }
    };

    useEffect(() => {
        // Fetch category data from your API
        async function fetchProductData() {
            try {
                const response = await axios.get(`${url}/product/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });

                const options = response?.data?.product_data?.map((option) => ({
                    value: option._id,
                    label: option.Product_Name.charAt(0).toUpperCase() + option.Product_Name.slice(1),
                    Product_Weight: option?.Product_Weight
                }));
                setProductOptions(options);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        }

        // Fetch variation data from your API
        async function fetchVariationData() {
            try {
                const response = await axios.get(`${url}/product/variation/get/byProductId/${selectedProduct?.value}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });

                const options = response?.data?.variations?.map((option) => ({
                    value: option._id,
                    label: option.Variation_Name.charAt(0).toUpperCase() + option.Variation_Name.slice(1),
                }));
                setVariationOptions(options);
            } catch (error) {
                console.error('Failed to fetch variations:', error);
            }
        }

        // Fetch variation size data from your API
        async function fetchVariationSizeData() {
            try {
                const response = await axios.get(`${url}/product/variation/get/sizes/byVariationId/${selectedVariation?.value}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });

                const options = response?.data?.variationSize?.map((option) => ({
                    value: option.Size_Name,
                    label: option.Size_Name.charAt(0).toUpperCase() + option.Size_Name.slice(1),
                    price: option.R0_Price,
                    oriPrice: option.Disc_Price
                }));
                setVariationSizeOptions(options);
            } catch (error) {
                console.error('Failed to fetch variation Size:', error);
            }
        }

        fetchProductData();
        fetchVariationData()
        fetchVariationSizeData()
    }, [selectedProduct, selectedVariation]);

    const handleProductChange = (selectedOptions) => {
        setSelectedProduct(selectedOptions);
        setWeight(selectedOptions?.Product_Weight)
        setSelectedVariation("")
        setSelectedSize("")
    };

    const handleProductVariationChange = (selectedOptions) => {
        setSelectedVariation(selectedOptions);
        setSelectedSize("")
    };

    const handleProductVariationSizeChange = (selectedOptions) => {
        setPrice(selectedOptions?.price)
        setOriPrice(selectedOptions?.oriPrice)
        setSelectedSize(selectedOptions);
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
                                            <h4 className="mb-0">Add Order Items</h4>
                                            <i
                                                className="fas fa-window-close"
                                                style={{ cursor: "pointer", color: "red" }}
                                                onClick={handleCloseModal}
                                            ></i>
                                        </div>
                                        <form onSubmit={handleUpdateSize}>
                                            <div className="mb-3 row">
                                                <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                    Product Name :
                                                </label>
                                                <div className="col-md-10">
                                                    <Select
                                                        required
                                                        value={selectedProduct}
                                                        onChange={handleProductChange}
                                                        options={productOptions}
                                                        placeholder="Select Product"
                                                        className="w-full md:w-20rem"
                                                    // styles={customStyles}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                    Color Name :
                                                </label>
                                                <div className="col-md-10">
                                                    <Select
                                                        required
                                                        value={selectedVariation}
                                                        onChange={handleProductVariationChange}
                                                        options={variationOptions}
                                                        placeholder="Select Product Color"
                                                        className="w-full md:w-20rem"
                                                    // styles={customStyles}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                    Size Name :
                                                </label>
                                                <div className="col-md-10">
                                                    <Select
                                                        required
                                                        value={selectedSize}
                                                        onChange={handleProductVariationSizeChange}
                                                        options={variationSizeOptions}
                                                        placeholder="Select Product Color"
                                                        className="w-full md:w-20rem"
                                                    // styles={customStyles}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                    Quantity :
                                                </label>
                                                <div className="col-md-3">
                                                    <input
                                                        min={1}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={quantity}
                                                        placeholder='Add Quantity'
                                                        onChange={(e) => setQuantity(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                    Price :
                                                </label>
                                                <div className="col-md-3">
                                                    <input
                                                        min={1}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={price}
                                                        placeholder='Add Price'
                                                        onChange={(e) => setPrice(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                    Total Price :
                                                </label>
                                                <div className="col-md-3">
                                                    <input
                                                        min={1}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={totalPrice}
                                                        placeholder='Add Stock'
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                    Product Weight :
                                                </label>
                                                <div className="col-md-3">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={weight}
                                                        placeholder='Add Stock'
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                    Total Weight :
                                                </label>
                                                <div className="col-md-3">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={totalWeight}
                                                        placeholder='Add Stock'
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <div className="col-md-10 offset-md-2">
                                                    <div className="row mb-10">
                                                        <div className="col ms-auto">
                                                            <div className="d-flex flex-reverse flex-wrap gap-2">
                                                                <a
                                                                    className="btn btn-danger"
                                                                    onClick={handleCloseModal}
                                                                >
                                                                    {" "}
                                                                    <i className="fas fa-window-close"></i> Cancel{" "}
                                                                </a>
                                                                <button
                                                                    className="btn btn-success"
                                                                    type="submit"
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
            </div>

        </>
    );
};

export default AddOrderProduct;
