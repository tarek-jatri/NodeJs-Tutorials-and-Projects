function avatarUpload(req, res, next) {
    const upload = uploader({
        "avatars",
        ["image\jpeg","image\jpg","image\png"],
    1000000,
        "Only jpeg jpg or png files are allowed"
    });
}

module.exports = avatarUpload;
