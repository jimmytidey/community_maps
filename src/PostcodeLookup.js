
community_map.postcodeLookup = function (postcode, options) {

    // This code uses Nominatim from OpenStreetMaps to reverse geocode postcodes.
    // API is here: http://wiki.openstreetmap.org/wiki/Nominatim
    // Restrictions for use are here: http://wiki.openstreetmap.org/wiki/Nominatim_usage_policy
    //
    // Should figure out if max bandwidth of 1 request/s is acceptable for Lambeth Coop.

    var maps_object = options;

    //remove any current warnings
    jQuery('.warning', maps_object.elem).remove();
   
    
    //specific to brixton !! 
    address_array = postcode.split(' ');

    for(i = 0; i < address_array.length; i++) {
        //test if this is a brixton postcode with spaces missing
        if(address_array[i].length == 6 && (address_array[i].toUpperCase().substr(0, 3) == 'SW2' || address_array[i].toUpperCase().substr(0, 3) == 'SW9')) {
            address_array[i] = address_array[i].slice(0, 3) + " " + address_array[i].slice(3);
        }
    }

    jQuery('.postcode_lookup', maps_object.elem).append('<img src="/sites/all/modules/custom/lambeth_interactive_map/img/loading.gif" class="loading_gif" alt="loading" />');

    postcode = address_array.join(' ');
    postcode = encodeURIComponent(postcode);

    var url = 'http://nominatim.openstreetmap.org/search?format=json&postalcode=' + postcode + '&country=United%20Kingdom&bounded=1&boundingbox="51.417986,51.507918,-0.078743,-0.15216"&json_callback=?';

    var successCallback = function (data) {

        jQuery('.loading_gif', maps_object.elem).remove();
        
        //show the clear search UX
        jQuery('.clear_postcode_search', maps_object.elem).show();
        
        if(typeof data[0] === 'undefined') {
            jQuery('.postcode_lookup', maps_object.elem).append('<p style="display:none" class="warning">No results found</p>');
            jQuery('.warning', maps_object.elem).slideDown('slow').delay(5000).slideUp('slow', function () {
                jQuery('.warning', maps_object.elem).remove();
            });
        } else {
            jQuery('.warning', maps_object.elem).remove();
            maps_object.map.setView([data[0].lat, data[0].lon], 15);
            community_map.hereIAmMarker(data[0].lat, data[0].lon, maps_object);
        }
    };

    jQuery.getJSON(url, successCallback);
};