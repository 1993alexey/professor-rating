chrome.runtime.onMessage.addListener((req, sender, res) => {
    fetch(req.url, req.options).then(response => response.json())
    .then(response => {
        response['success'] = true
        res(response)
    })
    .catch(console.log)

    return true;
});