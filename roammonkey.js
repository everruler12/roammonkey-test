// Using imports to prevent duplicates and to wait for jQuery to initialize before continuing
import "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"
import "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"

console.log('RoamMonkey: loaded')

if (window.roamMonkey) window.roamMonkey.$destroy() // what about when other roam/js loaded? Keep refresh in this roam/js?

window.roamMonkey = new Vue({
    data: {
        appId: 'roamMonkey-app',
        package_registry_link: 'https://roammonkey-test.vercel.app/roam_packages/roam_package_registry.json',
        // package_registry: [
        //     'https://roammonkey-test.vercel.app/roam_packages(ViktorTabori).json',
        //     'https://roammonkey-test.vercel.app/roam_packages(roamhacker).json'
        // ],
        package_registry: [],
        showPanel: false,
        panel_tab: "Scripts"

    },

    computed: {
        // tags: function () {
        //     return articles.reduce
        // }
    },

    methods: {
        appendFile(url, attr) {
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
                console.log(`RoamMonkey: already exists, not appended ${url}`)
                return
            }

            // add file
            attr[urlAttr] = url
            const el = document.createElement(tag)
            Object.assign(el, attr)
            document.head.appendChild(el)
            console.log(`RoamMonkey: appended ${url}`)
        },

        refresh() {
            function refreshAfterSync() {
                const syncing = document.getElementsByClassName('rm-saving-remote').length
                if (syncing) setTimeout(refreshAfterSync, 50)
                else location.reload(true) // refresh page
            }
            setTimeout(refreshAfterSync, 100)
        }

    },
    mounted() {
        console.log('RoamMonkey: mounted')
    },

    destroyed() {
        const appEl = $(`#${roamMonkey.appId}`)
        appEl.prev('div').remove() // divider
        appEl.remove()
    },

    async created() {
        async function loadPackage(url) {
            let res = await fetch(url) // fetch is built in on most popular browsers
            let json = await res.json()
            return json.packages //.forEach(pack => packages.push(pack))
        }

        function parsePackage(pack) {
            // check enabled

            if (pack.dependencies) {
                if (typeof pack.dependencies == "string") roamMonkey.appendFile(pack.dependencies)
                else if (Array.isArray(pack.dependencies)) pack.dependencies.map(roamMonkey.appendFile)
            }

            if (pack.source) {
                if (typeof pack.source == "string") roamMonkey.appendFile(pack.source)
                else if (Array.isArray(pack.source)) pack.source.map(roamMonkey.appendFile)
            }

        }

        let packages = await loadPackage(roamMonkey.package_registry_link)
        // let packages = await Promise.all(roamMonkey.package_registry.map(loadPackage))
        console.log('packages', packages)
        packages = packages.reduce((a, b) => a.concat(b), []) // flatten array
        roamMonkey.package_registry = packages

        // load localStorage, go through roamMonkey.packages and overwrite each setting property if it exists in ls
        packages.forEach(parsePackage) // only if enabled


        // mount button
        const searchBar = $('.rm-find-or-create-wrapper').eq(0)
        const divider = $( /* html */ `<div style="flex: 0 0 4px"></div>`)

        const roamMonkey_button = $( /* html */ `
<span id="${roamMonkey.appId}" class="bp3-popover-wrapper">
<span class="bp3-popover-target">
    <span class="bp3-popover-target">
        <button class="bp3-button bp3-minimal bp3-icon-comparison bp3-small" tabindex="0" title="RoamMonkey" @click="showPanel=!showPanel"></button>
    </span>
</span>
</span>`)

        const panel = $( /* html */ `
<div class="bp3-overlay bp3-overlay-open bp3-overlay-scroll-container" v-show="showPanel" style="margin: 250px;">
<div class="bp3-overlay-backdrop bp3-overlay-enter-done" tabindex="0"></div>
<div class="bp3-card bp3-elevation-4 bp3-overlay-content bp3-overlay-enter-done" tabindex="0" style="width: 100%;">
    <div class="bp3-tabs">
        <ul class="bp3-tab-list">
            <li class="bp3-tab" role="tab" @click="panel_tab = 'Scripts'" :aria-hidden="panel_tab != 'Scripts'" :aria-selected="panel_tab == 'Scripts'">Scripts</li>
            <li class="bp3-tab" role="tab" @click="panel_tab = 'Packages'" :aria-hidden="panel_tab != 'Packages'" :aria-selected="panel_tab == 'Packages'">Packages</li>
        </ul>

        <div class="bp3-tab-panel" v-show="panel_tab == 'Scripts'">
            <h3 class="bp3-heading">Scripts</h3>
        
            <label class="bp3-control bp3-switch">
                <input type="checkbox"/>
                <span class="bp3-control-indicator"></span>
                Viktor Tabori's Roam Gallery and Roam Templates
            </label>

            <label class="bp3-control bp3-switch">
                <input type="checkbox"/>
                <span class="bp3-control-indicator"></span>
                roam42
            </label>
        </div>

        <div class="bp3-tab-panel" v-show="panel_tab == 'Packages'">
            <h3 class="bp3-heading">Packages</h3>

            <div v-for="package in package_registry">
                <input :value="package" style="width: 100%;">
                <br>
            </div>
        </div>
    </div>

    <br>
    <div class="bp3-dialog-footer-actions">
        <button type="button" class="bp3-button bp3-intent-danger" @click="showPanel=false">
            <span class="bp3-button-text">Close</span>
        </button>

        <button type="button" class="bp3-button bp3-intent-success"  @click="refresh">
            <span class="bp3-button-text">Save & Refresh</span>
        </button>
        
    </div>
</div>
</div>`)

        searchBar.after(roamMonkey_button)
        roamMonkey_button.append(panel)
        roamMonkey_button.before(divider)
        this.$mount(`#${roamMonkey.appId}`)
    }
})

// on panel, have one tab for pacakage registry, which lists all packages, with the option to add to ac, then on list tab, each have toggle, option to delete
// Need to sync between PC and mobile! way to save list in roam instead of local storage?
// have option to sync ls and settings in cloud, based on cutomer number and database name
// ls needs to cache scripts, so can be used offline

// have way to export ls to json, which can be saved in ```javascript block, then copy block reference to settings
// block ref on first block on [[roamMonkey/settings]] page


// nodeId = window.roamAlphaAPI.q("[:find ?e :in $ ?a :where [?e :node/title ?a]]", 'RoamMonkey/settings')
// dbId = window.roamAlphaAPI.pull("[*]", nodeId[0][0])[":block/children"][0][":db/id"]
// node = window.roamAlphaAPI.pull("[*]", dbId)[":block/string"]
// settings = JSON.parse(node.replace(/^```javascript/,'').replace(/```$/,''))