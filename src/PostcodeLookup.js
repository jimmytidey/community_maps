
community_map.postcodeLookup = function (postcode, options) {

    // This code uses Nominatim from OpenStreetMaps to reverse geocode postcodes.
    // API is here: http://wiki.openstreetmap.org/wiki/Nominatim
    // Restrictions for use are here: http://wiki.openstreetmap.org/wiki/Nominatim_usage_policy
    //
    // Should figure out if max bandwidth of 1 request/s is acceptable for Lambeth Coop.

    var maps_object = options;

    //remove any current warnings
    jQuery('.warning', maps_object.elem).remove();
   
    /* OLD CODE

    //specific to brixton !! 
    address_array = postcode.split(' ');

    for(i = 0; i < address_array.length; i++) {
        //test if this is a brixton postcode with spaces missing
        if(address_array[i].length == 6 && (address_array[i].toUpperCase().substr(0, 3) == 'SW2' || address_array[i].toUpperCase().substr(0, 3) == 'SW9')) {
            address_array[i] = address_array[i].slice(0, 3) + " " + address_array[i].slice(3);
        }
    }

    */

    // Allow for postcodes entered without a space - works with all of London
    var addressArray = postcode.split(' ');

    // (1) Trim any trailing spaces
    if (addressArray[addressArray.length - 1] === "") {
        addressArray = addressArray.slice(0, addressArray.length - 1);
    }

    // (3) If postcode is not well formated, the reformat it.
    //     UK postcodes have an inward code (last element) that is always 1 digit and 2 chars.
    //     The remaining chars are the postcode
    if (addressArray.length === 1) {
        var outward,
            inward,
            firstElement = addressArray[0];

        inward = firstElement.slice(-3);
        outward = firstElement.slice(0, firstElement.length - 3);

        addressArray = [outward, inward];
    }

    jQuery('.postcode_lookup', maps_object.elem).append('<img src="/sites/all/modules/custom/lambeth_interactive_map/img/loading.gif" class="loading_gif" alt="loading" />');

    postcode = addressArray.join(' ');
    postcode = encodeURIComponent(postcode);

    // OSM Nominatim reverse geocoding
    // var url = 'http://nominatim.openstreetmap.org/search?format=json&q=' + postcode + '&countrycodes=gb&bounded=1&boundingbox="51.417986,51.507918,-0.078743,-0.15216"&json_callback=?';
    var url = 'http://nominatim.openstreetmap.org/search/?q=' + postcode + ',london&countrycodes=gb&format=json&json_callback=?';
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