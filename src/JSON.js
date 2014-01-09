community_map.getJSON = function (url, options, callback) {
        
    if(!community_map.sameOrigin(url)) {
        url = url + "?callback=?";
    }

    var successCallback = function (geoJsonObject) {

        // filters out any null features, which can cause problems down the line
        if (geoJsonObject.features) {
            geoJsonObject.features = geoJsonObject.features.filter(function (n) {
                return n;
            });
        }

        // Run callback function on geoJSONobject
        callback(geoJsonObject, options);
    };
    
    jQuery.getJSON(url, successCallback);
}



community_map.discoverTypes = function (geoJsonObject, options) {
    
    //List every type of feature in the geo JSON
    options.data = geoJsonObject;
    
    var options = options;

    jQuery.each(options.data.features, function (key, value) {
                
        //test - do we already have this in the output array ?
        var add_to_types_array = true;

        for(var i = 0; i < options.types.length; i++) {

            if(value.properties[options.filterField] == options.types[i].name) {
                add_to_types_array = false;
            }
        }

        //if it wasn't found it the types array, add it in 
        if(add_to_types_array) {
            var type_name = value.properties[options.filterField];
            if(type_name !== '' && type_name !== null) {

                var custom_icon,
                    icon_url;     

                //add new icon if one is available
                if(value.properties.uri_rendered) {

                    custom_icon = L.icon({
                        iconUrl: value.properties.uri_rendered,
                        Size: [32, 32],
                        iconAnchor: [16, 32],
                        popupAnchor: [0, -32]
                    });

                    icon_url = value.properties.uri_rendered;

                } else {
                    // icon = null;
                    // icon_url = null;

                    // Leaflet gets the default icon from the location of the leaflet.js file.
                    // In the recycling.html test in the repo where this JS is stored:
                    // https://github.com/jimmytidey/community_maps
                    // This is the leafletjs.com repo. 
                    // 
                    // In Drupal, something is borked.
                    // So the hacky fix is to specify a custom icon for the default icon.
                    // 
                    // TODO:Find the root cause and fix it.
                    custom_icon = L.icon({
                        iconUrl: 'http://lambeth.coop/sites/default/files/pin_green.png',
                        Size: [32, 32],
                        iconAnchor: [16, 32],
                        popupAnchor: [0, -32]
                    });

                    icon_url = 'http://lambeth.coop/sites/default/files/pin_green.png';
                }

                options.types.push({
                    icon: custom_icon,
                    name: type_name,
                    icon_url: icon_url,
                    count: 0
                });
            }
        }
    });

    //order the types alphabetically 
    community_map.sortTypes(options);

    //add types to the data 
    community_map.addTypesToFeatures(options);

    // If spinner exists, remove it
    var spinner = jQuery('.key_spinner', options.elem);

    if (spinner) {
        spinner.remove();
    }

    //render the right UX
    if(options.searchType == 'drop-down') {
        community_map.renderDropDown(options);
    } else if(options.searchType == 'auto-suggest') {
        community_map.renderAutoSuggest(options);
    } else if(options.searchType == 'key') {
        community_map.renderKey(options);
    }
    
}




community_map.addTypesToFeatures = function (options) {

    var options = options;

    jQuery.each(options.data.features, function (key, value) {

        var type_index = null;

        for(var i = 0; i < options.types.length; i++) {
            if(value.properties[options.filterField] == options.types[i].name) {
                value.properties.type_id = i;
                options.types[i].count ++;
            }
        }
    });
}


//this puts the types in alphabetical order... could check a flag in options and sort on a different basis
community_map.sortTypes = function (options) {
    options.types.sort(function (a, b) {
        var nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase();
            if(nameA < nameB) { //sort string ascending
                return -1;
            }
        if(nameA > nameB) {
            return 1;
        }
        return 0; //default return value (no sorting)
    });
}