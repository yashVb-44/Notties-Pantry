import React, { useEffect, useState } from 'react'
// import './ShowOrderDetails.css'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import IconButton from "@mui/material/IconButton";
import Modal from "react-modal";
import EditOrderProduct from './EditOrderProduct';
import AddOrderProduct from './AddOrderProduct';
import Swal from 'sweetalert2';

let url = process.env.REACT_APP_API_URL

const ShowOrderDetails = () => {

    const adminToken = localStorage.getItem('token');
    // this data provided by redux store
    const selectOrderId = useSelector((state) => state?.OrderDataChange?.payload)
    const Track_Id = useSelector((state) => state?.OrderDataChangeTrackiD?.payload)
    const navigate = useNavigate()
    const [orderDetails, setOrderDetails] = useState([])
    const [addressDetails, setAddressDetails] = useState([])
    const [productDetails, setProductDetails] = useState([])
    const [couponDetails, setCouponDetails] = useState([])
    const [trackId, setTrackId] = useState(Track_Id);
    const [orderType, setOrderType] = useState()
    const [selectedOrderProductData, setSelectedOrderProductData] = useState()
    const [selectedOrderData, setSelectedOrderData] = useState()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddOrderProductModelOpen, setIsAddOrderProductModelOpen] = useState(false)


    useEffect(() => {
        async function getOrderDetails() {
            try {
                let response = await axios.get(`${url}/order/get/single/${selectOrderId}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    })
                setOrderDetails(response?.data?.order)
                setAddressDetails(orderDetails.Address)
                setProductDetails(orderDetails?.cartData)
                setCouponDetails(orderDetails?.Coupon)

            } catch (error) {
                console.log(error)
            }
        }

        getOrderDetails()
    },)

    // for create orderType
    const createOrderType = ['Pending', 'Accepted', 'Rejected', 'Processing', 'Ready to Ship', 'Shipped', 'Completed', 'Cancelled', 'Returned']
    // for update orderType
    const handleUpdateOrderType = async () => {
        let response = await axios.patch(`${url}/order/update/type/${selectOrderId}`, {
            orderType: orderType,
            UserName: orderDetails?.User_Name,
            Track_id: trackId
        },
            {
                headers: {
                    Authorization: `${adminToken}`,
                },
            })
        if (response?.data?.type === 'success') {
            navigate('/showOrders')
        }
        else {
            console.log(`error`)
        }
    }

    const handleOrderProductAdd = (order) => {
        setSelectedOrderData(order)
        setIsAddOrderProductModelOpen(true);
    }

    const handleOrderProductUpdate = (product) => {
        setSelectedOrderProductData(product)
        setIsModalOpen(true);
    }

    const handleOrderProductDelete = async (product) => {
        setSelectedOrderProductData(product)

        const orderPorductId = selectedOrderProductData?._id

        try {
            // Send the updated order product data to the server
            // const response = await axios.delete(
            //     `${url}/order/modify/product/delete/${selectOrderId}/${orderPorductId}`,
            //     {
            //         headers: {
            //             Authorization: `${adminToken}`,
            //         },
            //     }
            // );

            // if (response?.data?.type === 'success') {
            //     // handleOrderProductUpdate(selectedOrderProductData?._id, { Size_Name: quantity, Size_Stock: price });
            // } else {
            //     console.log('Error delete orderProduct:', response?.data?.message);
            // }

            Swal.fire({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            }).then((result) => {
                if (result.isConfirmed) {
                    axios
                        .delete(
                            `${url}/order/modify/product/delete/${selectOrderId}/${orderPorductId}`,
                            {
                                headers: {
                                    Authorization: `${adminToken}`,
                                },
                            }
                        )
                        .then(() => {
                            Swal.fire("Success!", "Item has been deleted!", "success");
                        })
                        .catch((err) => {
                            console.log(err);
                            Swal.fire("Error!", "Item has not been deleted!", "error");
                        });
                }
            });

        } catch (error) {
            console.log('Error updating quantity:', error);
        }

    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseAddOrderProductModal = () => {
        setIsAddOrderProductModelOpen(false);
    };

    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className='row'>
                            <div className="col-2 table-heading">
                                Edit Orders
                            </div>
                            <div className="col-12 mt-2">
                                <div className="card">
                                    <div className="card-body">
                                        <form >
                                            <div className='mt-2' >
                                                <label htmlFor="example-text-input"
                                                    className="col-md-3" style={{ color: "#5b73e8", textDecoration: "underline" }}>
                                                    User Details :
                                                </label>
                                                <div className="mb-3 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        User Name :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={orderDetails?.User_Name} className="form-control" readOnly />
                                                    </div>
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Mobile Number :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="phone" id="phone" value={orderDetails?.User_Mobile_No} className="form-control" readOnly />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='mt-2' >
                                                <label htmlFor="example-text-input"
                                                    className="col-md-3" style={{ color: "#5b73e8", textDecoration: "underline" }}>
                                                    Delivery Details :
                                                </label>
                                                <div className="mb-3 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Type:-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={addressDetails?.Type} className="form-control" readOnly />
                                                    </div>
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        {addressDetails?.Type} no :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={addressDetails?.House} className="form-control" readOnly />
                                                    </div>
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Full Address:-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <textarea type="text" name="name" id="name" value={addressDetails?.Full_Address} className="form-control" readOnly />
                                                    </div>
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">

                                                    </label>
                                                    <div className="col-md-4 mt-1">
                                                        <input type="text" name="name" id="name" value={addressDetails?.City} className="form-control" readOnly />
                                                    </div>
                                                    <div className="col-md-3 mt-1">
                                                        <input type="text" name="name" id="name" value={addressDetails?.State} className="form-control" readOnly />
                                                    </div>
                                                    <div className="col-md-3 mt-1">
                                                        <input type="text" name="name" id="name" value={addressDetails?.Pincode} className="form-control" readOnly />
                                                    </div>
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Contact Number :-
                                                    </label>
                                                    <div className="col-md-4 mt-1">
                                                        <input type="text" name="phone" id="phone" value={addressDetails?.Phone_Number} className="form-control" readOnly />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='mt-2' >
                                                <label htmlFor="example-text-input"
                                                    className="col-md-3" style={{ color: "#5b73e8", textDecoration: "underline" }}>
                                                    Order Details :
                                                </label>
                                                <div className="mb-3 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Order Id :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={orderDetails?.orderId} className="form-control" readOnly />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group mt-3">
                                                <label className="col-md-2 control-label">Product details :-</label>
                                                <div className="col-md-12 ">
                                                    <table id="t01" style={{ width: "100%" }} border="1">
                                                        <tr>
                                                            <th>Product</th>
                                                            <th>SKU Code</th>
                                                            <th>Image</th>
                                                            <th>Color</th>
                                                            <th>Size</th>
                                                            <th>Quantity</th>
                                                            <th>Price</th>
                                                            <th>Total Price</th>
                                                            <th>Action</th>
                                                        </tr>

                                                        {productDetails && productDetails?.map((product, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{product?.product?.Product_Name?.slice(0, 30) + "..."}</td>
                                                                    <td>{product?.product?.SKU_Code}</td>
                                                                    <td>{
                                                                        <img
                                                                            src={product.variation_Image}
                                                                            alt="Product Image"
                                                                            style={{ width: '50px', height: '50px' }}
                                                                        />
                                                                    }</td>
                                                                    <td>{product?.variation?.Variation_Name}</td>
                                                                    <td >{product?.sizeName}</td>
                                                                    <td >{product?.quantity}</td>
                                                                    <td>₹ {product?.discountPrice}</td>
                                                                    <td>₹ {product?.quantity * product?.discountPrice}</td>
                                                                    <td>
                                                                        <IconButton
                                                                            aria-label="delete"
                                                                            onClick={() => handleOrderProductDelete(product)}
                                                                        >
                                                                            <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                                                                        </IconButton>
                                                                        <IconButton
                                                                            aria-label="update"
                                                                            onClick={() => handleOrderProductUpdate(product)}
                                                                        >
                                                                            <i class="fas fa-pencil-alt font-size-16 font-Icon-Up" style={{ color: "#34c38f" }}></i>
                                                                        </IconButton>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </table>
                                                </div>
                                            </div>

                                            <div className="form-group mt-3">
                                                <label className="col-md-2 control-label">Amount Details :-</label>
                                                <div className="col-md-12 orderDetailsTable">
                                                    <table id="t01" style={{ width: "100%" }} border="1">
                                                        <tr>
                                                            <th>Total Amount</th>
                                                            <th>Coupon code</th>
                                                            <th>Coupon Discount</th>
                                                            <th>Shipping Charge</th>
                                                            <th>Transport Charge</th>
                                                            <th>Online Charge</th>
                                                            <th>Final Amount</th>
                                                        </tr>
                                                        <tr>
                                                            <td><b>₹ {orderDetails?.DiscountPrice}/-</b></td>
                                                            <td>{couponDetails?.couponCode ? '#' + couponDetails?.couponCode : "Not Applied"}</td>
                                                            <td>₹ {orderDetails?.CouponPrice ? orderDetails?.CouponPrice : 0}</td>
                                                            <td>₹ {orderDetails?.Shipping_Charge}/-</td>
                                                            <td>₹ {orderDetails?.Trans_Charge}/-</td>
                                                            <td>₹ {orderDetails?.OnlineCharge}/-</td>
                                                            <td><b>₹ {orderDetails?.FinalPrice}/-</b></td>
                                                        </tr>
                                                    </table>

                                                </div>
                                            </div>

                                            <div className="mb-3 mt-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Add Order Items :-
                                                </label>
                                                <div className="col-md-10">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a
                                                            className="btn btn-primary"
                                                            onClick={() => handleOrderProductAdd(orderDetails)}
                                                        >
                                                            {" "}
                                                            <i className="fas fa-pen-square"></i> Add{" "}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <br />

                                            <div className='mt-2' >
                                                <label htmlFor="example-text-input"
                                                    className="col-md-3" style={{ color: "#5b73e8", textDecoration: "underline" }}>
                                                    Payment Details :
                                                </label>
                                                <div className="mb-3 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Payment Type :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={orderDetails?.PaymentType} className="form-control" readOnly />
                                                    </div>
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Payment Id :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={orderDetails?.PaymentId !== "0" ? orderDetails?.PaymentId : null} className="form-control" readOnly />
                                                    </div>
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Date & time :-
                                                    </label>
                                                    <div className="col-md-5 mt-1">
                                                        <input type="text" name="name" id="name" value={new Date(orderDetails?.createdAt).toLocaleDateString()} className="form-control" readOnly />
                                                    </div>
                                                    <div className="col-md-5 mt-1">
                                                        <input type="text" name="name" id="name" value={new Date(orderDetails?.createdAt).toLocaleTimeString()} className="form-control" readOnly />
                                                    </div>

                                                </div>
                                            </div>

                                            <div className='mt-2' >
                                                <label htmlFor="example-text-input"
                                                    className="col-md-3" style={{ color: "#5b73e8", textDecoration: "underline" }}>
                                                    Shipping Details :
                                                </label>
                                                <div className="mb-3 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Shipping Type :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={orderDetails?.ShippingType === "0" ? "Store Pick Up" : orderDetails?.ShippingType === "1" ? "Courier" : "Transport"} className="form-control" readOnly />
                                                    </div>
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Company :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={orderDetails?.Company} className="form-control" readOnly />
                                                    </div>
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Total weight :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={orderDetails?.total_weight + " Kg"} className="form-control" readOnly />
                                                    </div>
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Track_Id :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input
                                                            type="text"
                                                            name="trackId"
                                                            id="trackId"
                                                            value={trackId}
                                                            onChange={(e) => setTrackId(e.target.value)}
                                                            className="form-control"
                                                        />
                                                    </div>


                                                </div>
                                            </div>

                                            <div className='mt-2' >
                                                <label htmlFor="example-text-input"
                                                    className="col-md-3" style={{ color: "#5b73e8", textDecoration: "underline" }}>
                                                    Order Status :
                                                </label>
                                                <div className="mb-3 row">
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Order Status :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <select name="o_type" id="o_type" style={{ width: "30%", height: "100%" }} className="select2" onChange={(e) => setOrderType(e.target.value)} required>
                                                            {createOrderType?.map((orderType, index) => {
                                                                if (orderDetails?.OrderType === orderType) {
                                                                    return <option key={index} value={index + 1} selected>{orderType}</option>
                                                                }
                                                                else {
                                                                    return <option key={index} value={index + 1}>{orderType}</option>
                                                                }
                                                            })}
                                                        </select>
                                                    </div>
                                                    <label htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label">
                                                        Order Cancel Reason :-
                                                    </label>
                                                    <div className="col-md-10 mt-1">
                                                        <input type="text" name="name" id="name" value={orderDetails?.reason} className="form-control" readOnly />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a className="btn btn-danger" onClick={() => navigate('/showOrders')}>
                                                            {" "}
                                                            <i className="fas fa-window-close"></i> Cancel{" "}
                                                        </a>
                                                        <a className="btn btn-success" onClick={handleUpdateOrderType}>
                                                            {" "}
                                                            <i className="fas fa-save"></i> Save{" "}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div>
                </div>
            </div>


            <Modal
                className="main-content dark"
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
            >
                <EditOrderProduct
                    selectOrderId={selectOrderId}
                    selectedOrderProductData={selectedOrderProductData}
                    handleCloseModal={handleCloseModal}
                />
            </Modal>

            <Modal
                className="main-content dark"
                isOpen={isAddOrderProductModelOpen}
                onRequestClose={handleCloseAddOrderProductModal}
            >
                <AddOrderProduct
                    selectOrderId={selectOrderId}
                    selectedOrderData={selectedOrderData}
                    handleCloseModal={handleCloseAddOrderProductModal}
                />
            </Modal>

        </>
    )
}

export default ShowOrderDetails
