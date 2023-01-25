export const apiURL: any = {
    // login: 'login',
    login: {
        otp:'auth/send-otp',
        verifyOtp:'auth/verify-otp'

    },
    getUserData: 'manageusers/',
    notifications:'notifications',
    //Profile
    profile:{
        base:'listofusers/',
        data:'firstbuyers/object'
    },

    //DASHBOARD
    dashboard: {
        dash: 'dashboard',
        iotData:'dashboard/iotdata',
        stations:'dashboard/stations'
        
    },
    wallet: {
        dash:'wallet/dashboard',
        create:'wallet/create-order',
        verify:'wallet/verify-payment'
    },
    fcmUpdate:"fcm-token",
    reports:'reports'

}