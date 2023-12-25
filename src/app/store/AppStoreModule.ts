import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { loginEffects } from "./login/login.effects";
import { loginReducers } from "./login/login.reducers";
import { registerReducers } from "./register/register.reducers";
import { registerEffects } from "./register/register.effects";
import { productsReducers } from "./products/products.reducers";
import { ProductsEffect } from "./products/products.effects";
import { ProductEffect } from "./product/product.effects";
import { productReducers } from "./product/product.reducers";
import { listProductReducers } from "./listProduct/list.reducers";
import { listProductEffect } from "./listProduct/list.effects";
import { userProductsReducers } from "./userProducts/userProducts.reducers";
import { userProductsEffects } from "./userProducts/userProducts.effects";
import { editProductReducers } from "./editProducts/editProductState.reducers";
import { editProductEffect } from "./editProducts/editProductState.effects";
import { checkLoginReducers } from "./checkLogin/checklogin.reducers";
import { checkLoginEffect } from "./checkLogin/checklogin.effects";
import { getUserMessagesEffects } from "./getUserMessages/getUserMessages.effects";
import { getuserMessagesReducers } from "./getUserMessages/getUserMessages.reducers";
import { productsSummaryReducer } from "./productsSummary/productsSummary.reducers";
import { productsSummaryEffect } from "./productsSummary/productsSummary.effects";

export const AppStoreModule = [
    StoreModule.forRoot({}, {}),
    StoreModule.forFeature("login",loginReducers),
    StoreModule.forFeature("register",registerReducers),
    StoreModule.forFeature("products",productsReducers),
    StoreModule.forFeature("product",productReducers),
    StoreModule.forFeature("addProduct",listProductReducers),
    StoreModule.forFeature("userProducts",userProductsReducers),
    StoreModule.forFeature("editProduct",editProductReducers),
    StoreModule.forFeature("checkLogin",checkLoginReducers),
    StoreModule.forFeature("getUserMessages",getuserMessagesReducers),
    StoreModule.forFeature("getProductsSummary",productsSummaryReducer),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([
        loginEffects,
        registerEffects,
        ProductsEffect,
        ProductEffect,
        listProductEffect,
        userProductsEffects,
        editProductEffect,
        checkLoginEffect,
        getUserMessagesEffects,
        productsSummaryEffect
    ])
]