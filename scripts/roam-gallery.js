/*
 * Viktor's Roam gallery PoC
 * author: @ViktorTabori
 *
 * How to install it:
 *  - go to page [[roam/js]]
 *  - create a node with: {{[[roam/js]]}}
 *  - create a clode block under it, and change its type from clojure to javascript
 *  - allow the running of the javascript on the {{[[roam/js]]}} node
 *  - reload Roam
 *  - click on images
 *  - edit image url on mobile: click top right corner of image
 */
;
(function() {
    var zoom = 3; // level of zoom on svg images

    'click touchstart touchmove touchend'.split(' ').forEach(type => {
        console.log('Roam Gallery: looking for', type);
        document.addEventListener(type, function(e) {
            window._gallery(e);
        });
    });

    window._gallery = function(e) {
        var target = e.target;
        var path = e.path;

        // if PhotoSwipe is not present
        if (typeof PhotoSwipe == 'undefined' || typeof PhotoSwipeUI_Default == 'undefined') return;

        // handle touch moving
        if (e.type == 'touchstart') {
            PhotoSwipe.target = target;
            return;
        }
        if (e.type == 'touchmove') {
            delete PhotoSwipe.target;
            return;
        }
        if (e.type == 'touchend' && !PhotoSwipe.target) return;

        // parse svg
        if (!path) {
            path = [];
            for (var node = target; node && node != document.body; node = node.parentNode) {
                path.push(node);
            }
        }
        var svg = (path.filter(elem => elem.nodeName && elem.nodeName.match(/^svg$/i)) || [undefined])[0];
        svg = path.filter(elem => elem.classList && elem.classList.contains('rm-mermaid')).length && svg || undefined;
        if (svg) {
            svg.naturalWidth = svg.viewBox.baseVal.width * zoom;
            svg.naturalHeight = svg.viewBox.baseVal.height * zoom;
            svg.style = 'background-color:#eee';
            delete svg.src;
            svg.src = 'data:image/svg+xml;base64,' + window.btoa(svg.outerHTML);
            target = svg;
        }

        // only for images and SVGs
        if (!(target.nodeName == 'IMG' && target.classList.contains('rm-inline-img') || svg)) return;

        // 20% top right corner: edit, won't trigger gallery on mobile
        var rect = target.getBoundingClientRect();
        var x = e.pageX - rect.left;
        var y = e.pageY - rect.top;
        console.log('Roam Gallery: ', x, y, x > 0.8 * rect.width && y < 0.2 * rect.height); // top right corner
        if (window.innerWidth < 500 && x > 0.8 * rect.width && y < 0.2 * rect.height) return; // we don't fire for top right corner for mobile

        // prevent click, so editing is not initiated
        console.log('Roam Gallery: ', e.type, target, e);
        e.preventDefault();
        e.stopPropagation();

        // init gallery
        window.pswp = window.pswp || document.querySelector('.pswp');
        var items = [{
            src: target.src,
            msrc: target.src,
            w: target.naturalWidth,
            h: target.naturalHeight
        }];
        var option = {
            history: false,
            index: 0,
            getThumbBoundsFn: function(index) {
                var pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = target.getBoundingClientRect();
                return {
                    x: rect.left,
                    y: rect.top + pageYScroll,
                    w: rect.width
                };
            }
        };
        var gallery = new PhotoSwipe(pswp, PhotoSwipeUI_Default, items, option);
        gallery.init();
    }

    // pswp modal initiate
    if (!document.querySelector('.pswp')) {
        var div = document.createElement('div');
        div.innerHTML = '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"> <div class="pswp__bg"></div> <div class="pswp__scroll-wrap"> <div class="pswp__container"> <div class="pswp__item"></div> <div class="pswp__item"></div> <div class="pswp__item"></div> </div> <div class="pswp__ui pswp__ui--hidden"> <div class="pswp__top-bar"> <div class="pswp__counter"></div> <div class="pswp__preloader"> <div class="pswp__preloader__icn"> <div class="pswp__preloader__cut"> <div class="pswp__preloader__donut"></div> </div> </div> </div> </div> <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"> <div class="pswp__share-tooltip"></div> </div> <div class="pswp__caption"> <div class="pswp__caption__center"></div> </div> </div> </div> </div>';
        document.body.appendChild(div);
    }
})();