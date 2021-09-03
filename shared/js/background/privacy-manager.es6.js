const settings = {
    'facebook.com': [
        {
            name: 'off-facebook-activity',
            url: 'https://www.facebook.com/off_facebook_activity',
            selectors: [
                [
                    "window.frames[0].document",
                    "//span[text()='Manage Your Off-Facebook Activity']"
                ],
                [
                    "window.frames[0].document",
                    "//span[text()='Manage Future Activity']"
                ],
                [
                    "window.frames[0].document",
                    "//button/div/div[text()='Manage Future Activity']"
                ],
                [
                    "window.frames[0].document",
                    "//input",
                    "(elem) => {return elem.getAttribute('aria-checked') === 'false'}",
                    true // if stopping condition met, stop rest of sequence
                ],
                [
                    "window.frames[0].document",
                    "//button/div/div[text()='Turn Off']"
                ]
            ]
        },
        {
            name: 'partner-activity',
            url: 'https://www.facebook.com/adpreferences/ad_settings',
            selectors: [
                [
                    "document",
                    "//span[text()='Data about your activity from partners']"
                ],
                [
                    "document",
                    "//div[div/div/div/span[text()='Use Data from Partners']]//following-sibling::div//input",
                    "(elem) => {return elem.getAttribute('aria-checked') === 'false'}"
                ]
            ]
        },
        {
            name: 'manage-ad-topics',
            url: 'https://www.facebook.com/adpreferences/ad_topics',
            selectors: [
                [
                    "document",
                    "//div[div/div/div/span[text()='Alcohol']]//following-sibling::div//span",
                    "(elem) => { return elem.textContent === 'You\\'re seeing fewer ads about this topic' }"
                ],
                [
                    "document",
                    "//div[div/div/div/span[text()='Parenting']]//following-sibling::div//span",
                    "(elem) => { return elem.textContent === 'You\\'re seeing fewer ads about this topic' }"
                ],
                [
                    "document",
                    "//div[div/div/div/span[text()='Pets']]//following-sibling::div//span",
                    "(elem) => { return elem.textContent === 'You\\'re seeing fewer ads about this topic' }"
                ],
                [
                    "document",
                    "//div[div/div/div/span[text()='Social Issues, Elections or Politics']]//following-sibling::div//span",
                    "(elem) => { return elem.textContent === 'You\\'re seeing fewer ads about this topic' }"
                ]
            ]
        }
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
                chrome.tabs.sendMessage(tab.id, setting.selectors, (resp) => {
                    console.log('Content script finished! Status:', resp)
                    chrome.tabs.remove(tab.id)
                })
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