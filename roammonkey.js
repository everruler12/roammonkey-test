console.log('RoamMonkey: loaded')

if (!window.jQuery) {
    roamMonkey_include("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js", {
        onload: function() {
            roammonkey_init()
        }
    })
} else {
    roammonkey_init()
}

function roamMonkey_include(url, options) {
    const type = url.split('.').pop() // extension "js" or "css" // or go by ajax header

    if (type == "js") {

        // remove duplicates
        const els = Array.from(document.getElementsByTagName('script'))
        els.filter(el => el.src == url).forEach(el => el.remove())

        // add script
        const el = document.createElement('script')
        el.src = url
        if (options) Object.assign(el, options)
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
        document.getElementsByTagName('head')[0].appendChild(el)

    } else {
        alert(`Unknown type: ${type}`)
        // continue if error
    }
}

function roammonkey_init() {

    roamMonkey_include("https://cdn.jsdelivr.net/npm/vue/dist/vue.js")
    roamMonkey_include("https://cdnjs.cloudflare.com/ajax/libs/axios/0.20.0/axios.min.js")

    // remove duplicate button
    $('#roammonkey-app').remove()

    const searchBar = $('.rm-find-or-create-wrapper').eq(0)
    const divider = $( /* html */ `<div style="flex: 0 0 4px"></div>`)

    const roammonkey_button = $( /* html */ `
<span id="roammonkey-app" class="bp3-popover-wrapper">
    <span class="bp3-popover-target">
        <span class="bp3-popover-target">
            <button class="bp3-button bp3-minimal bp3-icon-add-to-artifact bp3-small" tabindex="0" @click="click"></button>
        </span>
    </span>
</span>`)

    searchBar.after(roammonkey_button)
    roammonkey_button.before(divider)

    var roammonkey = new Vue({
        el: '#roammonkey-app',
        data: {
            packages: []
        },
        computed: {
            // tags: function () {
            //     return articles.reduce
            // }
        },
        methods: {
            click() {
                this.packages.forEach(this.parsepackage)
                // problem with templating engine running multiple times, even when removed
            },
            parsepackage(package) {
                // check enabled

                if (package.source) {
                    if (typeof package.source == "string") roamMonkey_include(package.source)
                    else if (Array.isArray(package.source)) package.source.forEach(roamMonkey_include)
                }

                if (package.dependencies) {
                    if (typeof package.dependencies == "string") roamMonkey_include(package.dependencies)
                    else if (Array.isArray(package.dependencies)) package.dependencies.forEach(roamMonkey_include)
                }

            }
        },
        mounted() {
            // ls

            const packages_list = window.roammonkey_packages_list.trim().split('\n')
            // error if doesn't exist

            packages_list.forEach(loadPackage)

            function loadPackage(url) {
                axios
                    .get(url)
                    .then(res => {
                        console.log(res.data)
                        res.data.packages.forEach(package => roammonkey.packages.push(package))
                    })
                    .catch(err => console.log(err))
                const json = $.getJSON(url)
                console.log("RoamMonkey: getJSON ", json)
            }

        }
    })


}
