import React, { useEffect, useState } from 'react'
import Header from '../../Components/HeaderComp/Header'
import LeftSide from '../../Components/SideBarComp/LeftSide'
import RightSide from '../../Components/SideBarComp/RightSide'
import AddCategory from '../InnerPages/BackEndSide/Category/AddCategory'
import { Outlet, Route, Routes } from 'react-router-dom'
import ShowCategory from '../InnerPages/BackEndSide/Category/ShowCategory'
import EditCategory from '../InnerPages/BackEndSide/Category/EditCategory'
import AddBanner from '../InnerPages/BackEndSide/Banner/AddBanner'
import ShowBanner from '../InnerPages/BackEndSide/Banner/ShowBanner'
import EditBanner from '../InnerPages/BackEndSide/Banner/EditBanner'
import AddProduct from '../InnerPages/BackEndSide/Product/AddProduct'
import AddData from '../InnerPages/BackEndSide/Data/AddData'
import ShowData from '../InnerPages/BackEndSide/Data/ShowData'
import EditData from '../InnerPages/BackEndSide/Data/EditData'
import ShowProduct from '../InnerPages/BackEndSide/Product/ShowProduct'
import ShowVariation from '../InnerPages/BackEndSide/Variation/ShowVariation'
import ShowVariationSize from '../InnerPages/BackEndSide/Variation/ShowVariationSize'
import ShowUser from '../InnerPages/FrontEndSide/User/ShowUser'
import AddChargesSettings from '../SettingsPages/ChargesSettings/AddChargesSettings'
import EditProduct from '../InnerPages/BackEndSide/Product/EditProduct'
import ShowOrder from '../InnerPages/FrontEndSide/Order/ShowOrder'
import MemberShipSettings from '../SettingsPages/ChargesSettings/MemberShipSettings'
import EditUser from '../InnerPages/FrontEndSide/User/EditUser'
import GeneralSettingsMain from '../SettingsPages/GeneralSettings/GeneralSettingsMain'
import GeneralSettings from '../SettingsPages/GeneralSettings/GeneralSettings'
import PageSettings from '../SettingsPages/PagesSettings/PageSettings'
import ShowCoupon from '../InnerPages/FrontEndSide/Coupon/ShowCoupon'
import AddCoupon from '../InnerPages/FrontEndSide/Coupon/AddCoupon'
import EditCoupon from '../InnerPages/FrontEndSide/Coupon/EditCoupon'
import EditOrder from '../InnerPages/FrontEndSide/Order/EditOrder'
import ShowMemberShip from '../InnerPages/FrontEndSide/MemberShip/ShowMemberShip'
import ShowUserAllMemberShip from '../InnerPages/FrontEndSide/MemberShip/ShowUserAllMemberShip'
import ShowWalletHistory from '../InnerPages/FrontEndSide/Wallet/ShowWalletHistory'
import ShowCoinsHistory from '../InnerPages/FrontEndSide/Coins/ShowCoinsHistory'
import AddWallet from '../InnerPages/FrontEndSide/Wallet/AddWallet'
import AddCoins from '../InnerPages/FrontEndSide/Coins/AddCoins'
import DashBoard from './DashBoard'
import ShowReview from '../InnerPages/FrontEndSide/Review/ShowReview'
import AddProductBanner from '../InnerPages/BackEndSide/Product_Banner/AddProductBanner'
import ShowProductBanner from '../InnerPages/BackEndSide/Product_Banner/ShowProductBanner'
import EditProductBanner from '../InnerPages/BackEndSide/Product_Banner/EditProductBanner'
import ShowLowStockProducts from '../InnerPages/BackEndSide/Product/ShowLowStockProduct'
import ShowProductNotify from '../InnerPages/BackEndSide/Product_Notify/ShowProductNotify'
import axios from 'axios'
import NotAdminPage from '../AuthenticationPages/NotAdminPage'
import ShowSubAdmin from '../InnerPages/BackEndSide/SubAdmin/ShowSubAdmin'
import AddSubCategory from '../InnerPages/BackEndSide/SubCategory/AddSubCategory'
import ShowSubCategory from '../InnerPages/BackEndSide/SubCategory/ShowSubCategory'
import EditSubCategory from '../InnerPages/BackEndSide/SubCategory/EditSubCategory'
import AddNews from '../InnerPages/BackEndSide/News/AddLatestNews'
import ShowNews from '../InnerPages/BackEndSide/News/ShowLatestNews'
import EditNews from '../InnerPages/BackEndSide/News/EditLatestNews'
import AddShippingCharge from '../InnerPages/BackEndSide/Shipping/AddShippingCharge'
import ShowShippingCharge from '../InnerPages/BackEndSide/Shipping/ShowShippingCharge'
import EditShippingCharge from '../InnerPages/BackEndSide/Shipping/EditShippingCharge'
import ShowPostRequirement from '../InnerPages/FrontEndSide/PostRequirement/ShowPostRequirement'
import ShowCustomerSupport from '../InnerPages/FrontEndSide/CustomerSupport/ShowCustomerSupport'
import AddNottifly from '../InnerPages/BackEndSide/Notifly/AddNottifly'
import ShowNottifly from '../InnerPages/BackEndSide/Notifly/ShowNottifly'
import AddPostVideo from '../InnerPages/BackEndSide/Video/AddPostVideo'
import ShowPostVideo from '../InnerPages/BackEndSide/Video/ShowPostVideo'
import EditPostVideo from '../InnerPages/BackEndSide/Video/EditPostVideo'
import EditNottifly from '../InnerPages/BackEndSide/Notifly/EditNottifly'
import AddSpecification from '../InnerPages/BackEndSide/Specification/AddSpecification'
import ShowSpecification from '../InnerPages/BackEndSide/Specification/ShowSpecification'
import EditSpecification from '../InnerPages/BackEndSide/Specification/EditSpecification'
import ShowUserCart from '../InnerPages/FrontEndSide/User/ShowUserCart'
import AddHomeFeatures from '../InnerPages/BackEndSide/Home_Features/AddHomeFeatures'
import ShowHomeFeature from '../InnerPages/BackEndSide/Home_Features/ShowHomeFeatures'
import EditHomeFeature from '../InnerPages/BackEndSide/Home_Features/EditHomeFetures'

let url = process.env.REACT_APP_API_URL

const HomePage = () => {

    const [userRole, setUserRole] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {

        let adminToken = localStorage.getItem('token');
        async function checkAdmin() {
            try {
                const res = await axios.get(`${url}/auth/userName`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                )
                if (res?.data?.type === "success") {
                    const userRoleFromServer = 'admin';
                    setUserRole(userRoleFromServer);
                    setIsAdmin(true)
                }
            } catch (error) {
                console.log(error)
            }
        }

        checkAdmin()
    }, []);

    return (
        <>
            <div id="layout-wrapper">
                <Header />
                <LeftSide />
            </div>
            <RightSide />

            <Routes>
                {/* Banner */}
                <Route exact path='/addBanner' element={<AddBanner />} />
                <Route exact path='/showBanner' element={<ShowBanner />} />
                <Route exact path='/editBanner' element={<EditBanner />} />
                <Route exact path='/addProductBanner' element={<AddProductBanner />} />
                <Route exact path='/showProductBanner' element={<ShowProductBanner />} />
                <Route exact path='/editProductBanner' element={<EditProductBanner />} />

                {/* Category */}
                <Route exact path='/addCategory' element={<AddCategory />} />
                <Route exact path='/showCategory' element={<ShowCategory />} />
                <Route exact path='/editCategory' element={<EditCategory />} />

                {/* SubCategory */}
                <Route exact path='/addSubCategory' element={<AddSubCategory />} />
                <Route exact path='/showSubCategory' element={<ShowSubCategory />} />
                <Route exact path='/editSubCategory' element={<EditSubCategory />} />

                {/* Data (Specification) */}
                <Route exact path='/addSpecification' element={<AddSpecification />} />
                <Route exact path='/showSpecification' element={<ShowSpecification />} />
                <Route exact path='/editSpecification' element={<EditSpecification />} />

                {/* Product */}
                <Route exact path='/addProduct' element={<AddProduct />} />
                <Route exact path='/showProduct' element={<ShowProduct />} />
                <Route exact path='/editProduct' element={<EditProduct />} />
                <Route exact path='/showLowStockProduct' element={<ShowLowStockProducts />} />
                <Route exact path='/showProductNotify' element={<ShowProductNotify />} />

                {/* Variation */}
                <Route exact path='/showVariation' element={<ShowVariation />} />
                <Route exact path='/showVariationSize' element={<ShowVariationSize />} />

                {/* User */}
                <Route exact path='/showUser' element={<ShowUser />} />
                <Route exact path='/editUser' element={<EditUser />} />
                <Route exact path='/showUserCart' element={<ShowUserCart />} />

                {/* Order */}
                <Route exact path='/showOrders' element={<ShowOrder />} />
                <Route exact path='/editOrders' element={<EditOrder />} />

                {/* Settings */}
                <Route exact path='/addChargesSettings' element={<AddChargesSettings />} />
                <Route exact path='/memberShipSettings' element={<MemberShipSettings />} />
                <Route exact path='/generalSettings' element={<GeneralSettingsMain />} />
                <Route exact path='/pageSettings' element={<PageSettings />} />

                {/* Coupon */}
                <Route exact path='/showCoupon' element={<ShowCoupon />} />
                <Route exact path='/addCoupon' element={<AddCoupon />} />
                <Route exact path='/editCoupon' element={<EditCoupon />} />

                {/* MemberShip */}
                <Route exact path='/showMemberShip' element={<ShowMemberShip />} />
                <Route exact path='/showAllMemberShipOfUser' element={<ShowUserAllMemberShip />} />

                {/* Wallet */}
                <Route exact path='/showWalletHistory' element={<ShowWalletHistory />} />
                <Route exact path='/addWallet' element={<AddWallet />} />

                {/* Coins */}
                <Route exact path='/showCoinsHistory' element={<ShowCoinsHistory />} />
                <Route exact path='/addCoins' element={<AddCoins />} />

                {/* DashBoard */}
                <Route exact path='/' element={<DashBoard />} />

                {/* Review */}
                <Route exact path="/showReview" element={<ShowReview />} />

                {/* Shipping */}
                <Route path="/addShippingCharge" element={<AddShippingCharge />} />
                <Route path="/showShippingCharge" element={<ShowShippingCharge />} />
                <Route path="/editShippingCharge" element={<EditShippingCharge />} />

                {/* News */}
                <Route exact path="/addNews" element={<AddNews />} />
                <Route exact path="/showNews" element={<ShowNews />} />
                <Route exact path="/editNews" element={<EditNews />} />

                {/* PostRequirement */}
                <Route exact path="/showPostRequirement" element={<ShowPostRequirement />} />

                {/* CustomerSupport */}
                <Route exact path="/showCustomerSupport" element={<ShowCustomerSupport />} />

                {/* Nottifly */}
                <Route exact path="/addNottifly" element={<AddNottifly />} />
                <Route exact path="/showNottifly" element={<ShowNottifly />} />
                <Route exact path="/editNottifly" element={<EditNottifly />} />

                {/* Post Video */}
                <Route exact path="/addPostVideo" element={<AddPostVideo />} />
                <Route exact path="/showPostVideo" element={<ShowPostVideo />} />
                <Route exact path="/editPostVideo" element={<EditPostVideo />} />

                {/* Home Features */}
                <Route exact path="/addHomeFeature" element={<AddHomeFeatures />} />
                <Route exact path="/showHomeFeature" element={<ShowHomeFeature />} />
                <Route exact path="/editHomeFeature" element={<EditHomeFeature />} />

                {/* Sub Admins */}
                {isAdmin ? (
                    <Route exact path="/showSubAdmin" element={<ShowSubAdmin />} />
                ) : (
                    <Route
                        exact
                        path="/showSubAdmin"
                        element={<NotAdminPage />}
                    />
                )}

            </Routes>
        </>
    )
}

export default HomePage
