import React, { useEffect, useState } from 'react'
// import './ShowOrderDetails.css'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

let url = process.env.REACT_APP_API_URL

const ShowUserCart = () => {

    const adminToken = localStorage.getItem('token');
    // this data provided by redux store
    const selectUserId = useSelector((state) => state?.ShowUserCartData?.payload)
    const navigate = useNavigate()
    const [cartDetails, setCartDetails] = useState([])
    const [productDetails, setProductDetails] = useState([])


    useEffect(() => {
        async function getOrderDetails() {
            try {
                let response = await axios.get(`${url}/cart/user/get/cartItems/byAdmin/${selectUserId}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    })
                setCartDetails(response?.data)
                setProductDetails(cartDetails?.cartItems)

            } catch (error) {
                console.log(error)
            }
        }

        getOrderDetails()
    })

    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className='row'>
                            <div className="col-3 table-heading">
                                View Cart Items
                            </div>
                            <div className="col-12 mt-2">
                                <div className="card">
                                    <div className="card-body">
                                        <form >
                                            {/* <div className='mt-2' >
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
                                            </div> */}

                                            <div className="form-group mt-3">
                                                <label className="col-md-2 control-label">Cart details :-</label>
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
                                                        </tr>

                                                        {productDetails && productDetails?.map((product, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{product?.Product?.product_Name?.slice(0, 30) + "..."}</td>
                                                                    <td>{product?.Product?.SKU_Code}</td>
                                                                    <td>{
                                                                        <img

                                                                            src={product?.Variation?.variation_Image}
                                                                            alt="Product Image"
                                                                            style={{ width: '50px', height: '50px' }}
                                                                        />
                                                                    }</td>
                                                                    <td>{product?.Variation?.variation_name}</td>
                                                                    <td >{product?.sizeName}</td>
                                                                    <td >{product?.quantity}</td>
                                                                    <td>₹ {product?.discountPrice}</td>
                                                                    <td>₹ {product?.quantity * product?.discountPrice}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </table>
                                                </div>
                                            </div>

                                            <br />

                                            {/* <div className="form-group mt-3">
                                                <label className="col-md-2 control-label">Amount Details :-</label>
                                                <div className="col-md-12 orderDetailsTable">
                                                    <table id="t01" style={{ width: "100%" }} border="1">
                                                        <tr>
                                                            <th>Total Amount</th>
                                                            <th>Coupon code</th>
                                                            <th>Coupon Discount</th>
                                                            <th>Delivery Charge</th>
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
                                            </div> */}

                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a className="btn btn-danger" onClick={() => navigate('/showUser')}>
                                                            {" "}
                                                            <i className="fas fa-window-close"></i> Cancel{" "}
                                                        </a>
                                                        {/* <a className="btn btn-success" onClick={handleUpdateOrderType}>
                                                            {" "}
                                                            <i className="fas fa-save"></i> Save{" "}
                                                        </a> */}
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
        </>
    )
}

export default ShowUserCart
