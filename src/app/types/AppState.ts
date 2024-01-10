import { checkLoginInterface } from "../store/checkLogin/checklogininterface";
import { editProductStateInterface } from "../store/editProducts/editProductStateInterface";
import { getUserMessagesInterface } from "../store/getUserMessages/getUserMessages.interface";
import { listProductStateInterface } from "../store/listProduct/list.state";
import { loadingStateInterface } from "../store/loading/loadingStateInterface";
import { LoginStateInterface } from "../store/login/LoginState";
import { productState } from "../store/product/productState";
import { productsState } from "../store/products/productsState";
import { getProductsSummaryInterface } from "../store/productsSummary/productsSummaryInterface";
import { registerState } from "../store/register/registerState";
import { userProductsStateInterface } from "../store/userProducts/userProductsInterface";

export interface AppState{
    loading : loadingStateInterface,
    login : LoginStateInterface,
    register : registerState,
    products : productsState,
    product : productState,
    addProduct : listProductStateInterface,
    userProducts : userProductsStateInterface
    editProduct : editProductStateInterface,
    checkLogin : checkLoginInterface,
    getUserMessages : getUserMessagesInterface,
    getProductsSummary : getProductsSummaryInterface
}