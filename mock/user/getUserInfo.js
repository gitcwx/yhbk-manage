export default Mock => {
    Mock.mock(
        process.env.VUE_APP_axiosDefaultsBaseURL + '/user/info',
        'post',
        options => {
            return {
                code: '00',
                msg: 'success',
                data: [

                ]
            }
        }
    )
}
