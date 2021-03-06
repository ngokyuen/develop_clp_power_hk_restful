//const {createStore} = Redux;

const MapStoreReducer = (state=[], action)=> {
  switch (action.type){
    case 'uploadClientAddMarkers':
    try {
      fetch('../api/stations',{
        method: "POST",
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: 'provider='+ encodeURIComponent(action.provider) +'&data='+ encodeURIComponent(JSON.stringify(action.clientAddMarkersDetail))}
      ).then((response)=>{
        return response.json();
      }).then((json)=>{
          if (json.result === 'true') {
            alert("Upload Successfully");
            action.dispatch({type:'uploadClientAddMarkersSuccess' });
          } else {
            action.dispatch({type:'uploadClientAddMarkersFail'});
          }
      })
    // console.log(encodeURIComponent(JSON.stringify(action.payload.mapdetails)));
    } catch (e) {
      console.log(e);
      action.dispatch({type:'uploadClientAddMarkersFail'});
    }
    return {
      ...state, type:'uploadClientAddMarkers',
    }
    case 'uploadClientAddMarkersSuccess':
      state.clientAddMarkers.map((clientAddMarker)=>{
        clientAddMarker.setMap(null);
      })
      return {
        ...state, type: 'uploadClientAddMarkersCompleted' ,clientAddMarkers: []
      }
    case 'updateClientAddMarkersDetail':
      return {
        ...state, type: 'updateClientAddMarkersDetail',
      }

    case 'closeMarkerDetailDialog':
      return {
        ...state, type: 'closeMarkerDetailDialog',
      }

    case 'deleteClientAddMarker':
      //filter client added marker
      state.clientAddMarkers = state.clientAddMarkers.filter(
        (clientAddMarker,index) => {
          if (index !== action.payload){
            return true;
          } else {
            clientAddMarker.setMap(null);
            return false;
          }
        }
      );

      return {
        ...state, type: 'deleteClientAddMarker', delete_index: action.payload,
      }

    case 'mapMoveTo':
      return {
        ...state, type: 'mapMoveTo', lat: action.lat, lng: action.lng
      }

    case 'addClientMarkers':
      return {
        ...state, type: 'addClientMarkers', clientAddMarkers: action.payload
      }

    //will update the client add markers and google geolocation
    //to: map.js & client_add_map.js
    case 'addClientMarkersSuccess':
      return {
        ...state, type: 'addClientMarkersSuccess'
      }

    case 'filterMapItems':
      const result = state.Markers.filter((item)=>{
        if (item.address.toUpperCase().indexOf(action.filterAddress.toUpperCase()) > -1 && item.provider.toUpperCase().indexOf(action.filterProvider.toUpperCase())>-1)
          return true;
      });
      return {
        ...state, type: 'filterMapItems', FilteredMarkers: result
      }

    case 'filterMapItemsSuccess':
      return {
        ...state, type: 'filterMapItemsSuccess', FilteredMarkers: ''
      }

    case 'getMapItems':
      try {
         fetch ("../api/stations").then((response)=>{
           response.json().then((json)=>{
             console.log(json);
             action.dispatch({type: 'getMapItemsSuccess', Markers:json});
           });
         });
      } catch (e){
        console.log(e);
        action.dispatch({type: 'getMapItemsFail'});
      }
      return {
        ...state, type: 'getMapItems'
      }

    case 'getMapItemsSuccess':
      return {
        ...state, type: 'getMapItemsSuccess', Markers:action.Markers
      }

    case 'clearMapListItems':
      state.addMapListItems = [];
      return {
        ...state, type: 'filterMapSuccess'
      }

    case 'addMapListItem':
      const data = action.payload.stationList.station;
      state.addMapListItems.push(data);
        return {
          ...state, type: 'addMapListItem'
        }

    case 'deleteMapListItem':
      const place_id = action.payload;
      return {
      ...state, type: 'deleteMapListItem',
        addMapListItems: state.addMapListItems.filter((item)=> {
          return item.result.place_id != place_id;
        }),
      }

    case 'addMapListItemsToApi':
        try {
          fetch('../api/api.php?format=json&lang=en&action=addMapDetail',{
            method: "POST",
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: 'provider='+ encodeURIComponent(action.payload.provider) +'&mapdetails='+ encodeURIComponent(JSON.stringify(action.payload.mapdetails))}
          ).then(function(response){
            //console.log(encodeURIComponent(JSON.stringify(action.payload.mapdetails)));
            //alert(response.json());
            response.json().then(function (json){
              if (json.result === 'true') {
                alert("Create Successfully");
                action.dispatch({type:'clearMapListItems'});
              }
            });
          })
          return {
            ...state
          }
        // console.log(encodeURIComponent(JSON.stringify(action.payload.mapdetails)));
        } catch (e) {
          console.log(e);
        }

    default:
      return {
        ...state, type: action.type
      }
  }
}


//const MapStore = createStore(MapStoreReducer);
