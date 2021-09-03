(function setSocialSettings () {
    console.log('injected')

    class Selector {
        constructor(documentString, xpath, stoppingCondition, shouldEndSequence) {
            this.documentString = documentString
            this.xpath = xpath
            this.stoppingCondition = eval(stoppingCondition)
            this.shouldEndSequence = shouldEndSequence !== undefined ? shouldEndSequence : false
        }

        get document() {
            return eval(this.documentString)
        }

        shouldStop(elem) {
            return this.shouldEndSequence && this.shouldSkip(elem)
        }

        shouldSkip(elem) {
            if (this.stoppingCondition === undefined) {
                return false
            }
            return this.stoppingCondition(elem)
        }
    }

    function waitAndClick(selectors, onCompleteCallback) {
        if (selectors.length === 0) {
            console.log('Clicked all selectors')

            // Some settings take a moment to apply
            setTimeout(() => {
                onCompleteCallback('success')
            }, 1000)

            return
        }
        const selector = selectors[0]
        setTimeout(() => {
            console.log('Looking for', selector.xpath)

            const doc = selector.document
            const elem = doc.evaluate(selector.xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            
            // If element not found, wait longer
            if (elem === null) {
                waitAndClick(selectors, onCompleteCallback)
                return
            }
            
            // If element meets stopping condition of selector, return
            if (selector.shouldStop(elem)) {
                console.log('selector:', selector.xpath,'stopping condition met')
                onCompleteCallback('already-set')
                return
            }

            if (!selector.shouldSkip(elem)) {
                // Click the element
                console.log('clicking:', selector.xpath)
                elem.click()
            }

            // Move to the next selector
            selectors.shift()
            waitAndClick(selectors, onCompleteCallback)
        }, 500);
    }

    chrome.runtime.onMessage.addListener((message, sender, callback) => {
        const selectors = message.map(arr => new Selector(...arr))
        waitAndClick(selectors, callback)
        return true
      });
})()