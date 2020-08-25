window.roamMonkey_packages_list = `
https://roammonkey-test.vercel.app/roam_packages/roam_packages(ViktorTabori).json

`

appendScript("https://roammonkey-test.vercel.app/roammonkey.js")

function appendScript(url) {
  // refresh if roam/js script is stopped then restarted)
  const els = Array.from(document.getElementsByTagName('script'))
  const duplicates = els.filter(el => el.src.match('roammonkey.js'))
  if (duplicates.length > 0) { // wait for Roam to sync, then refresh (to prevent "unsaved changes" popup)
    function refreshAfterSync() {
      const syncing = document.getElementsByClassName('rm-saving-remote').length
      if (syncing) setTimeout(refreshAfterSync, 50)
      else location.reload(true) // refresh page
    }
    setTimeout(refreshAfterSync, 100)
    return
  }

  // append script
  let s = document.createElement('script')
  s.src = url
  s.type = "module"
  document.head.appendChild(s)
}