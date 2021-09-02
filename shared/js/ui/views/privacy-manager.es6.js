const Parent = require('./sliding-subview.es6.js')
const browserUIWrapper = require('./../base/ui-wrapper.es6.js')

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
                'details',
                'run'
            ])

            this.bindEvents([
                [this.$run, 'click', this._onRunClick]
            ])
        },

        _onRunClick: function () {
            browserUIWrapper.openNewTab('https://www.facebook.com/off_facebook_activity')
        }
    }
)

module.exports = PrivacyManager
