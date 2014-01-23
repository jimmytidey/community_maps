

community_map.drawMap = function (options) {

    //add container for everything to live in 
    jQuery(options.elem).append("<div class='outside_container'></div>");

    //do we need to render a control panel? 
    if(options.searchType || options.postcode_search === 'true') {

        //move the main map over 
        jQuery('.outside_container', options.elem).addClass("map_with_controls");

        //add control panel 
        var html = '<div class="controls_container"></div>';
        jQuery(".outside_container", options.elem).append(html);
    }

    //container for map / list view
    jQuery('.outside_container', options.elem).append("<div class='display_container'></div>");

    //add list and maps into the container
    var html = "<div class='view_tabs' > <a class='map_view_tab selected_tab' tabindex='0' >Map View</a>  <a class='list_view_tab' tabindex='0'>Text View</a> </div>";
    html += '<div class="list_container"></div>';
    html += '<div class="leaflet_container"></div>';
    jQuery(".display_container", options.elem).append(html);

    community_map.changeViewEvents(options);

    //Render postcode search if necessary 
    if(options.postcode_search === 'true') {
        community_map.renderPostcodeLookup(options);
    }

    //add container for the fixed layer key - this needs to end up at the top
    html = '<div class="fixed_layer_key"><div>';
    jQuery('.controls_container', options.elem).append(html);

    //init that map
    options.map = L.map(jQuery('.leaflet_container', options.elem)[0], {
        scrollWheelZoom: false
    }).setView([options.lat, options.lng], options.zoom);

    //using the cloudmade tiles
    L.tileLayer('http://{s}.tile.cloudmade.com/e7b61e61295a44a5b319ca0bd3150890/997/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors | Imagery &copy <a href="http://cloudmade.com/">CloudMade</a>'
    }).addTo(options.map);

    //show the boundry of the community area
    community_map.getJSON(options.outline_url, options, community_map.renderOutline);
   
    // Add a spinner until main geoJSON payload has transferred and rendered 
    var spinnerHtml = '<img class="key_spinner" src="http://lambeth.coop/sites/all/modules/custom/lambeth_interactive_map/img/loading.gif" />';
    jQuery('.controls_container', options.elem).append(spinnerHtml);
 
    //get the json and then call the discover types function on it
    community_map.getJSON(options.url, options, community_map.discoverTypes);

    if(options.fixed_layer_url) {
        community_map.getJSON(options.fixed_layer_url, options, community_map.addFixedLayer);
    }

    // Check to see if default view is set to list and change views
    if (options.defaultView === "list") {
        jQuery('.list_view_tab', options.elem).click();
    }
};


community_map.changeViewEvents = function (options) {
    
    var maps_object = options;
    
    // Bind click event for button to select map view
    jQuery('.map_view_tab', maps_object.elem).click(function () {
        jQuery('.leaflet_container', maps_object.elem).show();
        jQuery('.map_view_tab', maps_object.elem).addClass('selected_tab');

        jQuery('.list_container', maps_object.elem).hide();
        jQuery('.list_view_tab', maps_object.elem).removeClass('selected_tab');

        jQuery('.postcode_input', maps_object.elem).attr('disabled', false);
        jQuery('.postcode_lookup', maps_object.elem).show();

        // Leaflet needs to measure container's size to work correctly
        maps_object.map.invalidateSize();
    });

    // Bind keyboard event (enter) for button to select map view
    jQuery('.map_view_tab', maps_object.elem).keypress(function (event) {

        if (event.which !== 13) {
            return;
        }

        jQuery('.leaflet_container', maps_object.elem).show();
        jQuery('.map_view_tab', maps_object.elem).addClass('selected_tab');

        jQuery('.list_container', maps_object.elem).hide();
        jQuery('.list_view_tab', maps_object.elem).removeClass('selected_tab');

        jQuery('.postcode_input', maps_object.elem).attr('disabled', false);
        jQuery('.postcode_lookup', maps_object.elem).show();
    });

    // Bind click event for button to select list view
    jQuery('.list_view_tab', maps_object.elem).click(function () {

        if(jQuery('.list_container', maps_object.elem).text() === "") {
            jQuery('.list_container', maps_object.elem).html("<p class='list_view_empty_warning' >You don't have any pins selected</p>");
        }

        jQuery('.list_container', maps_object.elem).show();
        jQuery('.list_view_tab', maps_object.elem).addClass('selected_tab');

        jQuery('.leaflet_container', maps_object.elem).hide();
        jQuery('.map_view_tab', maps_object.elem).removeClass('selected_tab');

        jQuery('.postcode_input', maps_object.elem).attr('disabled', true);
        jQuery('.postcode_lookup', maps_object.elem).hide();
    });

    // Bind keyboard event (enter) to select list view
    jQuery('.list_view_tab', maps_object.elem).keypress(function (event) {

        if (event.which !== 13) {
            return;
        }

        if(jQuery('.list_container', maps_object.elem).text() === "") {
            jQuery('.list_container', maps_object.elem).html("<p class='list_view_empty_warning' >You don't have any pins selected</p>");
        }

        jQuery('.list_container', maps_object.elem).show();
        jQuery('.list_view_tab', maps_object.elem).addClass('selected_tab');

        jQuery('.leaflet_container', maps_object.elem).hide();
        jQuery('.map_view_tab', maps_object.elem).removeClass('selected_tab');

        jQuery('.postcode_input', maps_object.elem).attr('disabled', true);
        jQuery('.postcode_lookup', maps_object.elem).hide();
    });
};


community_map.renderDropDown = function(options) {

    var maps_object = options;

    //add the selector HTML 
    //TODO add proper id connection between dropdown and label 
    var html = '<label class="drop_down_label">Search by waste item</label><select class="type_selector"></selector>';
    jQuery('.controls_container', maps_object.elem).append(html);

    jQuery.each(maps_object.types, function (key, value) {
        jQuery('.type_selector', maps_object.elem).append("<option value='" + key + "'>" + value.name + "</option>");
    });

    //ensure there are no events stuck on this element
    jQuery('.type_selector', maps_object.elem).unbind();
    jQuery('.type_selector', maps_object.elem).change(function () {
        community_map.removeAllLayers(maps_object);
        var key = jQuery(this).val();
        community_map.addLayer(parseInt(key), maps_object);
        community_map.sortListItems(maps_object);
    });
};


community_map.renderAutoSuggest = function (options) {

    var maps_object = options;

    var html = '<div class="autosuggest">Where can I get rid of... </span><input type="text" class="type_suggest" /></div>';

    jQuery('.controls_container', this.elem).append(html);

    jQuery('.type_suggest', this.elem).autocomplete({
        source: maps_object.types,
        change: function (event, ui) {
            layer_id = ui.item.key; //dunno if this will work 
            maps_object.addLayer(layer_id);
            community_map.sortListItems(maps_object);
        },
        select: function (event, ui) {
            layer_id = ui.item.key; //dunno if this will work 
            maps_object.addLayer(layer_id);
            community_map.sortListItems(maps_object);
        }
    });
};


community_map.renderKey = function (options) {

    var maps_object = options;

    //add the selector HTML
    var html = "<div class='key'></div>";
    jQuery('.controls_container', maps_object.elem).append(html);

    jQuery.each(maps_object.types, function (key, value) {
        var img_url = value.icon_url;
        var html = "<div class='key_item individual_layer' >";
            html += "<img alt='' src='" + img_url + "' /><label for='checkbox_" + value.name + "'>" + value.name + " (" + value.count  + ")</label><input  id='checkbox_" + value.name + "' type='checkbox' value='" + key + "' />";
            html += "<div class='key_divider clearfix'></div></div>";
        jQuery('.key', maps_object.elem).append(html);
    });
    
    if(maps_object.types.length > 2) {  
        var html = "<div class='key_item all_values' >";
            html += "<label for='checkbox_all'>All ("+ maps_object.data.features.length +")</label><input id='checkbox_all' type='checkbox' value='all' />";
            html += "<div class='key_divider clearfix'></div></div>";
            html += "<p class='only_show_label'>Only show: </p>";
        jQuery('.key', maps_object.elem).prepend(html);
    }

    //make the first set selected 
    if(maps_object.types.length == 1) {
        community_map.addLayer(0, maps_object);
        jQuery('.key_item input:first', maps_object.elem).attr('checked', 'checked');
        community_map.sortListItems(maps_object);
    }

    //ensure there are no events stuck on this element
    jQuery('.key_item input', maps_object.elem).unbind();
    
    jQuery('.individual_layer input', maps_object.elem).change(function () {
        
        
        
        //remove 'all layers' checkbox if it's selected  
        if(jQuery('.all_values input', maps_object.elem).prop('checked')) {
            jQuery('.all_values input', maps_object.elem).removeAttr('checked');
            community_map.removeAllLayers(maps_object);
        }
        
        var key = jQuery(this).val();
        
        if(jQuery(this).is(':checked')) {
            community_map.addLayer(parseInt(key),maps_object);
            community_map.sortListItems(maps_object);
        } else {
            community_map.removeLayer(parseInt(key),maps_object);
        }
    });
    
    jQuery('.all_values input', maps_object.elem).unbind();
    
    jQuery('.all_values input', maps_object.elem).change(function() {
                
        //remove all checkboxes on the other inputs 
        jQuery('.individual_layer input', maps_object.elem).removeAttr('checked');
        
        if(jQuery(this).is(':checked')) {
            community_map.addAllLayers(maps_object);
            community_map.sortListItems(maps_object);
        } else {
            community_map.removeAllLayers(maps_object);
        }
    });

    jQuery('.all_values input', maps_object.elem).trigger('click');
};


community_map.renderPostcodeLookup = function (options) {

    var maps_object = options;

    var html = '<div class="postcode_lookup"><label for="map_search_by_location">Search by location: </label><input type="text" placeholder="postcode or address" class="postcode_input" id="map_search_by_location"  /><input type="button" class="postcode_submit" alt="search map" /><a class="clear_postcode_search">&raquo; Clear search</a></div>';

    jQuery('.controls_container', maps_object.elem).append(html);

    community_map.addPlaceholder();

    jQuery('.postcode_submit', maps_object.elem).click(function () {
        var val = jQuery('.postcode_input', maps_object.elem).val();
        community_map.postcodeLookup(val, maps_object);
    });
    
    jQuery('.clear_postcode_search', this.elem).click(function () {
        var val = jQuery('.postcode_input', maps_object.elem).val();
        community_map.clearPostcodeLookup(val, maps_object);
    });

    jQuery('.postcode_input', this.elem).keyup('enterKey', function (e) {
        if(e.keyCode === 13) {
            var val = jQuery('.postcode_input', maps_object.elem).val();
            community_map.postcodeLookup(val, maps_object);
        }
    });
};


community_map.clearPostcodeLookup = function (val, options) {
    jQuery('.postcode_input', options.elem).val('');
    options.map.setView([options.lat, options.lng], options.zoom);
    jQuery('.clear_postcode_search', options.elem).hide();
    community_map.removeHereIAmMarker(options);
};



