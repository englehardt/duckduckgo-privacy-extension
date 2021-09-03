const Parent = require('./sliding-subview.es6.js')
const manager = require('./../../background/privacy-manager.es6')

function PrivacyManager (ops) {
    this.model = ops.model
    this.template = ops.template

    Parent.call(this, ops)
    this._setup()
}

PrivacyManager.prototype = window.$.extend({},
    Parent.prototype,
    {
        _setup: function () {
            this._cacheElems('.js-privacy-manager', [
                'run'
            ])

            this.bindEvents([
                [this.$run, 'click', this._onRunClick]
            ])
        },

        _onRunClick: function () {
            chrome.runtime.sendMessage({
                changePrivacySettings: this.model.domain
            })
        }
    }
)

module.exports = PrivacyManager
