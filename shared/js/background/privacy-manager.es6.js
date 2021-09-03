const settings = {
    'facebook.com': [
        {
            name: 'off-facebook-activity',
            url: 'https://www.facebook.com/off_facebook_activity',
            selectors: [
                ["//span[text()='Manage Your Off-Facebook Activity']"],
                ["//span[text()='Manage Future Activity']"],
                ["//button/div/div[text()='Manage Future Activity']"],
                ["//input", "(elem) => {return elem.getAttribute('aria-checked') === 'false'}"],
                ["//button/div/div[text()='Turn Off']"]
            ]
        },
    ],
    'example.com': [
    ]
}

function changePrivacySettings(domain) {
    if (!(domain in settings)) {
        console.error('No privacy settings found for', domain)
        return
    }
    settings[domain].forEach((setting) => {
        console.log('Updating setting', setting.name, 'on', domain)
        window.chrome.tabs.create({url: setting.url}, (tab) => {
            chrome.tabs.executeScript(tab.id, {
                file: 'public/js/content-scripts/social-settings.js',
                matchAboutBlank: true,
                runAt: 'document_idle',
            }, () => {
                chrome.tabs.sendMessage(tab.id, setting.selectors)
            })
        })
    })
}

function hasPrivacySettings(domain) {
    return domain in settings
}

module.exports = {
    changePrivacySettings,
    hasPrivacySettings
}