window.Slapdash = window.Slapdash || {};
Slapdash.Util = {
    
    _urlTemplates: {
        height: '%height%',
        width: '%width%'
    },
    
    debug: function(msg){
        if (console && console.log) console.log('Slapdash [DEBUG]: ' + msg);
    },

    showError: function(err){
        alert(err);
    },
    
    getSize: function(x){
        return (Slapdash.Config.spanSize * x) +
               (Slapdash.Config.spanMargin * (x - 1));
    },
    
    getUrl: function(graph,layoutElement){
        var url = graph.baseUrl + graph.url,
            width = Slapdash.Util.getSize(layoutElement[0]),
            height = Slapdash.Util.getSize(layoutElement[1]);
            params = graph.parameters;
        
        if (graph.templateUrl){
            url = url.replace(Slapdash.Util._urlTemplates.height, height);
            url = url.replace(Slapdash.Util._urlTemplates.width, width);
        }
        else {
            _.extend(params, {width:width, height:height});
        }
        
        url += (url.indexOf("?") >= 0) ? "&" : "?";
        url += $.param(params);
        
        return url;
    }
}