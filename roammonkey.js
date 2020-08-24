console.log('RoamMonkey: loaded')

if(!window.jQuery) {
  var s = document.createElement('script')
  s.type = "text/javascript"
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"
  s.async = false
  document.getElementsByTagName('head')[0].appendChild(s)
}

const package_list = window.roammonkey_package_list.trim().split('\n')

const packages = package_list.forEach(loadPackage.packages)

function loadPackage(url) {
  console.log("RoamMonkey: Getting ", url)
  $.getScript(url, function(data){
      console.log("RoamMonkey: Loaded ", url)
  })
}
