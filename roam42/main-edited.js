// Give the libraries a few seconds to get comfy in their new home 
// and then let the extension dance, that is to say,
// begin initializing the environment with all the cool tools
setTimeout(function() {

    if (device.mobile() == false) {
        //these tools don't work well on mobile device
        // roamMonkey_appendFile('https://roammonkey-test.vercel.app/roam42/ext/roam-live-preview.js') // reloads roam/js, causing roamMonkey to reload, and duplicates templatepoc
        roamMonkey_appendFile('https://roammonkey-test.vercel.app/roam42/ext/dailynotespopup.js')
    }

    // Dont display in iframe
    if (window === window.parent) {
        displayStartup(5000)
    }

    loadKeyEvents()

    try {
        loadTypeAhead()
    } catch (e) {}

    try {
        jumpToDateComponent.initialize()
    } catch (e) {}

    try {
        rmQuickRefenceSystem.initialize()
    } catch (e) {}

}, 3000);