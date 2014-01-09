/*
    Copyright info goes here... 
*/
jQuery(document).ready(function(){!function(e,t){e.community_map={},function(e){e.widget("custom.community_map",{_create:function(){this.options.types=[],this.options.icons=[],this.options.point_layers=[],this.options.outline_url=this.element.attr("data-map-outline-url"),this.options.url=this.element.attr("data-map-url"),this.options.fixed_layer_url=this.element.attr("data-map-fixed-layer-url"),this.options.filterField=this.element.attr("data-map-filter-on"),this.options.zoom=parseInt(this.element.attr("data-map-zoom")),this.options.centre=this.element.attr("data-map-centre").split(","),this.options.lat=parseFloat(this.options.centre[0]),this.options.lng=parseFloat(this.options.centre[1]),this.options.postcode_search=this.element.attr("data-map-postcode-search"),this.options.searchType=this.element.attr("data-map-search-type"),this.options.elem=this.element,this.options.outline_style={color:"#004a86",fillColor:"#fff",weight:3,opacity:1,fillOpacity:.3},console.log(this.options),community_map.drawMap(this.options)}})}(jQuery,e),Array.prototype.filter||(Array.prototype.filter=function(e,t){var a,r,o,i=[];if(!this||"function"!=typeof e||e instanceof RegExp)throw new TypeError;for(o=this.length,a=0;o>a;a++)this.hasOwnProperty(a)&&(r=this[a],e.call(t,r,a,this)&&i.push(r));return i}),community_map.htmlDecode=function(e){var a=t.createElement("div");return a.innerHTML=e,0===a.childNodes.length?"":a.childNodes[0].nodeValue},community_map.addPlaceholder=function(){"undefined"==typeof Modernizr&&(jQuery("[placeholder]").focus(function(){var e=jQuery(this);e.val()==e.attr("placeholder")&&(e.val(""),e.removeClass("placeholder"))}).blur(function(){var e=jQuery(this);(""==e.val()||e.val()==e.attr("placeholder"))&&(e.addClass("placeholder"),e.val(e.attr("placeholder")))}).blur(),jQuery("[placeholder]").parents("form").submit(function(){jQuery(this).find("[placeholder]").each(function(){var e=jQuery(this);e.val()==e.attr("placeholder")&&e.val("")})}))},community_map.sameOrigin=function(a){var r=t.createElement("a");return r.href=a,r.protocol+r.host===e.location.protocol+e.location.host},community_map.getJSON=function(e,t,a){community_map.sameOrigin(e)||(e+="?callback=?");var r=function(e){console.log("retrived geojson object "),e.features&&(e.features=e.features.filter(function(e){return e})),a(e,t)};jQuery.getJSON(e,r)},community_map.discoverTypes=function(e,t){t.data=e;var t=t;jQuery.each(t.data.features,function(e,a){for(var r=!0,o=0;o<t.types.length;o++)a.properties[t.filterField]==t.types[o].name&&(r=!1);if(r){var i=a.properties[t.filterField];if(""!==i&&null!==i){if(a.properties.uri_rendered)var n=L.icon({iconUrl:a.properties.uri_rendered,Size:[32,32],iconAnchor:[16,32],popupAnchor:[0,-32]}),s=a.properties.uri_rendered;else icon=null,s=null;t.types.push({icon:n,name:i,icon_url:s,count:0})}}}),community_map.sortTypes(t),community_map.addTypesToFeatuers(t),"drop-down"==t.searchType?community_map.renderDropDown(t):"auto-suggest"==t.searchType?community_map.renderAutoSuggest(t):"key"==t.searchType&&(console.log("rendering key"),community_map.renderKey(t))},community_map.addTypesToFeatuers=function(e){var e=e;jQuery.each(e.data.features,function(t,a){for(var r=0;r<e.types.length;r++)a.properties[e.filterField]==e.types[r].name&&(a.properties.type_id=r,e.types[r].count++)})},community_map.sortTypes=function(e){e.types.sort(function(e,t){var a=e.name.toLowerCase(),r=t.name.toLowerCase();return r>a?-1:a>r?1:0})},community_map.addListItem=function(e,t){var a=t,r="<div class='list_item type_"+e.properties.type_id+"'>";e.properties.uri_rendered&&(r+="<img src='"+e.properties.uri_rendered+"' class='list_view_icon' />"),r+=e.properties.nothing_rendered?e.properties.nothing_rendered:e.properties.name,r+="<br class='clearfix'/></div >",jQuery(".list_container",a.elem).append(r)},community_map.addLayer=function(e,t){var a=t,r=jQuery(".list_view_empty_warning",a.elem);r&&r.remove(),a.point_layers[e]||(a.point_layers[e]=L.geoJson(a.data,{onEachFeature:function(e,t){if(a.types[e.properties.type_id].icon){{t.setIcon(a.types[e.properties.type_id].icon)}t.options.title=e.properties.name.replace(/(<([^>]+)>)/gi,""),t.options.alt=e.properties.name.replace(/(<([^>]+)>)/gi,"")}e.properties.nothing_rendered?t.bindPopup(e.properties.nothing_rendered):t.bindPopup(e.properties.name),community_map.addListItem(e,a)},filter:function(t){return t.properties.type_id==e?!0:!1}}).addTo(a.map))},community_map.addAllLayers=function(e){for(var t=0;t<e.types.length;t++)community_map.addLayer(t,e)},community_map.addAllListItems=function(e){for(var t=0;t<e.data.features.length;t++)community_map.addListItem(e.data.features[t],e)},community_map.sortListItems=function(e){var t=e,a=jQuery(".list_container",t.elem),r=a.children().sort(function(e,t){var a=jQuery(".map-pin-title > a",e).text().toUpperCase(),r=jQuery(".map-pin-title > a",t).text().toUpperCase();return r>a?-1:a>r?1:0});console.log("Sorting %d items...",a.children().length),a.empty(),a.append(r)},community_map.addFixedLayer=function(e,t){console.log("adding fixed layer"),t.fixed_layer_data=e;var a=t;a.fixed_layer=L.geoJson(a.fixed_layer_data,{onEachFeature:function(e,t){var r=L.icon({iconUrl:e.properties.uri_rendered,iconSize:[39,50],iconAnchor:[19,50],popupAnchor:[0,-50]});e.properties.uri_rendered&&(t.setIcon(r),t.options.alt=e.properties.name.replace(/(<([^>]+)>)/gi,"")),community_map.addListItem(e,a),t.bindPopup(e.properties.name)}}).addTo(a.map);var r=a.fixed_layer_data.features[0].properties.uri_rendered,o="<div class='key_item' ><img src='"+r+"' /><p>"+a.fixed_layer_data.features[0].properties.name.replace(/(<([^>]+)>)/gi,"")+"</p></div>";jQuery(".fixed_layer_key",a.elem).append(o)},community_map.removeLayer=function(e,t){var a=t;t.point_layers[e]&&(t.map.removeLayer(t.point_layers[e]),t.point_layers[e]=null,jQuery(".list_container .type_"+e,a.elem).remove());var r=jQuery(".list_container",a.elem);0===r.children().length&&r.html("<p class='list_view_empty_warning' >You don't have any pins selected</p>")},community_map.removeAllLayers=function(e){for(var t=e,a=0;a<t.types.length;a++)"undefined"!==t.types[a]&&community_map.removeLayer(a,t);jQuery(".list_container",t.elem).empty(),jQuery(".list_container",t.elem).html("<p class='list_view_empty_warning' >You don't have any pins selected</p>")},community_map.hereIAmMarker=function(e,t,a){var r=a;r.hereMarker&&r.map.removeLayer(r.hereMarker);var o=new L.icon({iconUrl:"http://lambeth.coop/sites/all/modules/custom/lambeth_interactive_map/img/here_i_am.png",iconSize:[39,50],iconAnchor:[19,50],popupAnchor:[0,-50]});r.hereMarker=L.marker([e,t],{icon:o}).addTo(r.map)},community_map.removeHereIAmMarker=function(e){console.log("removing here I am marker"),e.map.removeLayer(e.hereMarker),e.hereMarker=null},community_map.renderOutline=function(e,t){maps_object=t,maps_object.outline=e,console.log(maps_object.outline),L.geoJson(maps_object.outline,{style:t.outline_style}).addTo(t.map)},community_map.postcodeLookup=function(e,t){var a=t;for(jQuery(".warning",a.elem).remove(),address_array=e.split(" "),i=0;i<address_array.length;i++)6!=address_array[i].length||"SW2"!=address_array[i].toUpperCase().substr(0,3)&&"SW9"!=address_array[i].toUpperCase().substr(0,3)||(address_array[i]=address_array[i].slice(0,3)+" "+address_array[i].slice(3));jQuery(".postcode_lookup",a.elem).append('<img src="/sites/all/modules/custom/lambeth_interactive_map/img/loading.gif" class="loading_gif" alt="loading" />'),e=address_array.join(" "),e=encodeURIComponent(e);var r="http://nominatim.openstreetmap.org/search?format=json&q="+e+'&bounded=1&boundingbox="51.417986,51.507918,-0.078743,-0.15216"&json_callback=?';jQuery.getJSON(r,function(e){jQuery(".loading_gif",a.elem).remove(),jQuery(".clear_postcode_search",a.elem).show(),"undefined"==typeof e[0]?(jQuery(".postcode_lookup",a.elem).append('<p style="display:none" class="warning">No results found</p>'),jQuery(".warning",a.elem).slideDown("slow").delay(5e3).slideUp("slow",function(){jQuery(".warning",a.elem).remove()})):(jQuery(".warning",a.elem).remove(),a.map.setView([e[0].lat,e[0].lon],15),community_map.hereIAmMarker(e[0].lat,e[0].lon,a))})},community_map.drawMap=function(e){if(jQuery(e.elem).append("<div class='outside_container'></div>"),e.searchType||"true"===e.postcode_search){jQuery(".outside_container",e.elem).addClass("map_with_controls");var t='<div class="controls_container"></div>';jQuery(".outside_container",e.elem).append(t)}jQuery(".outside_container",e.elem).append("<div class='display_container'></div>");var t="<div class='view_tabs' > <a  class='map_view_tab selected_tab' >Map View</a>  <a class='list_view_tab' >Text View</a> </div>";t+='<div class="list_container"></div>',t+='<div class="leaflet_container"></div>',jQuery(".display_container",e.elem).append(t),community_map.changeViewEvents(e),"true"===e.postcode_search&&community_map.renderPostcodeLookup(e),t='<div class="fixed_layer_key"><div>',jQuery(".controls_container",e.elem).append(t),e.map=L.map(jQuery(".leaflet_container",e.elem)[0],{scrollWheelZoom:!1}).setView([e.lat,e.lng],e.zoom),L.tileLayer("http://{s}.tile.cloudmade.com/e7b61e61295a44a5b319ca0bd3150890/997/256/{z}/{x}/{y}.png").addTo(e.map),community_map.getJSON(e.outline_url,e,community_map.renderOutline),community_map.getJSON(e.url,e,community_map.discoverTypes),e.fixed_layer_url&&community_map.getJSON(e.fixed_layer_url,e,community_map.addFixedLayer)},community_map.changeViewEvents=function(e){var t=e;jQuery(".map_view_tab",t.elem).click(function(){jQuery(".leaflet_container",t.elem).show(),jQuery(".map_view_tab",t.elem).addClass("selected_tab"),jQuery(".list_container",t.elem).hide(),jQuery(".list_view_tab",t.elem).removeClass("selected_tab"),jQuery(".postcode_input",t.elem).attr("disabled",!1)}),jQuery(".list_view_tab",t.elem).click(function(){""==jQuery(".list_container",t.elem).text()&&jQuery(".list_container",t.elem).html("<p class='list_view_empty_warning' >You don't have any pins selected</p>"),jQuery(".list_container",t.elem).show(),jQuery(".list_view_tab",t.elem).addClass("selected_tab"),jQuery(".leaflet_container",t.elem).hide(),jQuery(".map_view_tab",t.elem).removeClass("selected_tab"),jQuery(".postcode_input",t.elem).attr("disabled",!0)})},community_map.renderDropDown=function(e){var t=e,a='<label class="drop_down_label">Search by waste item</label><select class="type_selector"></selector>';jQuery(".controls_container",t.elem).append(a),jQuery.each(t.types,function(e,a){jQuery(".type_selector",t.elem).append("<option value='"+e+"'>"+a.name+"</option>")}),jQuery(".type_selector",t.elem).unbind(),jQuery(".type_selector",t.elem).change(function(){community_map.removeAllLayers(t);var e=jQuery(this).val();community_map.addLayer(parseInt(e),t),community_map.sortListItems(t)})},community_map.renderAutoSuggest=function(e){var t=e,a='<div class="autosuggest">Where can I get rid of... </span><input type="text" class="type_suggest" /></div>';jQuery(".controls_container",this.elem).append(a),jQuery(".type_suggest",this.elem).autocomplete({source:t.types,change:function(e,a){layer_id=a.item.key,t.addLayer(layer_id),community_map.sortListItems(t)},select:function(e,a){layer_id=a.item.key,t.addLayer(layer_id),community_map.sortListItems(t)}})},community_map.renderKey=function(e){var t=e,a="<div class='key'></div>";if(jQuery(".controls_container",t.elem).append(a),jQuery.each(t.types,function(e,a){var r=a.icon_url,o="<div class='key_item individual_layer' >";o+="<img src='"+r+"' /><label for='checkbox_"+a.name+"'>"+a.name+" ("+a.count+")</label><input  id='checkbox_"+a.name+"' type='checkbox' value='"+e+"' />",o+="<div class='key_divider clearfix'></div></div>",jQuery(".key",t.elem).append(o)}),t.types.length>2){var a="<div class='key_item all_values' >";a+="<label for='checkbox_all'>All ("+t.data.features.length+")</label><input id='checkbox_all' type='checkbox' value='all' />",a+="<div class='key_divider clearfix'></div></div>",a+="<p class='only_show_label'>Only show: </p>",jQuery(".key",t.elem).prepend(a)}1==t.types.length&&(community_map.addLayer(0,t),jQuery(".key_item input:first",t.elem).attr("checked","checked"),community_map.sortListItems(t)),jQuery(".key_item input",t.elem).unbind(),jQuery(".individual_layer input",t.elem).change(function(){jQuery(".all_values input",t.elem).prop("checked")&&(jQuery(".all_values input",t.elem).removeAttr("checked"),community_map.removeAllLayers(t));var e=jQuery(this).val();jQuery(this).is(":checked")?(community_map.addLayer(parseInt(e),t),community_map.sortListItems(t)):community_map.removeLayer(parseInt(e),t)}),jQuery(".all_values input",t.elem).unbind(),jQuery(".all_values input",t.elem).change(function(){jQuery(".individual_layer input",t.elem).removeAttr("checked"),jQuery(this).is(":checked")?(community_map.addAllLayers(t),community_map.sortListItems(t)):community_map.removeAllLayers(t)})},community_map.renderPostcodeLookup=function(e){var t=e,a='<div class="postcode_lookup"><label>Search by location: </label><input type="text" placeholder="postcode or address" class="postcode_input"  /><input type="button" class="postcode_submit" /><a class="clear_postcode_search">&raquo; Clear search</a></div>';jQuery(".controls_container",t.elem).append(a),community_map.addPlaceholder(),jQuery(".postcode_submit",t.elem).click(function(){var e=jQuery(".postcode_input",t.elem).val();community_map.postcodeLookup(e,t)}),jQuery(".clear_postcode_search",this.elem).click(function(){var e=jQuery(".postcode_input",t.elem).val();community_map.clearPostcodeLookup(e,t)}),jQuery(".postcode_input",this.elem).keyup("enterKey",function(e){if(13===e.keyCode){var a=jQuery(".postcode_input",t.elem).val();community_map.postcodeLookup(a,t)}})},community_map.clearPostcodeLookup=function(e,t){jQuery(".postcode_input",t.elem).val(""),t.map.setView([t.lat,t.lng],t.zoom),jQuery(".clear_postcode_search",t.elem).hide(),community_map.removeHereIAmMarker(t)}}(window,document),L.Icon.Default.imagePath="images",jQuery(".lambeth_map").community_map()});