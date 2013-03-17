window.Dashboard = window.Dashboard || {};
Dashboard.Util = {
    
    _urlTemplates: {
        height: '%height%',
        width: '%width%'
    },
    
    debug: function(msg){
        if (console && console.log) console.log('Dash: ' + msg);
    },

    showError: function(err){
        alert(err);
    },
    
    getSize: function(x){
        return (Dashboard.Config._values.spanSize * x) +
               (Dashboard.Config._values.spanMargin * (x - 1));
    },
    
    getUrl: function(graph,layoutElement){
        var url = graph.baseUrl + graph.url,
            width = Dashboard.Util.getSize(layoutElement[0]),
            height = Dashboard.Util.getSize(layoutElement[1]);
            params = _.extend({},graph.parameters,{width:width,height:height});
        url += (url.indexOf("?") >= 0) ? "&" : "?";
        url += $.param(params);
        
        if (graph.templateUrl){
            url = url.replace(Dashboard.Util._urlTemplates.height, height);
            url = url.replace(Dashboard.Util._urlTemplates.width, width);
        }
        
        return url;
    }
}