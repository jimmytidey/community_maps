window.community_map = {};
    
(function($, window, undefined) {
    
    $.widget('custom.community_map', {
        
        _create: function () {
            //containers for data from the JSON 
            this.options.types          = [];
            this.options.icons          = [];
            this.options.point_layers   = [];

            //settings for the widget -- these will be over-ridden if the user passes in options
            this.options.outline_url    = this.element.attr('data-map-outline-url'),
            this.options.url            = this.element.attr('data-map-url'), //URL for geoJSON
            this.options.fixed_layer_url= this.element.attr('data-map-fixed-layer-url'),
            this.options.filterField    = this.element.attr('data-map-filter-on'), // Field used for dropdown/lookup
            this.options.zoom           = parseInt(this.element.attr('data-map-zoom')), //Map Zoom
            this.options.centre         = this.element.attr('data-map-centre').split(','), //Map Centre
            this.options.lat            = parseFloat(this.options.centre[0]),
            this.options.lng            = parseFloat(this.options.centre[1]),
            this.options.postcode_search= this.element.attr('data-map-postcode-search'),
            this.options.searchType     = this.element.attr('data-map-search-type'),
            this.options.elem           = this.element,
            this.options.defaultView    = community_map.defaultMapView();
            
            //outline style is for the boundry around the local area,if you are using it... 
            this.options.outline_style = {
                "color": "#004a86",
                fillColor: "#fff",
                weight: 3,
                opacity: 1,
                fillOpacity: 0.3
            };
            
            // console.log(this.options);
            community_map.drawMap(this.options);
        }
    });
    
}(jQuery,window));


//UTILITY FUNCTIONS 
if (!Array.prototype.filter) {
  Array.prototype.filter = function (fn, context) {
    var i,
        value,
        result = [],
        length;

        if (!this || typeof fn !== 'function' || (fn instanceof RegExp)) {
          throw new TypeError();
        }

        length = this.length;

        for (i = 0; i < length; i++) {
          if (this.hasOwnProperty(i)) {
            value = this[i];
            if (fn.call(context, value, i, this)) {
              result.push(value);
            }
          }
        }
    return result;
  };
}


community_map.htmlDecode = function (input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

community_map.addPlaceholder = function () {
    if(typeof Modernizr === 'undefined') {

        jQuery('[placeholder]').focus(function () {
            var input = jQuery(this);
            if(input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function () {
            var input = jQuery(this);
            if(input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur();
        jQuery('[placeholder]').parents('form').submit(function () {
            jQuery(this).find('[placeholder]').each(function () {
                var input = jQuery(this);
                if(input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            })
        });
    }
}


community_map.sameOrigin = function(url){
    var link = document.createElement("a");
    link.href = url;

    return ((link.protocol + link.host) === window.location.protocol + window.location.host);
}

community_map.defaultMapView = function () {

    // Looks in window url for argument 'mapView=list'. 
    // If found, returns 'list', else returns 'map'.
    var currentLocation = window.location.search;

    if (!currentLocation) {
        return "map";
    }
    
    var argArray = currentLocation.split("?")[1].split("&");

    for (var i = 0, arrayLength = argArray.length; i < arrayLength; i += 1) {

        var argPair = argArray[i].split('=');
        if (argPair[0] === "mapView" && argPair[1] === "list") {
            return "list";
        }
    }

    return "map";
}
    
