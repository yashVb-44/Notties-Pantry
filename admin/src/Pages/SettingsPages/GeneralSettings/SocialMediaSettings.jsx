import React from 'react'

const SocialMediaSettings = ({ telegramUrl, setTelegramUrl, youtubeUrl, setYoutubeUrl, instagramUrl, setInstagramUrl, facebookUrl, setFacebookUrl }) => {
    return (
        <>
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Facebook Url :-
                </label>
                <div className="col-md-10">
                    <input
                        className="form-control"
                        type="text"
                        id="example-text-input"
                        value={facebookUrl}
                        onChange={(e) => {
                            setFacebookUrl(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Instagram Url :-
                </label>
                <div className="col-md-10">
                    <input
                        className="form-control"
                        type="text"
                        id="example-text-input"
                        value={instagramUrl}
                        onChange={(e) => {
                            setInstagramUrl(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    YouTube Url :-
                </label>
                <div className="col-md-10">
                    <input
                        className="form-control"
                        type="text"
                        id="example-text-input"
                        value={youtubeUrl}
                        onChange={(e) => {
                            setYoutubeUrl(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Telegram Url :-
                </label>
                <div className="col-md-10">
                    <input
                        className="form-control"
                        type="text"
                        id="example-text-input"
                        value={telegramUrl}
                        onChange={(e) => {
                            setTelegramUrl(e.target.value);
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default SocialMediaSettings
