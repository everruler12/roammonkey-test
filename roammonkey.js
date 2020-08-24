console.log('RoamMonkey: loaded')

if(!window.jQuery) {
  include_script("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js")
}

const package_list = window.roammonkey_package_list.trim().split('\n')

const packages = package_list.forEach(loadPackage.packages)

function loadPackage(url) {
  console.log("RoamMonkey: Getting ", url)
  $.getScript(url, function(data){
      console.log("RoamMonkey: Loaded ", url)
  })
}
