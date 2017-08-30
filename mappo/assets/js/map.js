jQuery(document).ready(function ($) {
    //Declaring variables for map, creating empty arrays
    var map
    var openedWindow = false;
    var markers = new Array();
    var markerList = new Array();
    var uniques = new Array();
    // Marker icon types
    var rentIcon = "http://i.imgur.com/LHyG4IN.png";
    var serviceIcon = "http://i.imgur.com/Qrhjnsv.png";
    var parkIcon = "http://i.imgur.com/4zpJ35s.png";
    // Access  data.JSON  
    var requestURL = 'https://raw.githubusercontent.com/IndigoVerge/candidates/master/maps_velo_guide/data.json';
    
    // Loading the map
    function initialize() {
        var mapCanvas = document.getElementById('map');
        var myLatlng = new google.maps.LatLng(42.6840, 23.3210);
        var mapOptions = {
            center: myLatlng,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(mapCanvas, mapOptions);
        //Retrieving data from JSON Data 
        $.getJSON(requestURL, function (services) {
            $.each(services, function (i, services) {
                // Creating new markers on the map
                addMarker(services);
                // Appending data type in select to show them  as a filter
                markerList.push(services.type);
                uniques = markerList.filter(function (item, i, ar) {
                    return ar.indexOf(item) === i;
                });

            });
            $.each(uniques, function (i, item) {
                $('#options').append($('<option>', {
                    value: item,
                    text: item
                }));
            });
        });
    }

    function addMarker(object) {
        // Setting icons for each object type
        var icons = {
            rent: {
                icon: rentIcon
            },
            service: {
                icon: serviceIcon
            },
            parking: {
                icon: parkIcon
            }
        };
        
        var name = object.name;
        var contact = object.contact;
        var type = object.type;
        var lat = object.latitude;
        var lon = object.longitude;
        // Setting InfoBox to the markers
        if(jQuery.isEmptyObject(contact)){
            contact="call us";
        }
        var contentString = '<div id="content">' +
                '<h1>' + name + '</h1>' +
                '<p>' + type + '</p>' +
                '<a target="_blank" href="' + contact + '">' + contact + '</a>' +
                '</div>';

        var infoWindow = new google.maps.InfoWindow({
            content: contentString
        });

        var categories = [
            type
        ];
        // Initializing the markers with their positions, categories(object types, icons
        myLatlng = new google.maps.LatLng(lat, lon);
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            categories: categories,
            icon: icons[object.type].icon,
            animation: google.maps.Animation.DROP

        });
        // Close InfoBox when click on another marker
        marker.addListener('click', function () {
            if (openedWindow) {
                openedWindow.close();
            }
            openedWindow = infoWindow;
            openedWindow.open(map, marker);

        });
        // Creating array of markers
        markers.push(marker);

    }
    // Filtering markers by categories
    filterMarkers = function (categories) {
        var bounds = new google.maps.LatLngBounds();
        
        for (i = 0; i < markerList.length; i++) {
            marker = markers[i];
            if (marker.categories == categories || categories.length === 0) {
                marker.setVisible(true);
                bounds.extend(marker.getPosition());
                map.fitBounds(bounds);
            } else {
                marker.setVisible(false);
                
            }
        }
    };

    google.maps.event.addDomListener(window, 'load', initialize);
});