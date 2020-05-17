chrome.runtime.onMessage.addListener((req, sender, res) => {
    if (req.target == 'rating') {
        fetch(req.url).then(response => response.json())
            .then(response => {
                response['success'] = true
                res(response)
            })
            .catch(res)
    } else if (req.target == 'details') {
        fetch(req.url).then(response => response.text())
            .then(response => {
                res({ success: true, data: response })
            })
            .catch(res)
    }

    return true;
});