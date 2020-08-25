console.log('RoamMonkey: loaded')

// If a module is evaluated once, then imported again, it's second evaluation is skipped and the resolved already exports are used.
import "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"
import "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"

roamMonkey_init()


function roamMonkey_appendFile(url, attr) {
    attr = typeof attr == 'object' && !Array.isArray(attr) ? attr : {} // attr is an optional object containing attributes for <script> and <link>

    const ext = url.split('.').pop() // extension "js" or "css"

    let tag // html tag <script> or <link>
    let urlAttr // attribute that contains url: 'src' for <script> and 'href' for <link>

    if (ext == "js") {
        tag = 'script'
        urlAttr = 'src'
    } else if (ext == "css") {
        tag = 'link'
        urlAttr = 'href'
        attr.rel = 'stylesheet'
        attr.type = 'text/css'
    } else {
        alert(`Unhandled file extension: ${ext}`)
        console.log(`The file at ${url} does not have '.js' or '.css' extension.`)
        return
    }

    // stop if file already exists
    const duplicates = $(tag).filter((i, el) => el[urlAttr] == url)
    if (duplicates.length > 0) return

    // add file
    attr[urlAttr] = url
    $(`<${tag}>`, attr).appendTo('head')
}


function roamMonkey_init() {
    // remove duplicate button
    $('#roamMonkey-app').remove()

    // add button
    const searchBar = $('.rm-find-or-create-wrapper').eq(0)
    const divider = $( /* html */ `<div style="flex: 0 0 4px"></div>`)

    const roamMonkey_button = $( /* html */ `
<span id="roamMonkey-app" class="bp3-popover-wrapper">
    <span class="bp3-popover-target">
        <span class="bp3-popover-target">
            <button class="bp3-button bp3-minimal bp3-icon-comparison bp3-small" tabindex="0" title="RoamMonkey" @click="showPanel=!showPanel"></button>
        </span>
    </span>
</span>`)

    const panel = $( /* html */ `
<div v-show="showPanel">

</div>`)

    searchBar.after(roamMonkey_button)
    roamMonkey_button.append(panel)
    roamMonkey_button.before(divider)

    // start Vue
    window.roamMonkey = new Vue({
        el: '#roamMonkey-app',
        data: {
            showPanel: false,
            packages: []
        },
        computed: {
            // tags: function () {
            //     return articles.reduce
            // }
        },
        methods: {
            click() {

            },
            parsepackage(pack) {
                // check enabled

                if (pack.dependencies) {
                    if (typeof pack.dependencies == "string") roamMonkey_appendFile(pack.dependencies)
                    else if (Array.isArray(pack.dependencies)) pack.dependencies.forEach(roamMonkey_appendFile)
                }

                if (pack.source) {
                    if (typeof pack.source == "string") roamMonkey_appendFile(pack.source)
                    else if (Array.isArray(pack.source)) pack.source.forEach(roamMonkey_appendFile)
                }

            }
        },
        mounted() {
            const packages_list = window.roamMonkey_packages_list.trim().split('\n')
            // error if doesn't exist

            packages_list.forEach(loadPackage)

            function loadPackage(url) {
                // fetch is built in on most popular browsers
                fetch(url)
                    .then(res => res.json())
                    .then((data) => {
                        console.log("RoamMonkey: getJSON ", data)
                        data.packages.forEach(pack => roamMonkey.packages.push(pack))
                        // load localStorage, go through roamMonkey.packages and overwrite each setting property if it exists in ls
                        roamMonkey.packages.forEach(roamMonkey.parsepackage) // if enabled
                    })
            }

        }
    })

}