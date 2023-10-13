import React, { useState } from 'react'
import Modal from "react-modal";
import ImageModel from '../../../../Components/ImageComp/ImageModel';

const ViewsPostRequirement = ({ handleCloseModal, selectedForm }) => {


    const [imagePreviews, setImagePreviews] = useState(
        selectedForm?.Requirement_Images?.map((image) => image) || []
    );

    // for big image
    const [selectedImage, setSelectedImage] = useState("");
    const [isModalOpenforImage, setIsModalOpenforImage] = useState(false);

    const handleImageClick = (imageURL) => {
        setSelectedImage(imageURL);
        setIsModalOpenforImage(true);
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
                                            <h4 className="mb-0">Post requirement</h4>
                                            <i
                                                className="fas fa-window-close"
                                                style={{ cursor: "pointer", color: "red" }}
                                                onClick={handleCloseModal}
                                            ></i>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                User Name:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={selectedForm?.User_Name}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                User Mobile No:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    required
                                                    className="form-control"
                                                    id="example-text-input"
                                                    value={selectedForm?.User_Mobile_No}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Title:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={selectedForm?.title}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Description:
                                            </label>
                                            <div className="col-md-10">
                                                <textarea
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={selectedForm?.desc}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Date:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={selectedForm?.Date}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                Images:
                                            </label>
                                            <div className="col-md-10">
                                                {imagePreviews?.map((preview, index) => (
                                                    <img
                                                        key={index}
                                                        src={preview}
                                                        alt="Preview"
                                                        style={{ marginTop: "5px", marginLeft: "15px" }}
                                                        height={150}
                                                        width={150}
                                                        onClick={() => handleImageClick(preview)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                className="main-content dark"
                isOpen={isModalOpenforImage}
            >

                <ImageModel
                    isOpen={isModalOpenforImage}
                    onClose={() => setIsModalOpenforImage(false)}
                    imageURL={selectedImage}
                />
            </Modal>

        </>
    )
}

export default ViewsPostRequirement