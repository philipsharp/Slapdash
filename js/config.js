window.Slapdash = window.Slapdash || {};
Slapdash.Config = {
    
    _values: {
        width: 940,
        spanSize: 60,
        spanMargin: 20,
        
        // Defaults for user-configured objects
        defaults: {
            dashboard: {
                name: null,
                refresh: 60,
                background: "#000"
            },
            graph: {
                baseUrl: "",
                url: "",
                parameters: {},
                templateUrl: false
            }
        },
        
        dashboards: {},
        graphs: {},
        layouts: {
            "full": [[12,6]],
            "halfs": [[6,3],[6,3]],
            "thirds": [[4,2],[4,2],[4,2]],
            "quarters": [[3,2],[3,2],[3,2],[3,2]],
            "one-by-three":[[8,4],[4,2],[4,2],[4,2]],
        }
    },

    load: function(){
        var deferred = $.Deferred();
        Slapdash.Config._loadGraphs().success(function(){
            Slapdash.Config._loadDashboards().success(function(){
                deferred.resolve();
            })
        });
        return deferred.promise();
    },
    
    _loadGraphs: function(){
        return $.getJSON('config/graphs.json', function(data, textStatus, jqXHR){
            var graphs = Slapdash.Config._process(data,Slapdash.Config._values.defaults.graph);
            if (_.isObject(graphs)){
                Slapdash.Config._values.graphs = graphs;
            }
            else {
                Slapdash.Util.showError(_.isString(graphs) ? graphs : "Failed to process graph configuration.");
            }
        })
        .error(function(){
            Slapdash.Util.showError('Failed to load graph configuration.');
        });
    },
    
    _loadDashboards: function(){
        return $.getJSON('config/dashboards.json', function(data, textStatus, jqXHR){
            var dashboards = Slapdash.Config._process(data,Slapdash.Config._values.defaults.dashboard,Slapdash.Config._postProcessDashboards);
            if (_.isObject(dashboards)){
                Slapdash.Config._values.dashboards = dashboards;
            }
            else {
                Slapdash.Util.showError(_.isString(dashboards) ? dashboards : "Failed to process dashboard configuration.");
            }
            
        })
        .error(function(){
            Slapdash.Util.showError('Failed to load dashboard configuration.');
        });
    },
    
    _process: function(data,defaults,postProcess){
        var prepared = {},
            final = {},
            key,
            item,
            parentKey,
            parent;
        
        prepared._default = defaults;
        
        for(key in data){
            if (key == "_default"){
                return "Object key cannot be '_default'.";
            }
            
            if (!_.isUndefined(prepared[key])){
                return "Cannot redeclare object '" + key + "'.";
            }
            
            item = data[key];
            parentKey = item.extends || "_default";
            
            if (_.isUndefined(prepared[parentKey])){
                return "Unknown object parent '" + parentKey + "'.";
            }
            
            parent = prepared[parentKey];
            
            //@TODO Non-jQuery deep extend?
            prepared[key] = $.extend(true, {}, parent, item);
            
            if (key.substr(0,1) != "_"){
                final[key] = prepared[key];
            }            
        }
        
        return postProcess ? postProcess(final) : final;
    },
    
    _postProcessDashboards: function(config){
        var dashboardKey,
            dashboardConfig,
            rowIndex,
            row,
            graphIndex;
        
        for(dashboardKey in config){
            dashboardConfig = config[dashboardKey];
            if(!_.isArray(dashboardConfig.rows)){
                return "No row definitions for dashboard '" + dashboardKey + "'";
            }
            for(rowIndex in dashboardConfig.rows){
                row = dashboardConfig.rows[rowIndex];
                if (!_.isObject(row)){
                    return "Invalid row definition in dashboard '" + dashboardKey + "'";
                }
                if (!_.isString(row.layout)){
                    return "Missing layout in dashboard '" + dashboardKey + "', row #" + rowIndex;
                }
                if (_.isUndefined(Slapdash.Config._values.layouts[row.layout])){
                    return "Unknown layout '" + row.layout + "' in dashboard '" + dashboardKey + "', row #" + rowIndex;
                }
                if (!_.isArray(row.graphs)){
                    return "Missing graphs in dashboard '" + dashboardKey + "', row #" + rowIndex;
                }
                if (row.graphs.length != Slapdash.Config._values.layouts[row.layout].length){
                    return "Incorrect number of graphs for '" + row.layout + "' in dashboard '" + dashboardKey + "', row #" + rowIndex;                    
                }
                for(graphIndex in row.graphs){
                    if (_.isUndefined(Slapdash.Config._values.graphs[row.graphs[graphIndex]])){
                        return "Unknown graph '" + row.graphs[graphIndex] + "' in dashboard '" + dashboardKey + "', row #" + rowIndex;
                    }
                }
                
            }
            config[dashboardKey].name = config[dashboardKey].name || dashboardKey;
        }
        return config;
    }
    
}