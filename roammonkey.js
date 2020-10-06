// Using imports to prevent duplicates and to wait for jQuery to initialize before continuing
import "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"
import "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"
// maybe import only if not detected

(function() {
    // Checks to stop execution of whole script
    if (!!navigator.userAgent.match('Headless')) { // stop if roam-to-git
        // This will prevent loading other scripts if Roam is being fetched for an automatic backup
        console.log('RoamMonkey: Headless user agent detected. Stopped script.')
        return
    } else if ($('script[src$="/roammonkey.js"]').length > 1) { // RoamMonkey is duplicated
        // Every time a roam/js block is started or stopped, all other roam/js blocks are reloaded. But script isn't run if already appended?
        // This detects whether RoamMonkey is already loaded, and will prevent further execution if duplicated.
        console.log('RoamMonkey: already loaded. Please refresh the page to load again.')
        return
    } else {
        console.log('RoamMonkey: loaded')
    }



    window.roamMonkey = (function() { // shared functions

        function appendFile(url, attr) {
            // function appendFile(url, {
            //     attr,
            //     wait
            // }) {
            // change imports to normal loading, and add shared function of waiting for script to load with my waiting function
            // maybe pass object to append file with props: url (which can also be a string without other settings), attr, ext (to use in case url doesn't end with extension), wait (which is an object containing condition funciton, optional timeout settings with defaults)

            // if (wait) {
            //     ({
            //         condition, // function
            //         timeoutStep, // optional positive integer, default 50
            //         timeoutLimit //optional positive integer, default 1000
            //     } = wait)
            // }

            // function typeIsObjNotArr(test) {
            //     return typeof test == 'object' && !Array.isArray(test)
            // }

            // url must end with .js or .css
            // attr is an optional object containing attributes for <script> and <link>
            // wait is a delay for a condition

            attr = typeof attr == 'object' && !Array.isArray(attr) ? attr : {}

            const ext = url.split('.').pop() // extension "js" or "css"

            let tag // html tag <script> or <link>
            let urlAttr // attribute that will contain url: 'src' for <script> and 'href' for <link>

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
            const duplicate = !!els.find(el => el[urlAttr] == url)
            if (duplicate) {
                console.log(`RoamMonkey: already exists, not appended ${url}`)
                return
            }

            // add file
            attr[urlAttr] = url
            const el = document.createElement(tag)
            Object.assign(el, attr)
            document.head.appendChild(el)
            console.log(`RoamMonkey: appended ${url}`)
        }

        function refresh() {
            function refreshAfterSync() {
                const isSyncing = document.getElementsByClassName('rm-saving-remote').length
                if (isSyncing) setTimeout(refreshAfterSync, 50)
                else location.reload() // refresh page
            }
            setTimeout(refreshAfterSync, 100)
        }

        return {
            appendFile,
            refresh
        }
    })()



    new Vue({
        data: {
            VUE_APP_NAME: 'roamMonkeyVue',
            titleOfSettingsPage: 'RoamMonkey/settings',
            registry_link: 'https://roammonkey-test.vercel.app/roammonkey_registry.json',
            registry_packages: [],
            settings: [],
            showPanel: false,
            panel_tab: 'Scripts',
        },

        computed: {
            VUE_APP_ID() {
                return this.VUE_APP_NAME + '-app'
            },


        },

        destroyed() {
            console.log(this.VUE_APP_NAME + ': destroyed')
            // remove mounted Vue app el
            const appEl = $('#' + this.VUE_APP_ID)
            appEl.prev('div').remove() // divider
            appEl.remove()
        },

        created() {
            // console.log(this.VUE_APP_NAME + ': created')
            const appName = this.VUE_APP_NAME
            if (!!window[appName]) // already exists
                window[appName].$destroy() // what about when other roam/js loaded? Keep refresh in this roam/js?

            window[appName] = this // to test in DevTools
            this.mountVueApp()
        },

        mounted() {
            console.log(this.VUE_APP_NAME + ': mounted')
            this.loadRegistry()
        },

        methods: {
            mountVueApp() {
                const appId = this.VUE_APP_ID
                const searchBar = $('.rm-find-or-create-wrapper').eq(0)
                const divider = $( /* html */ `<div style="flex: 0 0 4px"></div>`)

                const appEl = $( /* html */ `
<span id="${appId}" class="bp3-popover-wrapper">
    <span class="bp3-popover-target">
        <span class="bp3-popover-target">
            <button class="bp3-button bp3-minimal bp3-icon-comparison bp3-small" tabindex="0" title="RoamMonkey" @click="showPanel=!showPanel"></button>
        </span>
    </span>
</span>`)

                const panel = $( /* html */ `
<div class="bp3-overlay bp3-overlay-open bp3-overlay-scroll-container" v-show="showPanel" style="margin: 250px;">
    <div class="bp3-overlay-backdrop bp3-overlay-enter-done" tabindex="0"></div>
    <div class="bp3-card bp3-elevation-4 bp3-overlay-content bp3-overlay-enter-done" tabindex="0" style="width: 100%; background-color: black;">
        <div class="bp3-tabs">
            <ul class="bp3-tab-list">
                <li class="bp3-tab" role="tab" @click="panel_tab = 'Scripts'" :aria-hidden="panel_tab != 'Scripts'" :aria-selected="panel_tab == 'Scripts'">Scripts</li>
                <li class="bp3-tab" role="tab" @click="panel_tab = 'Placeholder'" :aria-hidden="panel_tab != 'Placeholder'" :aria-selected="panel_tab == 'Placeholder'">Placeholder</li>
            </ul>

            <div class="bp3-tab-panel" v-show="panel_tab == 'Scripts'" style="text-align: left;">
                <h3 class="bp3-heading">RoamMonkey Scripts</h3>
                
                <label class="bp3-control bp3-switch" v-for="pack in registry_packages">
                    <input type="checkbox" v-model="pack.enabled"/>
                    <span class="bp3-control-indicator"></span>
                    {{pack.name}}
                </label>
            </div>

            <div class="bp3-tab-panel" v-show="panel_tab == 'Placeholder'">
                <h3 class="bp3-heading">Placeholder</h3>
            </div>
        </div>
        <br>
        <div class="bp3-dialog-footer-actions">
            <button type="button" class="bp3-button bp3-intent-danger" @click="showPanel=false">
                <span class="bp3-button-text">Close</span>
            </button>
            <button type="button" class="bp3-button bp3-intent-success" @click="save">
                <span class="bp3-button-text">Save & Refresh</span>
            </button>
        </div>
    </div>
</div>`)

                searchBar.after(appEl)
                appEl.append(panel)
                appEl.before(divider)
                this.$mount('#' + appId)
            },

            async loadRegistry() {
                this.loadLocalStorage()

                let _this = this
                let res = await fetch(this.registry_link) // fetch is built in on most popular browsers
                let registry = await res.json()
                // console.log(this.VUE_APP_NAME + ': registry', registry)

                // add enabled setting to registry
                this.registry_packages = registry.packages.map(pack => {
                    ls = _this.settings.find(x => x.id == pack.id)
                    pack.enabled = ls ? ls.enabled : false
                    return pack
                })

                this.loadScripts()
            },

            async loadScripts() {
                function loadDependencies(dependencies) {
                    if (typeof pack.dependencies == "string") roamMonkey.appendFile(pack.dependencies)
                    else if (Array.isArray(pack.dependencies)) pack.dependencies.map(roamMonkey.appendFile)
                }

                this.registry_packages.map(pack => {
                    if (pack.enabled) {
                        if (pack.dependencies) {
                            loadDependencies(pack.dependencies)
                        }

                        roamMonkey.appendFile(pack.src)
                    }
                })

                // const loadScript = (pack) => {
                // check enabled



                // if (pack.src) {
                //     if (typeof pack.src == "string") roamMonkey.appendFile(pack.src)
                //     else if (Array.isArray(pack.src)) pack.src.map(roamMonkey.appendFile)
                // }

                // }

                // roam_packages.packages.forEach(loadScript)

                // load localStorage, go through this.packages and overwrite each setting property if it exists in ls
                // roam_packages.forEach(loadScript) // only if enabled
            },

            save() {
                this.settings = this.registry_packages.map(pack => {
                    return {
                        id: pack.id,
                        enabled: pack.enabled
                    }
                })

                window.localStorage.roamMonkey = JSON.stringify(this.settings)

                roamMonkey.refresh()
            },



            loadLocalStorage() {
                this.settings = localStorage.roamMonkey ? JSON.parse(localStorage.roamMonkey) : []
            },

            loadSettingsFromPage() {
                function returnIdOfPageTitle(title) {
                    const nodeId = window.roamAlphaAPI.q("[:find ?e :in $ ?a :where [?e :node/title ?a]]", title)

                    if (nodeId.length) {
                        return nodeId[0][0]
                    } else {
                        console.log(this.VUE_APP_NAME + `: Error! [[${title}]] not found`)
                        return false
                    }
                }

                const titleId = returnIdOfPageTitle(this.titleOfSettingsPage)

                if (!titleId) {
                    alert('Error! No settings page found')
                    return
                }

                const titleNode = window.roamAlphaAPI.pull("[*]", titleId)

                if (!titleNode) {
                    alert('Error! No settings page found')
                    return
                }

                // for backup purposes, go to settings page
                // const blockUid = titleNode[":block/uid"]
                // settings_page = 'https://roamresearch.com/#/app/everruler/page/' + blockUid
                // window.location = settings_page

                const titleChildren = titleNode[":block/children"]

                if (titleChildren.length > 1) {
                    alert(`Error! There should only be one block on RoamMonkey/settings, but there are ${titleChildren.length} blocks`)
                    return
                }

                const firstChildId = titleChildren[0][":db/id"]
                const firstChildNode = window.roamAlphaAPI.pull("[*]", firstChildId)
                const firstChildContent = firstChildNode[":block/string"]
                // console.log(blockString)
                const settings_str = firstChildContent.replace(/^\u0060\u0060\u0060javascript/, '').replace(/\u0060\u0060\u0060$/, '') // \u0060 is backtick: `

                try {
                    return JSON.parse(settings_str)
                } catch (err) {
                    console.log(this.VUE_APP_NAME + `: ${settings_str} is not valid json`)
                    alert('Error! Content of first block in RoamMonkey/settings is not valid json')
                    return false
                }
            }

        },



    })
})()




// on panel, have one tab for pacakage registry, which lists all packages, with the option to add to ac, then on list tab, each have toggle, option to delete
// Need to sync between PC and mobile! way to save list in roam instead of local storage?
// have option to sync ls and settings in cloud, based on cutomer number and database name
// ls needs to cache scripts, so can be used offline

// have way to export ls to json, which can be saved in ```javascript block, then copy block reference to settings
// block ref on first block on [[roamMonkey/settings]] page

//live preview, open url with ?roamMonkey=true
//roammonkey detect url change, and when ?roamMonkey=true query exists, focus on textarea and change the value, then unfocus to save