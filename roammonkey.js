console.log('RoamMonkey: loaded')

// if(!window.jQuery)
roammonkey_include("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js")
roamMonkey_include("https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.12/vue.min.js")
roamMonkey_include("https://cdnjs.cloudflare.com/ajax/libs/axios/0.20.0/axios.min.js")

$( /* html */ `
<div id="#roammonkey-app" style="align-items: center;
max-height: calc(100vh - 50px);
color: white;
bottom: 4px;
transition: all 200ms ease-in 0s;
background-color: rgb(47, 52, 55);
width: 36px;cursor: pointer;
justify-content: center;
display: flex;
position: fixed;
border-radius: 25px;
height: 36px;
background: transparent !important;
right: 50px !important;
bottom: 10px !important;
z-index: 2;
flex-direction: column;"><span class="bp3-popover-wrapper">
        <span class="bp3-popover-target">
            <button class="bp3-button bp3-minimal" tabindex="0" style="border-radius: 25px;">
                <span class="bp3-icon-large bp3-icon-help">
                </span>
            </button>
        </span>
    </span>
</div>`).appendTo('body')

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
                })
                .catch(err => console.log(err))
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
