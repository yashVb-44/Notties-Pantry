import React, { useEffect, useState } from "react";
import logo_sm from "../../resources/assets/images/image_2023_08_19T05_11_01_553Z.png";
// import logo_sm from "../../resources/assets/images/logo-sm.png";
import logo_dark from "../../resources/assets/images/logo-dark.png";
import down_arrow from "../../resources/assets/images/down-arrow.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

let url = process.env.REACT_APP_API_URL

const LeftSide = () => {

    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState("");

    // get current url
    useEffect(() => {
        const currentURL = window.location.href;
        const url = new URL(currentURL);
        const point = url.pathname.split("/").pop();
        setActiveMenu(point);
    });

    const [settingsData, setSettingsData] = useState({})

    useEffect(() => {
        async function getSettings() {
            try {
                const res = await axios.get(`${url}/app/settings/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setSettingsData(res?.data?.Settings);
            } catch (error) {
                console.log(error)
            }
        }
        getSettings()
    }, [settingsData])

    return (
        <>
            <div className="vertical-menu">
                <div className="navbar-brand-box">
                    <a className="logo logo-dark">
                        <span className="logo-sm">
                            <img src={settingsData?.app_logo} alt="" height={40} width={40} />
                        </span>
                        <span className="logo-lg">
                            <img src={settingsData?.app_logo} alt="" height={40} width={40} />
                        </span>
                    </a>

                    <a className="logo logo-light">
                        <span className="logo-sm">
                            <img src={settingsData?.app_logo} alt="" height={40} width={40} />
                        </span>
                        <span className="logo-lg">
                            <img src={settingsData?.app_logo} alt="" height={40} width={40} />
                        </span>
                    </a>
                </div>

                <button
                    type="button"
                    className="btn btn-sm px-3 font-size-16 header-item waves-effect vertical-menu-btn"
                    onClick={() => {
                        document.body.setAttribute("data-sidebar-size", "sm");
                        document.body.classList.add("sidebar-enable");
                        document.body.classList.add("sm");
                        document.body.classList.remove("lg");
                    }}
                >
                    <i className="fa fa-fw fa-bars"></i>
                </button>

                <div data-simplebar className="sidebar-menu-scroll">
                    <div id="sidebar-menu">
                        <ul className="metismenu list-unstyled" id="side-menu">
                            <li className="menu-title">Menu</li>

                            <li
                                className={`${activeMenu === "" ? "mm-active" : ""}`}
                                onClick={() => {
                                    Navigate("/");
                                }}
                            >
                                <a className={`${activeMenu === "" ? "active" : ""}`}>
                                    <i className="uil-home-alt">
                                        <i className="fas fa-home" aria-hidden="true"></i>
                                    </i>
                                    {/* <span className="badge rounded-pill bg-primary float-end">
                                        01
                                    </span> */}
                                    <span>Dashboard</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === "addChargesSettings" ||
                                    activeMenu === "memberShipSettings" ||
                                    activeMenu === "generalSettings" ||
                                    activeMenu === "pageSettings"
                                    ? "mm-active" : ""}`}
                            >
                                <a
                                    className={`${activeMenu === "addChargesSettings" ||
                                        activeMenu === "memberShipSettings" ||
                                        activeMenu === "generalSettings" ||
                                        activeMenu === "pageSettings"

                                        ? "active" : ""
                                        } waves-effect d-flex sub-drop`}
                                    onClick={() => {
                                        document
                                            .querySelector(".sub-menu1")
                                            .classList.toggle("active");
                                        document.querySelector("#w-243").classList.toggle("active");
                                    }}
                                >
                                    <div>
                                        <i className="uil-store">
                                            <i className="fas fa-cogs" aria-hidden="true"></i>
                                        </i>
                                        <span style={{ marginLeft: "3px" }}>Settings</span>
                                    </div>
                                    <img className="w-24" id="w-243" src={down_arrow} />
                                </a>
                                <ul className="sub-menu sub-menu1" aria-expanded="false">
                                    <li
                                        onClick={() => {
                                            Navigate("/addChargesSettings");
                                        }}
                                        style={{ cursor: "pointer" }}
                                        className={`${activeMenu === "addChargesSettings" ? "mm-active" : ""}`}

                                    >
                                        <a>Add Charges Settings</a>
                                    </li>
                                    <li
                                        onClick={() => {
                                            Navigate("/memberShipSettings");
                                        }}
                                        style={{ cursor: "pointer" }}
                                        className={`${activeMenu === "memberShipSettings" ? "mm-active" : ""}`}

                                    >
                                        <a>MemberShip Settings</a>
                                    </li>
                                    <li
                                        onClick={() => {
                                            Navigate("/generalSettings");
                                        }}
                                        style={{ cursor: "pointer" }}
                                        className={`${activeMenu === "generalSettings" ? "mm-active" : ""}`}

                                    >
                                        <a>General Settings</a>
                                    </li>
                                    <li
                                        onClick={() => {
                                            Navigate("/pageSettings");
                                        }}
                                        style={{ cursor: "pointer" }}
                                        className={`${activeMenu === "pageSettings" ? "mm-active" : ""}`}

                                    >
                                        <a>Page Settings</a>
                                    </li>
                                </ul>
                            </li>

                            {/* <li>
                                <a
                                    className="waves-effect d-flex sub-drop"
                                    onClick={() => {
                                        document
                                            .querySelector(".sub-menu")
                                            .classList.toggle("active");
                                        document.querySelector(".w-24").classList.toggle("active");
                                    }}
                                >
                                    <div>
                                        <i className="uil-window-section">
                                            <i className="fa fa-columns" aria-hidden="true"></i>
                                        </i>
                                        <span>Layouts</span>
                                    </div>
                                    <img className="w-24" src={down_arrow} />
                                </a>
                                <ul className="sub-menu" aria-expanded="true">
                                    <li>
                                        <a
                                            className="d-flex sub-drop"
                                            onClick={() => {
                                                document
                                                    .querySelector(".sub-submenu1")
                                                    .classList.toggle("active");
                                                document
                                                    .querySelector(".sub-submenu2")
                                                    .classList.remove("active");
                                                document
                                                    .querySelector("#w-241")
                                                    .classList.toggle("active");
                                            }}
                                        >
                                            <div>
                                                <span>Vertical</span>
                                            </div>
                                            <img className="w-24" id="w-241" src={down_arrow} />
                                        </a>
                                        <ul className="sub-menu sub-submenu1" aria-expanded="true">
                                            <li>
                                                <a>Dark Sidebar</a>
                                            </li>
                                            <li>
                                                <a href="layouts-compact-sidebar.html">
                                                    Compact Sidebar
                                                </a>
                                            </li>
                                            <li>
                                                <a href="layouts-icon-sidebar.html">Icon Sidebar</a>
                                            </li>
                                            <li>
                                                <a href="layouts-boxed.html">Boxed Width</a>
                                            </li>
                                            <li>
                                                <a href="layouts-preloader.html">Preloader</a>
                                            </li>
                                            <li>
                                                <a href="layouts-colored-sidebar.html">
                                                    Colored Sidebar
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a
                                            className="d-flex sub-drop"
                                            onClick={() => {
                                                document
                                                    .querySelector(".sub-submenu2")
                                                    .classList.toggle("active");
                                                document
                                                    .querySelector(".sub-submenu1")
                                                    .classList.remove("active");
                                                document
                                                    .querySelector("#w-242")
                                                    .classList.toggle("active");
                                            }}
                                        >
                                            <div>
                                                <span>Horizontal</span>
                                            </div>
                                            <img className="w-24" id="w-242" src={down_arrow} />
                                        </a>
                                        <ul className="sub-menu sub-submenu2" aria-expanded="true">
                                            <li>
                                                <a href="layouts-horizontal.html">Horizontal</a>
                                            </li>
                                            <li>
                                                <a href="layouts-hori-topbar-dark.html">Topbar Dark</a>
                                            </li>
                                            <li>
                                                <a href="layouts-hori-boxed-width.html">Boxed Width</a>
                                            </li>
                                            <li>
                                                <a href="layouts-hori-preloader.html">Preloader</a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li> */}

                            <li className="menu-title">Apps</li>

                            {/* <li
                                className={`${activeMenu === "showOrder" ? "mm-active" : ""}`}
                                onClick={() => {
                                    Navigate("/");
                                }}
                            >
                                <a
                                    className={`${activeMenu === "showOrder" ? "active" : ""
                                        } waves-effect d-flex sub-drop`}
                                    onClick={() => {
                                        document
                                            .querySelector(".sub-menu1")
                                            .classList.toggle("active");
                                        document.querySelector("#w-243").classList.toggle("active");
                                    }}
                                >
                                    <div>
                                        <i className="uil-store">
                                            <i className="fas fa-store" aria-hidden="true"></i>
                                        </i>
                                        <span>Orders</span>
                                    </div>
                                    <img className="w-24" id="w-243" src={down_arrow} />
                                </a>
                                <ul className="sub-menu sub-menu1" aria-expanded="false">
                                    <li>
                                        <a href="ecommerce-products.html">Products</a>
                                    </li>
                                    <li>
                                        <a href="ecommerce-add-product.html">Variation</a>
                                    </li>
                                    <li>
                                        <a href="ecommerce-add-product.html">Size</a>
                                    </li>
                                </ul>
                            </li> */}

                            <li
                                className={`${activeMenu === `showUser`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showUser");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showUser`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-user"></i>
                                    </i>
                                    <span>Users</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showReview`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showReview");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showReview`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-user-edit"></i>
                                    </i>
                                    <span>Rating & Review</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showCategory` ||
                                    activeMenu === `addCategory` ||
                                    activeMenu === `editCategory`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showCategory");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showCategory` ||
                                        activeMenu === `addCategory` ||
                                        activeMenu === `editCategory`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-th-large"></i>
                                    </i>
                                    <span>Category</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showSubCategory` ||
                                    activeMenu === `addSubCategory` ||
                                    activeMenu === `editSubCategory`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showSubCategory");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showSubCategory` ||
                                        activeMenu === `addSubCategory` ||
                                        activeMenu === `editSubCategory`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-clipboard-list"></i>
                                    </i>
                                    <span>Sub Category</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showProduct` ||
                                    activeMenu === `addProduct` ||
                                    activeMenu === `editProduct` ||
                                    activeMenu === `addVariation` ||
                                    activeMenu === `showVariation` ||
                                    activeMenu === `editVariation` ||
                                    activeMenu === `addVariationSize` ||
                                    activeMenu === `showVariationSize` ||
                                    activeMenu === `editVariationSize`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showProduct");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showProduct` ||
                                        activeMenu === `addProduct` ||
                                        activeMenu === `editProduct` ||
                                        activeMenu === `addVariation` ||
                                        activeMenu === `showVariation` ||
                                        activeMenu === `editVariation` ||
                                        activeMenu === `addVariationSize` ||
                                        activeMenu === `showVariationSize` ||
                                        activeMenu === `editVariationSize`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-box-open"></i>
                                    </i>
                                    <span>Product</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showNottifly` ||
                                    activeMenu === `addNottifly` ||
                                    activeMenu === `editNottifly`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showNottifly");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showNottifly` ||
                                        activeMenu === `addNottifly` ||
                                        activeMenu === `editNottifly`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-dove"></i>
                                    </i>
                                    <span>Nottifly</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showPostRequirement`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showPostRequirement");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showPostRequirement`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-file-signature"></i>
                                    </i>
                                    <span>Requirement Post</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showCustomerSupport`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showCustomerSupport");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showCustomerSupport`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-headset"></i>
                                    </i>
                                    <span>Customer Support</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showLowStockProduct` ||
                                    activeMenu === `addBanner` ||
                                    activeMenu === `editBanner`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showLowStockProduct");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showLowStockProduct`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        {/* <i className="fas fa-images"></i> */}
                                        <i className="fas fa-boxes"></i>
                                    </i>
                                    <span>Low Stock Product</span>
                                </a>
                            </li>


                            <li
                                className={`${activeMenu === `showProductNotify`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showProductNotify");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showProductNotify`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        {/* <i className="fas fa-images"></i> */}
                                        <i className="fas fa-hand-holding-medical"></i>
                                    </i>
                                    <span>User Notify Product</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showBanner`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showBanner");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showBanner` ||
                                        activeMenu === `addBanner` ||
                                        activeMenu === `editBanner`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        {/* <i className="fas fa-images"></i> */}
                                        <i className="fas fa-window-maximize"></i>
                                    </i>
                                    <span>Banner</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showProductBanner` ||
                                    activeMenu === `addProductBanner` ||
                                    activeMenu === `editProductBanner`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showProductBanner");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showProductBanner` ||
                                        activeMenu === `addProductBanner` ||
                                        activeMenu === `editProductBanner`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-window-restore"></i>
                                    </i>
                                    <span>Product Banner</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showOrders` ||
                                    activeMenu === `editOrders`
                                    // activeMenu === `showSpecification`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showOrders");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showOrders` ||
                                        activeMenu === `editOrders`
                                        // activeMenu === `editSpecification`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-shopping-bag"></i>
                                    </i>
                                    <span>Orders</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showMemberShip` ||
                                    activeMenu === `showAllMemberShipOfUser`
                                    // activeMenu === `showSpecification`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showMemberShip");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showMemberShip` ||
                                        activeMenu === `showAllMemberShipOfUser`
                                        // activeMenu === `editSpecification`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fa fa-user-plus"></i>
                                    </i>
                                    <span>MemberShip</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showCoupon` ||
                                    activeMenu === `addCoupon` ||
                                    activeMenu === `editCoupon`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showCoupon");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showCoupon` ||
                                        activeMenu === `addCoupon` ||
                                        activeMenu === `editCoupon`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-ticket-alt"></i>
                                    </i>
                                    <span>Coupon</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showWalletHistory` ||
                                    activeMenu === `addWallet`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showWalletHistory");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showWalletHistory` ||
                                        activeMenu === `addWallet`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-wallet"></i>
                                    </i>
                                    <span>Wallet</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `showCoinsHistory` ||
                                    activeMenu === `addCoins`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showCoinsHistory");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showCoinsHistory` ||
                                        activeMenu === `addCoins`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-coins"></i>
                                    </i>
                                    <span>Coins</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `addNews` ||
                                    activeMenu === `showNews` ||
                                    activeMenu === `editNews`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showNews");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showNews` ||
                                        activeMenu === `addNews` ||
                                        activeMenu === `editNews`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-newspaper"></i>
                                    </i>
                                    <span>News</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `addPostVideo` ||
                                    activeMenu === `editPostVideo` ||
                                    activeMenu === `showPostVideo`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showPostVideo");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showPostVideo` ||
                                        activeMenu === `addPostVideo` ||
                                        activeMenu === `editPostVideo`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-video"></i>
                                    </i>
                                    <span>Post Video</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `addShippingCharge` ||
                                    activeMenu === `editShippingCharge` ||
                                    activeMenu === `showShippingCharge`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showShippingCharge");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showShippingCharge` ||
                                        activeMenu === `editShippingCharge` ||
                                        activeMenu === `addShippingCharge`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-truck"></i>
                                    </i>
                                    <span>Shipping Charges</span>
                                </a>
                            </li>

                            <li
                                className={`${activeMenu === `sendNotification` ||
                                    activeMenu === `showNotification`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showNotification");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `sendNotification` ||
                                        activeMenu === `showNotification`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-paper-plane"></i>
                                    </i>
                                    <span>Notification</span>
                                </a>
                            </li>

                            {/* <li
                                className={`${activeMenu === `showTimeZone` ||
                                    activeMenu === `addTimeZone` ||
                                    activeMenu === `editTimeZone`
                                    ? "mm-active"
                                    : ""
                                    }`}
                                onClick={() => {
                                    Navigate("/showTimeZone");
                                }}
                            >
                                <a
                                    className={`${activeMenu === `showTimeZone` ||
                                        activeMenu === `addTimeZone` ||
                                        activeMenu === `editTimeZone`
                                        ? "active"
                                        : ""
                                        } waves-effect`}
                                >
                                    <i className="uil-book-alt">
                                        <i className="fas fa-clock"></i>
                                    </i>
                                    <span>Time Zone</span>
                                </a>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeftSide;
