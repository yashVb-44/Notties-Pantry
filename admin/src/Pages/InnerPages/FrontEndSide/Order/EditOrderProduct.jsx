import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
let url = process.env.REACT_APP_API_URL

const EditOrderProduct = ({ handleCloseModal, selectedOrderProductData, selectOrderId }) => {
    const orderPorductId = selectedOrderProductData?._id
    const adminToken = localStorage.getItem('token');

    const Navigate = useNavigate()

    const [quantity, setQuantity] = useState(selectedOrderProductData?.quantity || 1);
    const [price, setPrice] = useState(selectedOrderProductData?.discountPrice || 1);
    const [totalPrice, setTotalPrice] = useState(quantity * price)
    const [weight, setWeight] = useState(selectedOrderProductData?.old_weight || 0)
    const [totalWeight, setTotalWeight] = useState(quantity * weight)

    useEffect(() => {
        setTotalPrice(quantity * price)
        setTotalWeight(quantity * weight)
    }, [quantity, price])

    const handleUpdateSize = async (e) => {
        e.preventDefault();

        try {
            // Send the updated order product data to the server
            const response = await axios.patch(
                `${url}/order/product/modify/${selectOrderId}`,
                {
                    quantity: quantity,
                    price: price,
                    orderPorductId: orderPorductId,
                    totalWeight: totalWeight
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
                                            <h4 className="mb-0">Edit Order Product</h4>
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
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        id="example-number-input"
                                                        value={selectedOrderProductData?.product?.Product_Name}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                    Color Name :
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        id="example-number-input"
                                                        value={selectedOrderProductData?.variation?.Variation_Name}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                    Size Name :
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        id="example-number-input"
                                                        value={selectedOrderProductData?.sizeName}
                                                        readOnly
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
                                                        placeholder='Add Stock'
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
                                                        placeholder='Add Stock'
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

export default EditOrderProduct;
