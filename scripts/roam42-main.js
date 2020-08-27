// from https://roam42.glitch.me/message-s.js

const displayStartup = (delayTime) => {
    iziToast.show({
        message: `
      <b>Roam42 Starting . . .</b>
      <p></p>
      <table>
        <tr><td>Altâ€“Shiftâ€“H </td><td>&nbsp</td><td>Roam42 Help</td></tr>
        <tr><td>Ctrlâ€“Shiftâ€“H</td><td>&nbsp</td><td>Quick Reference</td></tr>
      </table>
      <p></p>
      <div style='font-size:7pt'>marvin.2020-08-23</div>
    `.trim(),
        theme: 'dark',
        progressBar: true,
        animateInside: true,
        close: false,
        timeout: delayTime,
        closeOnClick: true,
        displayMode: 2
    });
}

//from https://roam42.glitch.me/main.js

setTimeout(() => {

    // Dont display in iframe
    if (window === window.parent) {
        displayStartup(6000)
    }

    setTimeout(() => {
        if (device.mobile() == false) {
            //these tools don't work well on mobile device
            // roamMonkey_appendFile('https://roam42.glitch.me/ext/roam-live-preview.js')
            roamMonkey_appendFile('https://roam42.glitch.me/ext/dailynotespopup.js')
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