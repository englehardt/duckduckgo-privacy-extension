(function setSocialSettings () {
    console.log('injected')

    function waitAndClick(selectors) {
        if (selectors.length === 0) {
            console.log('Clicked all selectors')
            return
        }
        const selector = selectors[0]
        setTimeout(() => {
            // All of the FB elements are in the first iframe on the page
            // we want a fresh reference in the setTimeout because the frames
            // are injected as about:blank and then navigate
            const doc = window.frames[0].document

            const elem = doc.evaluate(selector.xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            
            // If element not found, wait longer
            if (elem === null) {
                waitAndClick(selectors)
                return
            }
            
            // If element meets stopping condition of selector, return
            if (selector.shouldStop(elem)) {
                console.log('selector:', selector.xpath,'stopping condition met')
                return
            }

            // Click the element
            console.log('clicking:', selector.xpath)
            elem.click()

            // Move to the next selector
            selectors.shift()
            waitAndClick(selectors)
        }, 500);
    }

    class Selector {
        constructor(xpath, stoppingCondition) {
            this.xpath = xpath
            this.stoppingCondition = stoppingCondition
        }

        shouldStop(elem) {
            if (this.stoppingCondition === undefined) {
                return false
            }
            return this.stoppingCondition(elem)
        }
    }

    const fbSelectors = [
        new Selector("//span[text()='Manage Your Off-Facebook Activity']"),
        new Selector("//span[text()='Manage Future Activity']"),
        new Selector("//button/div/div[text()='Manage Future Activity']"),
        new Selector("//input", (elem) => {return elem.getAttribute('aria-checked') === "false"}),
        new Selector("//button/div/div[text()='Turn Off']")
    ]
    waitAndClick(fbSelectors)
})()