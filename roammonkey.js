console.log('RoamMonkey: loaded')

if(!window.jQuery) {
  include_script("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js")
}

const packages_list = window.roammonkey_package_list.trim().split('\n')

console.log('RoamMonkey: packages_list \n', packages_list)

const packages = packages_list.forEach(loadPackage)

function loadPackage(url) {
  console.log("RoamMonkey: Getting ", url)
  $.get(url, function(data){
      console.log("RoamMonkey: Loaded ", url)
  })
}
