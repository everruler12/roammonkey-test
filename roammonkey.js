const package_list = window.roammonkey_package_list.trim().split('\n')

const packages = package_list.forEach(loadPackage)

function loadPackage(url) {
  console.log(url)
  fetch(url)
    .then(res => res.json())
    .then((out) => {
      console.log(out)
    })
    .catch(err => { throw err })
}
