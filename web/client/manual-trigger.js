function createUpLoader () {
    var manualUploader = new qq.FineUploader({
        element: document.getElementById('fine-uploader-manual-trigger'),
        template: 'qq-template-manual-trigger',
        request: {
            endpoint: '/uploads'
        //method: 'GET' // Only for the gh-pages demo website due to Github Pages limitations
    },
    thumbnails: {
        placeholders: {
            waitingPath: 'client/placeholders/waiting-generic.png',
            notAvailablePath: 'client/placeholders/not_available-generic.png'
        }
    },
    autoUpload: true,
    debug: true
    });

}

window.onload = createUpLoader;
