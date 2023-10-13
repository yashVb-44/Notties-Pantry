const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path')
const CategoryRoute = require('./Routes/BackendSide/Category/category_route')
const SubCategoryRoute = require('./Routes/BackendSide/SubCategory/sub_category_route')
const BannerRoute = require('./Routes/BackendSide/Banner/banner_route')
const ProductRoute = require('./Routes/BackendSide/Product/product_route')
const VariationRoute = require('./Routes/BackendSide/Product/variation_route')
const DataRoute = require('./Routes/BackendSide/Data/data_route')
const UserRoute = require('./Routes/FrontendSide/User/users_route')
const CartRoute = require('./Routes/FrontendSide/Cart/cart_route')
const NotifyRoute = require('./Routes/BackendSide/Product/notifly_route')
const ChargesRoute = require('./Routes/Settings/Charges/add_charges_route')
const ProductFeaturesRoute = require('./Routes/BackendSide/Product/product_features_route')
const AddressRoute = require('./Routes/FrontendSide/User/address_route')
const WishList = require('./Routes/BackendSide/Product/wish_list_route')
const OrderRoute = require('./Routes/FrontendSide/Order/order_route')
const ResellerRoute = require('./Routes/FrontendSide/User/reseller_route')
const MemberShipRoute = require('./Routes/BackendSide/MemberShip/membership_route')
const MemberShipHistoryRoute = require('./Routes/BackendSide/MemberShip/memberShipHistory_route')
const WalletRoute = require('./Routes/FrontendSide/Wallet/wallet_route')
const CouponRoute = require('./Routes/FrontendSide/Coupon/coupon_route')
const SettingsRoute = require('./Routes/Settings/General/general_settings_route')
const ReviewRoute = require('./Routes/FrontendSide/Review/review_route')
const CoinsRoute = require('./Routes/FrontendSide/Coins/coins_route')
const SearchRoute = require('./Routes/BackendSide/Product/search_route')
const NewsRoute = require('./Routes/BackendSide/News/news_route')
const ShippingRoute = require('./Routes/BackendSide/Shipping/shipping_route')
const RequirementRoute = require('./Routes/FrontendSide/Requirement&Support/post_requirement_route')
const CustomerSupportRoute = require('./Routes/FrontendSide/CustomerSupport/customer_support')
const NottiflyRoute = require('./Routes/BackendSide/Notifly/notifly_route')
const PostVideoRoute = require('./Routes/BackendSide/PostVideo/postvideo_route')
const HomeFeaturesRoute = require('./Routes/BackendSide/HomeFeatures/homeFeature_route')
const processOrderResponse = require('./Routes/FrontendSide/Order/cron_job_route')

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(express.static('static'))

mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB: ', error);
    });



// const port = process.env.PORT;
const port = process.env.PORT;
const ipAddress = process.env.IP_ADDRESS;

app.use("/imageUploads", express.static("imageUploads"));
app.use("/videoUploads", express.static("videoUploads"));

app.use("/uploads", express.static("uploads"));

app.use("/category", CategoryRoute)
app.use("/sub_category", SubCategoryRoute)
app.use("/banner", BannerRoute)
app.use("/product", ProductRoute)
app.use("/product/variation", VariationRoute)
app.use("/product/notify", NotifyRoute)
app.use("/data", DataRoute)
app.use('/user', UserRoute)
app.use('/news', NewsRoute)
app.use('/cart', CartRoute)
// app.use('/charges', ChargesRoute)
app.use('/feature/product', ProductFeaturesRoute)
app.use('/address', AddressRoute)
app.use('/wishlist', WishList)
app.use('/order', OrderRoute)
// app.use('/reseller', ResellerRoute)
// app.use('/memberShip', MemberShipRoute)
// app.use('/memberShip/history', MemberShipHistoryRoute)
app.use('/wallet/history', WalletRoute)
app.use('/coupon', CouponRoute)
app.use('/app/settings', SettingsRoute)
app.use('/review', ReviewRoute)
app.use('/coins/history', CoinsRoute)
app.use('/search', SearchRoute)
app.use('/shippingCharge', ShippingRoute)
app.use('/requirement', RequirementRoute)
app.use('/feedback', CustomerSupportRoute)
app.use('/nottifly', NottiflyRoute)
app.use('/postVideo', PostVideoRoute)
app.use('/homeFeatures', HomeFeaturesRoute)

// app.listen(port, ipAddress, () => {
//     console.log(`Server listening on ${ipAddress}:${port}`);
// })

app.get("*", (req, res) => {
    const indexPath = path.join(__dirname, 'static', 'index.html')
    res.sendFile(indexPath)
})

app.listen(1234, () => {
    console.log(`Server listening on ${ipAddress}:${port}`);
});
