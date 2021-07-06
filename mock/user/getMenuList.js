export default Mock => {
    Mock.mock(
        /\/user\/menu/,
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
