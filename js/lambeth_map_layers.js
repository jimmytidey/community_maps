

community_map.addListItem = function (feature, options) {
    var html = "<div class='list_item type_" + feature.properties.type_id + "'><div class='list_left_column'><h2>" + feature.properties.name + "</h2><p class='list_item_description'>" + feature.properties.description + "</p></div><div class='list_right_column'></div> <br class='clearfix'/></div >";
    jQuery('.list_container', options.elem).append(html);
}

community_map.addLayer = function (type_id, options) {
    console.log('adding layer');
    var maps_object = options;

    //test to ensure this layer isn't already added 
    if (!maps_object.point_layers[type_id]) {
         console.log('layer is not already added');
        maps_object.point_layers[type_id] = L.geoJson(maps_object.data, {
            onEachFeature: function (feature, layer) { //layer here refering to leaflets internal concept of layer        
                console.log(feature);
                if(layer.setIcon && maps_object.types[feature.properties.type_id].icon) {
                    var icon = layer.setIcon(maps_object.types[feature.properties.type_id].icon);
                    layer.options.title = feature.properties.name.replace(/(<([^>]+)>)/ig, "");
                    layer.options.alt = feature.properties.name.replace(/(<([^>]+)>)/ig, "");
                }
            
                if (feature.properties.nothing_rendered) {
                    layer.bindPopup(feature.properties.nothing_rendered);
                } else {
                    layer.bindPopup(feature.properties.name); 
                }
            
                //add list item 
                community_map.addListItem(feature, maps_object);
            },
            filter: function (feature) {
                if(feature.properties.type_id == type_id) {
                    return true;
                } else {
                    return false;
                }
            }
        }).addTo(maps_object.map);
    }    
};



community_map.addAllLayers = function (options) {
    for(var i=0; i<this.types.length; i++) { 
        this.addLayer(i, options); 
    }
};

community_map.addFixedLayer = function (data, options) {

    options.fixed_layer_data = data;
    
    var maps_object = options;

    //add new stuff
    maps_object.fixed_layer = L.geoJson(maps_object.fixed_layer_data, {
        onEachFeature: function (feature, leaflet_layer) {
     
            var icon = L.icon({
                iconUrl: feature.properties.uri_rendered,
                iconSize: [39, 50],
                iconAnchor: [19, 50],
                popupAnchor: [0, -50]
            });

            if(feature.properties.uri_rendered) {
                leaflet_layer.setIcon(icon);    
                leaflet_layer.options.alt = feature.properties.name.replace(/(<([^>]+)>)/ig, "");
            }
            
            leaflet_layer.bindPopup(feature.properties.name);
        }
    }).addTo(maps_object.map);

    var img_url = maps_object.fixed_layer_data.features[0].properties.uri_rendered;
    
    var html = "<div class='key_item' ><img src='" + img_url + "' /><p>" + maps_object.fixed_layer_data.features[0].properties.name.replace(/(<([^>]+)>)/ig, "") + "</p></div>";
   
    jQuery('.fixed_layer_key', maps_object.elem).append(html);
};

community_map.removeLayer = function (type_id, options) {
    options.map.removeLayer(options.point_layers[type_id]);
    options.point_layers[type_id] = null; 
};

community_map.removeAllLayers = function (options) {

    var maps_object = this;

    jQuery.each(this.point_layers, function (key, val) {
        if(typeof val !== 'undefined') {
            maps_object.map.removeLayer(val, options);
        }
    });

    jQuery('.list_container', options.elem).empty();
};



community_map.hereIAmMarker = function (lat, lon) {
    if(this.hereMarker) {
        this.map.removeLayer(this.hereMarker);
    } //remove icon if it's in the wrong place
    var hereIcon = new L.icon({
        iconUrl: '/sites/all/modules/custom/lambeth_interactive_map/img/here_i_am.png'
    });
    
    this.hereMarker = L.marker([lat, lon], {
        icon: hereIcon
    }).addTo(this.map);
};

community_map.renderOutline = function () {

    var maps_object = this;

    //style the outline - may want to customise this
    this.outline_style = {
        "color": "#004a86",
        fillColor: "#fff",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.3
    };

    //draws the outline of lambeth
    jQuery.getJSON(this.outline_url, function (data) {
        maps_object.outline = data;
        L.geoJson(maps_object.outline, {
            style: maps_object.outline_style
        }).addTo(maps_object.map);
    });
};
