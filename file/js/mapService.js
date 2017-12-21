app.service('mapSev', function() {
        return  function getAddress(province,city,district,areaname,areaid){
			//console.info("省："+province+"市："+city+"区："+district+"小区名称："+areaname+"详细地址id"+areaid)
			var map = new BMap.Map("container");          
			var myGeo = new BMap.Geocoder();  
			var adrs = province+city+district;
			myGeo.getPoint(adrs, function(point){   
				var options = {      
				      onSearchComplete: function(results){      
				          if (local.getStatus() == BMAP_STATUS_SUCCESS){
				              document.getElementById(areaid).value = results.getPoi(0).address; 
				          }      
				      }      
				 }; 
				var local = new BMap.LocalSearch(map, options);      
				local.search(areaname);
		      }, province);
		      
		}
    
    
});