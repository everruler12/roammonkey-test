- ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Feverruler%2FQg1pEXJNSm.png?alt=media&token=ba211be3-c15a-4e71-a9da-6d9b0a27c318)
- https://github.com/everruler12/roammonkey-test
- {{[[roam/js]]}}
    - ```javascript
window.roammonkey_packages_list = `
https://roammonkey-test.vercel.app/roam_packages(ViktorTabori).json

`

function include_script(url) {
    // check for duplicates
    const scripts = Array.from(document.getElementsByTagName('script'))
    const duplicates = scripts.filter(s => s.src == url)
    if (duplicates.length > 0) {
      setTimeout(function() {
        location.reload(true) // refresh page
        duplicates.forEach(s => s.remove()) // remove duplicates if not refreshed
      }, 1000) // timeout to try and prevent "unsaved changes" popup
    }
  
    // add script
    var script = document.createElement('script')
    script.src = url
    script.type="module"
    document.getElementsByTagName('head')[0].appendChild(script)
}

include_script("https://roammonkey-test.vercel.app/roammonkey.js")```
- 