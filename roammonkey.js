console.log('RoamMonkey: loaded')

// If a module is evaluated once, then imported again, it's second evaluation is skipped and the resolved already exports are used.
import "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"
import "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"

roammonkey_init()

function roamMonkey_include(url, opt) {
    const type = url.split('.').pop() // extension "js" or "css" // or go by ajax header

    let tag
    let urlAttr
    opt = typeof opt == 'object' ? opt : {}

    if (type == "js") {
        tag = 'script'
        urlAttr = 'src'

    } else if (type == "css") {
        tag = 'link'
        urlAttr = 'href'

        Object.assign(opt, {
            rel: 'stylesheet',
            type: 'text/css'
        })

    } else {
        alert(`Unknown type: ${type}`)
        // continue loading other files if error
        return
    }

    // skip if duplicate
    const els = Array.from(document.getElementsByTagName(tag))
    const duplicates = els.filter(el => el[urlAttr] == url)
    if (duplicates.length > 0) return

    // add file
    const el = document.createElement(tag)
    el[urlAttr] = url
    Object.assign(el, opt)
    document.head.appendChild(el)
}

function roammonkey_init() {
    // remove duplicate button
    $('#roammonkey-app').remove()

    // add button
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

    // start Vue
    window.roammonkey = new Vue({
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
                alert('parsed packages')
                // problem with templating engine running multiple times, even when removed
            },
            parsepackage(pack) {
                // check enabled

                if (pack.dependencies) {
                    if (typeof pack.dependencies == "string") roamMonkey_include(pack.dependencies)
                    else if (Array.isArray(pack.dependencies)) pack.dependencies.forEach(roamMonkey_include)
                }

                if (pack.source) {
                    if (typeof pack.source == "string") roamMonkey_include(pack.source)
                    else if (Array.isArray(pack.source)) pack.source.forEach(roamMonkey_include)
                }

            }
        },
        mounted() {
            const packages_list = window.roammonkey_packages_list.trim().split('\n')
            // error if doesn't exist

            packages_list.forEach(loadPackage)

            function loadPackage(url) {
                // fetch is built in on most popular browsers
                fetch(url)
                    .then(res => res.json())
                    .then((data) => {
                        console.log("RoamMonkey: getJSON ", data)
                        data.packages.forEach(pack => roammonkey.packages.push(pack))
                        // load localStorage, go through roammonkey.packages and overwrite each setting property if it exists in ls
                    })
            }

        }
    })

}