setTimeout(() => {

    // Dont display in iframe
    if (window === window.parent) {
        displayStartup(6000)
    }

    setTimeout(() => {
        if (device.mobile() == false) {
            //these tools don't work well on mobile device
            roamMonkey_appendFile('https://roam42.glitch.me/ext/roam-live-preview.js')
            // roamMonkey_appendFile('https://roam42.glitch.me/ext/dailynotespopup.js')
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

    }, 2000)

}, 5000);