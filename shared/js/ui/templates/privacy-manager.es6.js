const bel = require('bel')
const hero = require('./shared/hero.es6.js')

module.exports = function () {
    const domain = this.model && this.model.domain

    return bel`<section class="sliding-subview sliding-subview--has-fixed-header">
    <div class="privacy-manager site-info site-info--full-height card">
    <div class="js-privacy-manager-hero">
        ${hero({
            status: 'null',
            title: domain,
            showClose: true
        })}
        </div>
        <div class="privacy-manager__details padded
            js-privacy-manager-details">
             The DuckDuckGo Privacy Manager will automatically set the
             recommended privacy settings for this site. The site may
             ask you to confirm your password before changing settings.
        </div>
        <div class="text--center">
            <btn class="js-privacy-manager-run site-info__privacy-manager-run btn-pill">
            Manage Privacy Settings
            </btn>
        </div>
    </div>
</section>`
}
