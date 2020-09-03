console.log('RoamMonkey: loaded')

// If a module is evaluated once, then imported again, it's second evaluation is skipped and the resolved already exports are used.
import "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"
import "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"

window.roamMonkey_appendFile = function(url, attr) {
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
    const els = Array.from(document.getElementsByTagName(tag))
    const duplicates = els.filter(el => el[urlAttr] == url)
    if (duplicates.length > 0) {
        console.log(`RoamMonkey: already exists ${url}`)
        return
    }

    // add file
    attr[urlAttr] = url
    const el = document.createElement(tag)
    Object.assign(el, attr)
    document.head.appendChild(el)
    console.log(`RoamMonkey: appended ${url}`)
}

roamMonkey_init()

async function roamMonkey_init() {
    const packages_list = window.roamMonkey_packages_list.trim().split('\n')

    let packages = await Promise.all(packages_list.map(loadPackage))
    packages = packages.reduce((a, b) => a.concat(b), []) // flatten array
    console.log('packages', packages)

    // load localStorage, go through roamMonkey.packages and overwrite each setting property if it exists in ls
    packages.map(parsePackage) // only if enabled

    async function loadPackage(url) {
        let res = await fetch(url) // fetch is built in on most popular browsers
        let json = await res.json()
        return json.packages //.forEach(pack => packages.push(pack))
    }

    function parsePackage(pack) {
        // check enabled

        if (pack.dependencies) {
            if (typeof pack.dependencies == "string") roamMonkey_appendFile(pack.dependencies)
            else if (Array.isArray(pack.dependencies)) pack.dependencies.map(roamMonkey_appendFile)
        }

        if (pack.source) {
            if (typeof pack.source == "string") roamMonkey_appendFile(pack.source)
            else if (Array.isArray(pack.source)) pack.source.map(roamMonkey_appendFile)
        }

    }

    roamMonkey_initVue(packages)
}

function roamMonkey_wait(condition) {
    return new Promise(resolve => {
        function wait() {
            // console.log(condition())
            if (!condition()) setTimeout(wait, 50)
            else resolve('wait done')
        }
        wait()
    })
}

async function $roamMonkey_appendFile(url, attr) {
    return new Promise(resolve => {
        async function importModule(url) {
            try {
                await import(url)
                return true
            } catch (err) {
                return err
            }
        }

        attr = typeof attr == 'object' && !Array.isArray(attr) ? attr : {} // attr is an optional object containing attributes for <script> and <link>

        const ext = url.split('.').pop() // extension "js" or "css"

        let tag // html tag <script> or <link>
        let urlAttr // attribute that contains url: 'src' for <script> and 'href' for <link>

        if (ext == "js") {
            // try importing as module first
            const result = importModule(url)
            if (result === true) {
                console.log(`RoamMonkey: imported\n${url}`)
                resolve(true)
            } else console.error(`RoamMonkey: import error\n${url}\n${result}`)

            tag = 'script'
            urlAttr = 'src'
            // attr.onload = resolve('script loaded')
        } else if (ext == "css") {
            tag = 'link'
            urlAttr = 'href'
            attr.rel = 'stylesheet'
            attr.type = 'text/css'
        } else {
            alert(`Unhandled file extension: ${ext}`)
            console.log(`RoamMonkey: Unhandled file, not '.js' or '.css' extension\n${url}`)
            return
        }

        // stop if file already exists
        const duplicates = $(tag).filter((i, el) => el[urlAttr] == url)
        if (duplicates.length > 0) {
            console.log(`RoamMonkey: already appended\n${url}`)
            resolve(true)
        }

        // add file
        attr[urlAttr] = url
        attr.onload = function() {
            console.log(`RoamMonkey: appended\n${url}`)
            resolve(true)
        }
        $(`<${tag}>`, attr).appendTo('head')
    })
}

async function roamMonkey_initVue(packages) {
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

    let panel = $( /* html */ `
<div class="bp3-overlay bp3-overlay-open bp3-overlay-scroll-container" v-show="showPanel">
    <div class="bp3-overlay-backdrop bp3-overlay-enter-done" tabindex="0"></div>
    <div class="bp3-card bp3-elevation-4 docs-overlay-example-transition bp3-overlay-content bp3-overlay-enter-done" tabindex="0">
        <h3 class="bp3-heading">I'm an Overlay!</h3>
        <p>This is a simple container with some inline styles to position it on the screen. Its CSS transitions are customized for this example only to demonstrate how easily custom transitions can be implemented.</p>

        <div class="bp3-tabs">
            <ul class="bp3-tab-list" role="tablist">
                <li class="bp3-tab" role="tab" aria-selected="true">Selected tab</li>
                <li class="bp3-tab" role="tab">Another tab</li>
            </ul>
            <div class="bp3-tab-panel" role="tabpanel">Selected panel
                <label class="bp3-control bp3-switch">
                    <input type="checkbox" />
                    <span class="bp3-control-indicator"></span>
                    Switch
                </label>
            </div>
            <div class="bp3-tab-panel" role="tabpanel" aria-hidden="true">Another panel</div>
        </div>

        <p>Click the "Focus button" below to transfer focus to the "Show overlay" trigger button outside of this overlay. If persistent focus is enabled, focus will be constrained to the overlay. Use the <code class="bp3-code">tab</code> key to move to the next focusable element to illustrate this effect.</p>
        <p>Click the "Make me scroll" button below to make this overlay's content really tall, which will make the overlay's container (but not the page) scrollable</p>
        <br>
        <div class="bp3-dialog-footer-actions">
            <button type="button" class="bp3-button bp3-intent-danger">
                <span class="bp3-button-text">Close</span>
            </button>

            <button type="button" class="bp3-button">
                <span class="bp3-button-text">Focus button</span>
            </button>
            
        </div>
    </div>
</div>`)

    searchBar.after(roamMonkey_button)
    roamMonkey_button.append(panel)
    roamMonkey_button.before(divider)

    // start Vue
    window.roamMonkey = new Vue({
        el: '#roamMonkey-app',
        data: {
            showPanel: false,
            packages: packages || []
        },
        computed: {
            // tags: function () {
            //     return articles.reduce
            // }
        },
        methods: {


        },
        mounted() {

        }
    })

}