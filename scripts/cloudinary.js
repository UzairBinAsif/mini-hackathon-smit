const uploadImage = async (formData) => {
    const url = "https://api.cloudinary.com/v1_1/dk7lxxn4e/image/upload"
    const req = await fetch(url, {
        method: 'POST',
        body: formData,
    })
    const res = await req.json()
    const {secure_url} = res
    return secure_url
}

export {uploadImage}