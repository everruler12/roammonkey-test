console.log('RoamMonkey: loaded')

roamMonkey_include("https://cdn.jsdelivr.net/npm/vue/dist/vue.js")

var roammonkey = new Vue({
            el: '#app',
            data: {
                packages: []
            },
            computed: {
                // tags: function () {
                //     return articles.reduce
                // }
            },
            methods: {
                
            },
            mounted() {
                // ls
                roammonkey_include("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js")

                const packages_list = window.roammonkey_packages_list.trim().split('\n')
                // error if doesn't exist
              
                packages_list.forEach(loadPackage)
              
                function loadPackage(url) {
                    const json = $.getJSON(url)
                    console.log("RoamMonkey: getJSON ", jron)
                }

            }
        })

function roamMonkey_include(url) {
    const type = url.split('.').pop() // extension "js" or "css" // or go by ajax header

    if (type == "js") {

        // remove duplicates
        const els = Array.from(document.getElementsByTagName('script'))
        els.filter(el => el.src == url).forEach(el => el.remove())

        // add script
        const el = document.createElement('script')
        el.src = url
        el.async = false
        document.getElementsByTagName('head')[0].appendChild(el)

    } else if (type == "css") {

        // remove duplicates
        const els = Array.from(document.getElementsByTagName('link'))
        els.filter(el => el.href == url).forEach(el => el.remove())

        // add css
        const el = document.createElement('link')
        el.href = url
        el.rel = 'stylesheet'
        el.type = 'text/css'
        el.async = false
        document.getElementsByTagName('head')[0].appendChild(el)

    } else {
        alert(`Unknown type: ${type}`)
    }
}
