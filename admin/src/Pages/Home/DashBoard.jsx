import axios from 'axios'
import React, { useEffect, useState } from 'react'
import pendingImage from '../../../src/resources/assets/images/pending_order.png'
import totalImage from '../../../src/resources/assets/images/total.png'
import retunImage from '../../../src/resources/assets/images/return.png'
import cancelImage from '../../../src/resources/assets/images/cancel_order.png'
import completeImage from '../../../src/resources/assets/images/Complete order.png'
import confirmedImage from '../../../src/resources/assets/images/confirmed order.png'
import rejectImage from '../../../src/resources/assets/images/reject_order.png'
import pickupImage from '../../../src/resources/assets/images/pickup.png'
import totalOrderImage from '../../../src/resources/assets/images/total order.png'
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

let url = process.env.REACT_APP_API_URL

const DashBoard = () => {

    const [orderData, setOrderData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const data = {
        startDate: startDate,
        endDate: endDate
    }


    useEffect(() => {
        async function fetchOrderData() {
            try {
                const adminToken = localStorage.getItem('token');
                const res = await axios.post(`${url}/order/get/byStatus/forAdmin`,
                    data,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                setOrderData(res.data || []);
            } catch (error) {
                console.log(error)
            }
        }

        fetchOrderData(startDate, endDate);
    }, [startDate, endDate]);

    const handleClearFilters = () => {
        setStartDate("")
        setEndDate("")
    };


    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className='row'>
                            <div className="col-2 table-heading">
                                DashBoard
                            </div>
                            <div className="col-12 mt-2">
                                <div className="mt-4">
                                    <div className="card-body">

                                        <TextField
                                            label='Start Date'
                                            type='date'
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{ margin: '5px', width: "135px" }}
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                        <TextField
                                            label='End Date'
                                            type='date'
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{ margin: '5px', width: "135px" }}
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />

                                        <a className="btn btn-danger waves-effect waves-light" style={{ margin: '12px' }} onClick={() => handleClearFilters()}>
                                            Clear Filters
                                        </a>

                                        <div className="row mt-2">

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="total-revenue-chart" data-colors='["--bs-primary"]'>
                                                                <img src={totalImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1">₹<span data-plugin="counterup">{orderData?.totalOrdersAmount || 0}</span></h4>
                                                            <p className="text-muted mb-0">Total Order Revenue</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0"></p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="total-revenue-chart" data-colors='["--bs-primary"]'>
                                                                <img src={totalImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1">₹<span data-plugin="counterup">{orderData?.totalCompletedAmount || 0}</span></h4>
                                                            <p className="text-muted mb-0">Completed Order Revenue</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0">
                                                            {/* <span className="text-success me-1"><i
                                                                className="mdi mdi-arrow-up-bold me-1"></i>2.65%</span>
                                                            since last week */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="orders-chart" data-colors='["--bs-success"]'>
                                                                <img src={totalOrderImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1"><span data-plugin="counterup">{orderData?.totalOrders}</span></h4>
                                                            <p className="text-muted mb-0">Total Orders</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0">
                                                            {/* <span className="text-danger me-1"><i
                                                                className="mdi mdi-arrow-down-bold me-1"></i>0.82%</span>
                                                            since last week */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="growth-chart" data-colors='["--bs-warning"]'>
                                                                <img src={pendingImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1"><span data-plugin="counterup">{orderData?.pendingOrders}</span></h4>
                                                            <p className="text-muted mb-0">Pending Orders</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0">
                                                            {/* <span className="text-success me-1"><i
                                                            className="mdi mdi-arrow-up-bold me-1"></i>10.51%</span>
                                                             since last week */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="growth-chart" data-colors='["--bs-warning"]'>
                                                                <img src={confirmedImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1"><span data-plugin="counterup">{orderData?.acceptedOrders}</span></h4>
                                                            <p className="text-muted mb-0">Accepted Orders</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0">
                                                            {/* <span className="text-success me-1"><i
                                                            className="mdi mdi-arrow-up-bold me-1"></i>10.51%</span>
                                                             since last week */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="growth-chart" data-colors='["--bs-warning"]'>
                                                                <img src={rejectImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1"><span data-plugin="counterup">{orderData?.rejectedOrders}</span></h4>
                                                            <p className="text-muted mb-0">Rejected Orders</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0">
                                                            {/* <span className="text-success me-1"><i
                                                            className="mdi mdi-arrow-up-bold me-1"></i>10.51%</span>
                                                             since last week */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="growth-chart" data-colors='["--bs-warning"]'>
                                                                <img src={rejectImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1"><span data-plugin="counterup">{orderData?.processingOrders}</span></h4>
                                                            <p className="text-muted mb-0">Processing Orders</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0">
                                                            {/* <span className="text-success me-1"><i
                                                            className="mdi mdi-arrow-up-bold me-1"></i>10.51%</span>
                                                             since last week */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="growth-chart" data-colors='["--bs-warning"]'>
                                                                <img src={rejectImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1"><span data-plugin="counterup">{orderData?.readyToshipOrders}</span></h4>
                                                            <p className="text-muted mb-0">Ready to Ship Orders</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0">
                                                            {/* <span className="text-success me-1"><i
                                                            className="mdi mdi-arrow-up-bold me-1"></i>10.51%</span>
                                                             since last week */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="growth-chart" data-colors='["--bs-warning"]'>
                                                                <img src={rejectImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1"><span data-plugin="counterup">{orderData?.shippedOrders}</span></h4>
                                                            <p className="text-muted mb-0">Shipped Orders</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0">
                                                            {/* <span className="text-success me-1"><i
                                                            className="mdi mdi-arrow-up-bold me-1"></i>10.51%</span>
                                                             since last week */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="customers-chart" data-colors='["--bs-primary"]'>
                                                                <img src={completeImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1"><span data-plugin="counterup">{orderData?.completedOrders}</span></h4>
                                                            <p className="text-muted mb-0">Completed Orders</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0">
                                                            {/* <span className="text-danger me-1"><i
                                                            className="mdi mdi-arrow-down-bold me-1"></i>6.24%</span>
                                                             since last week */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="total-revenue-chart" data-colors='["--bs-primary"]'>
                                                                <img src={retunImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1">{orderData?.cancelledOrders}</h4>
                                                            <p className="text-muted mb-0">Cancelled Orders</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0"></p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-xl-3">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="float-end mt-2">
                                                            <div id="growth-chart" data-colors='["--bs-warning"]'>
                                                                <img src={retunImage} height={50} width={50} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-1 mt-1"><span data-plugin="counterup">{orderData?.returnedOrders}</span></h4>
                                                            <p className="text-muted mb-0">Returned Orders</p>
                                                        </div>
                                                        <p className="text-muted mt-3 mb-0">
                                                            {/* <span className="text-success me-1"><i
                                                            className="mdi mdi-arrow-up-bold me-1"></i>10.51%</span>
                                                             since last week */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashBoard
