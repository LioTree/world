var mp;

function newMap(c){
	mp = new BMap.Map(c);
    var point = new BMap.Point(116.404,39.915);
   	var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});
	//var top_left_navigation = new BMap.NavigationControl();
	var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); 
    mp.centerAndZoom(point,5);
    mp.enableScrollWheelZoom(true);
    mp.addControl(top_left_control);        
	//mp.addControl(top_left_navigation);     
	mp.addControl(top_right_navigation); 
}
function label(lon,lat,str){
	var point=new BMap.Point(lon,lat);
	var marker=new BMap.Marker(point);
	mp.addOverlay(marker);
	var label=new BMap.Label(str);
	marker.setLabel(label);
}
function mclick(f){
	mp.addEventListener("click",function(e){
		f(e.point.lng,e.point.lat);
	});
}
function mclear(){
	mp.clearOverlays();
}

