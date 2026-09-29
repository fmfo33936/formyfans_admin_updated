export const endpoints = { 
    adminLogin  : "admin/login",
    // subscription Plans
    subscriptionPlans  : "subscription-plans/fetch",
    // forgot password
    forgotPassword : "admin/forgot-password",
    // verify otp (adjust path if backend differs)
    verifyOtp: "admin/verify-otp",
    // reset password
    resetPassword : "admin/reset-password",
    // dashboard api
    dashboard : "admin/dashboard",
    // user api (query: userType, page, limit)
    getUsers: "admin/users",
    updateUser: "admin/users/:id",
    createCreator: "auth/creators",
    updateUserFreeAccess: "admin/users/:userId/free-access",
    /** PATCH `admin/users/:userId/toggle-activity` — body: `{ status }` */
    updateUserStatus: "admin/users/:userId/toggle-activity",
    // Subscriptions Plans
    updateSubscriptionPlan: "subscription-plans/:id",
    // admin Profile
    getProfile: "admin/profile",
    updateProfile: "admin/profile",
    changePassword: "admin/change-password",
    adminSettings: "admin-settings",
    // products
    createProduct: "products/create",
    getProducts: "products/list",
    updateProduct: "products/:id",
    deleteProduct: "products/:id",
    // get Orders
    getOrders: "orders",
    getOrderById: "orders/:id",
    changeOrderStatus : "admin/orders/:orderId/status",
    // campaign categories
    getCampaignCategories: "campaign-categories",
    createCampaignCategory: "campaign-categories",
    updateCampaignCategory: "campaign-categories/:id",
    deleteCampaignCategory: "campaign-categories/:id",
    // campaign objectives
    getCampaignObjectives: "campaign-objectives",
    createCampaignObjective: "campaign-objectives",
    updateCampaignObjective: "campaign-objectives/:id",
    deleteCampaignObjective: "campaign-objectives/:id",
    // campaigns (admin)
    getAllCampaignsAdmin: "campaigns/admin/all",
    // deals (admin)
    getAllDealsAdmin: "deal/admin/all",
    getDealByIdAdmin: "deal/admin/:dealId",
    verifyIncompleteDeal: "deal/admin/:dealId/verify-incomplete",   
    // upload
    upload: "upload/presigned-url",
    // credits
    creditPricing: "credits/pricing",
}

