import { AppState } from "../types/AppState";

export const AppInitialState: AppState = {
    loading: {
        isLoading: false
    },
    login: {
        isLogingIn: false,
        isLogedIn: false,
        isLogingInFailure: false,
        message: null
    },
    register: {
        registered: false,
        registering: false,
        registrationFail: false,
        message: null
    },
    products: {
        process: false,
        success: false,
        failure: false,
        products: [],
        message: null,
        filter: false,
        productsAvailable: 0
    },
    product: {
        process: false,
        success: false,
        failure: false,
        product: [],
        message: null,
    },
    addProduct: {
        process: false,
        success: false,
        failure: false,
        message: null,
        productID: null
    },
    userProducts: {
        process: false,
        success: false,
        failure: false,
        message: null,
        products: []
    },
    editProduct: {
        process: false,
        success: false,
        failure: false,
        message: null
    },
    checkLogin: {
        loggedIn: false,
        process: false,
        profile: null
    },
    getUserMessages: {
        process: false,
        success: false,
        fail: false,
        message: null,
        userMessages: [],
        totalUnreadMesages: 0
    },
    getProductsSummary: {
        data: {},
        loading: false,
        message: null,
        success : false,
        failed : false
    }
}