console.log('RoamMonkey: loaded')

function init() {
  if(!window.jQuery) {
    include_script("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js")
  }

  const packages_list = window.roammonkey_packages_list.trim().split('\n')
  // error if doesn't exist

  console.log('RoamMonkey: packages_list \n', packages_list)

  const packages = packages_list.forEach(loadPackage)

  function loadPackage(url) {
    console.log("RoamMonkey: Getting ", url)
    $.get(url, function(data){
        console.log("RoamMonkey: Loaded ", url)
    })
  }
}

init()
