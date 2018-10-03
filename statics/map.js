var mp;

function newMap(c){
					mp = new BMap.Map(c);
                    var point = new BMap.Point(116.404,39.915);
                    mp.centerAndZoom(point,5);
                    mp.enableScrollWheelZoom(true);
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
