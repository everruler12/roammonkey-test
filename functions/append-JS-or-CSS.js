function appendFile(url, attr) {
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
        console.log(`already exists ${url}`)
        return
    }

    // add file
    attr[urlAttr] = url
    const el = document.createElement(tag)
    Object.assign(el, attr)
    document.head.appendChild(el)
    console.log(`appended ${url}`)
}