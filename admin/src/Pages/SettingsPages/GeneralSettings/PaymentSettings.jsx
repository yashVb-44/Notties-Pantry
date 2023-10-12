import React from 'react'

const PaymentSettings = ({ mapkey, razorKey, setMapKey, setRazorKey, trasCharge, setTrasCharge }) => {
    return (
        <>
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Razorpay Key :-
                </label>
                <div className="col-md-10">
                    <input
                        className="form-control"
                        type="text"
                        id="example-text-input"
                        value={razorKey}
                        onChange={(e) => {
                            setRazorKey(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Map Key :-
                </label>
                <div className="col-md-10">
                    <input
                        className="form-control"
                        type="text"
                        id="example-text-input"
                        value={mapkey}
                        onChange={(e) => {
                            setMapKey(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Transport Charge :-
                </label>
                <div className="col-md-10">
                    <input
                        min={0}
                        className="form-control"
                        type="Number"
                        id="example-text-input"
                        value={trasCharge}
                        onChange={(e) => {
                            setTrasCharge(e.target.value);
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default PaymentSettings
