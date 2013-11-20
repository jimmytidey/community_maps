

community_map.addListItem = function (feature, options) {
    
    console.log('feature in add list item: ', feature);
      
    var html = "<div class='list_item type_" + feature.properties.type_id + "'>";
        html+= "<img src='" + feature.properties.uri_rendered + "' class='list_view_icon' />";
        if (feature.properties.nothing_rendered) {
            html += feature.properties.nothing_rendered;
        } else {
            html += feature.properties.name; 
        }
        
    html+= "<br class='clearfix'/></div >";  
    
    jQuery('.list_container', options.elem).append(html);
}

community_map.addLayer = function (type_id, options) {
    
    var maps_object = options;

    //test to ensure this layer isn't already added 
    if (!maps_object.point_layers[type_id]) {
         
        maps_object.point_layers[type_id] = L.geoJson(maps_object.data, {
            onEachFeature: function (feature, layer) { //layer here refering to leaflets internal concept of layer        
                
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
    for(var i=0; i<options.types.length; i++) { 
        community_map.addListItem(i, options); 
    }
};


community_map.addAllListItems = function (options) {
    console.log("stuff passed in to add all list items ",  options);
    for(var i=0; i<options.types.length; i++) { 
        community_map.addListItem(options.data.features[i], options); 
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
            
            community_map.addListItem(feature, maps_object);
            
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
    
    var maps_object = options;
    
    for(var i=0; i<maps_object.types.length; i++) { 
        if(maps_object.types[i] !== 'undefined') {
             
            community_map.removeLayer(i, maps_object);
        }
    };

    jQuery('.list_container', maps_object.elem).empty();
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
